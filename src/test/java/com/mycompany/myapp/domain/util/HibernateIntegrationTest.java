package com.mycompany.myapp.domain.util;

import java.io.IOException;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashMap;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;
import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.domain.Assertion;
import com.mycompany.myapp.domain.MediaType;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.ProjectEnvironment;
import com.mycompany.myapp.domain.Suite;
import com.mycompany.myapp.domain.Test;
import com.mycompany.myapp.domain.TestConfig;
import com.mycompany.myapp.domain.type.TestType;

/**
 * Utility class to test Hibernate entities in memory
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)	// yucky hack
public class HibernateIntegrationTest {

	// hacks for Junit to share variables at test level
	private static UUID PROJECT_ID;
	private static UUID PROJECT_ENVIRONMENT_ID;
	private static UUID SUITE_ID;
	private static UUID TEST_ID;
	private static Session SESSION;
	private static SessionFactory SESSION_FACTORY;
	
	@Before
	public void init() {
		if(SESSION_FACTORY == null) {
			Configuration config = new Configuration()
					.addPackage("com.mycompany.myapp.domain")
					.addAnnotatedClass(Project.class)
					.addAnnotatedClass(Suite.class)
					.addAnnotatedClass(Test.class)
					.addAnnotatedClass(TestConfig.class)
					.addAnnotatedClass(ProjectEnvironment.class)
					.setProperty("hibernate.connection.driver_class","org.h2.Driver")
					.setProperty("hibernate.connection.url", "jdbc:h2:mem:jhipster")
					.setProperty("hibernate.connection.username", "")
					.setProperty("hibernate.connection.password", "")
					.setProperty("hibernate.hbm2ddl.auto", "create-drop");
	
			StandardServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
					.applySettings(config.getProperties()).build();
	
			SESSION_FACTORY = config
					.buildSessionFactory(serviceRegistry);
	
			/*Session session = sessionFactory.openSession();
			Project project = (Project) session.get(Project.class,
					UUID.fromString("5c283680-d4e7-11e3-9c1a-0800200c9a66"));
			System.out.println(project);
			session.close();*/
		}
		
		SESSION = SESSION_FACTORY.openSession();
		SESSION.beginTransaction();
	}
	
	@After
	public void closeSession(){
		SESSION.getTransaction().commit();
		SESSION.close();
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getType(Class<T> clazz, Serializable obj){
		return (T) SESSION.get(clazz, obj);
	}
	
	@SuppressWarnings("unchecked")
	public <T> T saveTypeAndFlush(T t){
		Serializable obj = SESSION.save(t);
		SESSION.flush();
		return (T) getType(t.getClass(), obj);
	}
	
	public Project createProject(UUID uuid, String projectName){
		Project project = new Project();
		project.setProjectId(uuid);
		project.setProjectName(projectName);
		project = saveTypeAndFlush(project);
		PROJECT_ID = project.getProjectId();
		return project;
	}
	
	public Suite createSuite(UUID uuid, String suiteName, Project project){
		Suite suite = new Suite();
		suite.setSuiteId(uuid);
		suite.setSuiteName(suiteName);
		suite.setProject(project);
		suite = saveTypeAndFlush(suite);
		SUITE_ID = suite.getSuiteId();
		return suite;
	}

	@org.junit.Test
	public void test1CreatEntries(){
		Project project = createProject(UUID.randomUUID(), "projectName");
		ProjectEnvironment projectEnvironment = createProjectEnvironment(
				UUID.randomUUID(), "environmentName", 
				new HashMap<String,String>(){{
					put("URL", "dev.coupons.com");
					put("test", "test_value");
				}}, project);
		PROJECT_ENVIRONMENT_ID = projectEnvironment.getEnvironmentId();
		
		Suite suite = createSuite(UUID.randomUUID(), "suiteName", project);
		
		// Project project = getProject(UUID.fromString("5c283680-d4e7-11e3-9c1a-0800200c9a66"));
		Test test = new Test();
		test.setTestId(UUID.randomUUID());
		test.setTestType(TestType.REST.toString());
		test.setTestName("testName");
		test.setSuite(suite);
		// TEST_ID = saveTypeAndFlush(test).getTestId();
		
		TestConfig config = new TestConfig();
		
		// both one to one shared primary key association
		test.setTestConfig(config);
		config.setTest(test);
		config.setUrl("http://172.28.36.22:8080/coupons-nextgen-rest-provider/offers/recommended;");
		config.setHttpMethod(HttpMethod.POST);
		config.setEnvironment(new HashMap<String, String>(){{
			put("URL", "sso.coupons.com");
			put("test", "test_value");
		}});
		config.setHeaders(new HashMap<String, String>(){{
			put("Accept", "application/xml");
			put("Content-Type", "application/json");
		}});
		
		config.setInputMediaType(MediaType.JSON);
		config.setInputJSONBody("{" + 
				"  \"array\": [" + 
				"    1," + 
				"    2," + 
				"    3" + 
				"  ]," + 
				"  \"boolean\": true," + 
				"  \"null\": null," + 
				"  \"number\": 123," + 
				"  \"object\": {" + 
				"    \"a\": \"b\"," + 
				"    \"c\": \"d\"," + 
				"    \"e\": \"f\"" + 
				"  }," + 
				"  \"string\": \"Hello World\"" + 
				"}");
		config.setOutputMediaType(MediaType.XML);
		config.setOutputXMLBody(" <test><another>now</another></test> ");
		
		config.setAssertions(Arrays.asList(
			new Assertion("test/something/also", "test", false),
			new Assertion("test/something/also", "maybe", true)
		));
		
		// save the primary side with cascade to oneToOne config
		test = saveTypeAndFlush(test);
		TEST_ID = test.getTestId();
		
		
		// on TestExecution
		// save TestHistory
		
	}
	


	@org.junit.Test
	public void test2AssertEntries() throws IOException{
		ObjectMapper mapper = new ObjectMapper();
		
		ProjectEnvironment projectEnvironment = getType(ProjectEnvironment.class, PROJECT_ENVIRONMENT_ID);
		Assert.assertTrue(!projectEnvironment.getEnvironment().isEmpty());
		System.out.println(mapper.writeValueAsString(projectEnvironment.getEnvironment()));
				
		Test test = getType(Test.class, TEST_ID);
		TestConfig config = getType(TestConfig.class, TEST_ID);
		Assert.assertFalse(config.getEnvironment().isEmpty());
		Assert.assertFalse(config.getAssertions().isEmpty());
		Assert.assertNotNull(config.getInputJSONBody());
		
		System.out.println("Test: ");
		String testAsString = mapper.writeValueAsString(test);
		System.out.println(testAsString);
		test = mapper.readValue(testAsString, Test.class);
		System.out.println("Test as object: ");
		System.out.println(test);
		
		String configAsString = mapper.writeValueAsString(config);
		System.out.println("TestConfig: ");
		System.out.println(configAsString);
		
		config = mapper.readValue(configAsString, TestConfig.class);
		System.out.println("TestConfig as object: ");
		System.out.println(config);
		
	}
	
	@org.junit.Test
	public void test3ReadProject() throws IOException{
		Project project = getType(Project.class, PROJECT_ID);
		System.out.println(project);
		
		ObjectMapper mapper = new ObjectMapper();
		String projectAsJson = mapper.writeValueAsString(project);
		System.out.println("Project: ");
		System.out.println(projectAsJson);
		
		project = mapper.readValue(projectAsJson, Project.class);
		
	}
	
	private ProjectEnvironment createProjectEnvironment(
			UUID uuid, String environmentName, HashMap<String, String> environment, 
			Project project) {
		ProjectEnvironment projectEnvironment = new ProjectEnvironment();
		projectEnvironment.setEnvironmentId(uuid);
		projectEnvironment.setProject(project);
		projectEnvironment.setEnvironmentName(environmentName);
		projectEnvironment.setEnvironment(environment);
		
		projectEnvironment = saveTypeAndFlush(projectEnvironment);
		return projectEnvironment;
	}
}
