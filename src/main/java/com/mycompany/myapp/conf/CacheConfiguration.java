package com.mycompany.myapp.conf;

import com.codahale.metrics.ehcache.InstrumentedEhcache;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Ehcache; 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.ehcache.EhCacheCacheManager;
import javax.annotation.PreDestroy;
import java.util.SortedSet;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final Logger log = LoggerFactory.getLogger(CacheConfiguration.class);
    
    private net.sf.ehcache.CacheManager cacheManager; 
    
    @PreDestroy
    public void destroy() {
        log.info("Remove caching metrics");
        SortedSet<String> names = WebConfigurer.METRIC_REGISTRY.getNames();
        for (String name : names) {
            WebConfigurer.METRIC_REGISTRY.remove(name);
        }

        log.info("Closing Cache manager");
        cacheManager.shutdown();
    }

    @Bean
    public CacheManager cacheManager() {
        log.debug("Starting Ehcache");
        cacheManager = net.sf.ehcache.CacheManager.create();

        log.debug("Registring Ehcache Metrics gauges");
        Cache userCache = cacheManager.getCache("com.mycompany.myapp.domain.User");
        Ehcache decoratedStatusCache = InstrumentedEhcache.instrument(WebConfigurer.METRIC_REGISTRY, userCache);
        cacheManager.replaceCacheWithDecoratedCache(userCache, decoratedStatusCache);

        Cache authoritiesCache = cacheManager.getCache("com.mycompany.myapp.domain.Authority");
        Ehcache decoratedAuthoritiesCache = InstrumentedEhcache.instrument(WebConfigurer.METRIC_REGISTRY, authoritiesCache);
        cacheManager.replaceCacheWithDecoratedCache(authoritiesCache, decoratedAuthoritiesCache);

        Cache persistentTokenCache = cacheManager.getCache("com.mycompany.myapp.domain.PersistentToken");
        Ehcache decoratedPersistentTokenCache = InstrumentedEhcache.instrument(WebConfigurer.METRIC_REGISTRY, persistentTokenCache);
        cacheManager.replaceCacheWithDecoratedCache(persistentTokenCache, decoratedPersistentTokenCache);

        EhCacheCacheManager ehCacheManager = new EhCacheCacheManager();
        ehCacheManager.setCacheManager(cacheManager);
        return ehCacheManager;
    }

    
}
