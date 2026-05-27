package io.github.jhipster.sample.config;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.test.context.ContextConfigurationAttributes;
import org.springframework.test.context.ContextCustomizer;
import org.springframework.test.context.ContextCustomizerFactory;
import org.springframework.test.context.MergedContextConfiguration;
import tech.jhipster.config.JHipsterConstants;

public class SqlTestContainersSpringContextCustomizerFactory implements ContextCustomizerFactory {

    private final Logger log = LoggerFactory.getLogger(SqlTestContainersSpringContextCustomizerFactory.class);

    private static SqlTestContainer prodTestcontainer;

    @Override
    public ContextCustomizer createContextCustomizer(Class<?> testClass, List<ContextConfigurationAttributes> configAttributes) {
        return new ContextCustomizer() {
            @Override
            public void customizeContext(ConfigurableApplicationContext context, MergedContextConfiguration mergedConfig) {
                ConfigurableListableBeanFactory beanFactory = context.getBeanFactory();
                TestPropertyValues testValues = TestPropertyValues.empty();
                EmbeddedSQL sqlAnnotation = AnnotatedElementUtils.findMergedAnnotation(testClass, EmbeddedSQL.class);
                boolean usingTestProdProfile = List.of(context.getEnvironment().getActiveProfiles()).contains(
                    "test" + JHipsterConstants.SPRING_PROFILE_PRODUCTION
                );
                if (null != sqlAnnotation && usingTestProdProfile) {
                    log.debug("detected the EmbeddedSQL annotation on class {}", testClass.getName());
                    log.info("Warming up the sql database");
                    if (null == prodTestcontainer) {
                        try {
                            Class<? extends SqlTestContainer> containerClass = Class.forName(
                                this.getClass().getPackageName() + ".DatabaseTestcontainer"
                            ).asSubclass(SqlTestContainer.class);
                            prodTestcontainer = beanFactory.createBean(containerClass);
                            beanFactory.registerSingleton(containerClass.getName(), prodTestcontainer);
                            /**
                             * ((DefaultListableBeanFactory)beanFactory).registerDisposableBean(containerClass.getName(), prodTestcontainer);
                             */
                        } catch (ClassNotFoundException e) {
                            throw new RuntimeException(e);
                        }
                    }
                    testValues = testValues.and("spring.datasource.url=" + prodTestcontainer.getTestContainer().getJdbcUrl() + "");
                    testValues = testValues.and("spring.datasource.username=" + prodTestcontainer.getTestContainer().getUsername());
                    testValues = testValues.and("spring.datasource.password=" + prodTestcontainer.getTestContainer().getPassword());
                }
                testValues.applyTo(context);
            }

            @Override
            public int hashCode() {
                return SqlTestContainer.class.getName().hashCode();
            }

            @Override
            public boolean equals(Object obj) {
                return this.hashCode() == obj.hashCode();
            }
        };
    }
}
