package com.mycompany.myapp.domain.util;

import java.io.Serializable;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.Suite;
import com.mycompany.myapp.domain.Test;
import com.mycompany.myapp.domain.TestConfig;
import com.mycompany.myapp.domain.type.TestType;

/**
 * Utility class to test Hibernate entities in memory
 */
@FixMethodOrder(MethodSorters.NAME_ASCENDING)	// yucky hack
public class HibernateUtil {

	// hacks for Junit to share variables at test level
	private static UUID PROJECT_ID;
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
		
		config.setEnvironment(new HashMap<String, String>(){{
			put("URL", "sso.coupons.com");
			put("test", "test_value");
		}});
		config.setInputBody("{\n" + 
				"  \"array\": [\n" + 
				"    1,\n" + 
				"    2,\n" + 
				"    3\n" + 
				"  ],\n" + 
				"  \"boolean\": true,\n" + 
				"  \"null\": null,\n" + 
				"  \"number\": 123,\n" + 
				"  \"object\": {\n" + 
				"    \"a\": \"b\",\n" + 
				"    \"c\": \"d\",\n" + 
				"    \"e\": \"f\"\n" + 
				"  },\n" + 
				"  \"string\": \"Hello World\"\n" + 
				"}");
		config.setAssertions(new HashMap<String, String>(){{
			put("array", "[1,2,3]");
			put("boolean", "true");
		}});
		
		// save the primary side with cascade to oneToOne config
		test = saveTypeAndFlush(test);
		TEST_ID = test.getTestId();
	}
	
	@org.junit.Test
	public void test2AssertEntries() throws JsonProcessingException{
		Test test = getType(Test.class, TEST_ID);
		TestConfig config = getType(TestConfig.class, TEST_ID);
		Assert.assertFalse(config.getEnvironment().isEmpty());
		Assert.assertFalse(config.getAssertions().isEmpty());
		Assert.assertNotNull(config.getInputBody());
		
		ObjectMapper mapper = new ObjectMapper();
		System.out.println(mapper.writeValueAsString(test));
		
	}
}
