package com.mycompany.myapp.domain.type;

import java.io.IOException;
import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.usertype.UserType;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MapAsJsonType<K,V> implements UserType {

	private static final ObjectMapper mapper = new ObjectMapper();
	
	@Override
	public int[] sqlTypes() {
		return new int[]{Types.VARCHAR};
	}

	@Override
	public Class returnedClass() {
		return java.util.Map.class;
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean equals(Object x, Object y) throws HibernateException {
		
		Map<K,V> source = (Map<K, V>) x;
		Map<K,V> destination = (Map<K, V>) y;
		
		if(source == null && destination == null){
			return true;
		}
		
		// use AbstractMap equals for comparison
		return (source != null ? source.equals(destination) : 
			destination.equals(source));
	}

	@Override
	public int hashCode(Object x) throws HibernateException {
		return x.hashCode();
	}

	@Override
	public Object nullSafeGet(ResultSet rs, String[] names,
			SessionImplementor session, Object owner)
			throws HibernateException, SQLException {
		
		String map = rs.getString(names[0]);
		if(StringUtils.isEmpty(map)){
			return null;
		}
		
		try {
			return mapper.readValue(map,
				new TypeReference<HashMap<K, V>>() {
				});
		} catch (Exception e) {
			throw new HibernateException("unable to read as json: " + map, e);
		}
	}

	@Override
	public void nullSafeSet(PreparedStatement st, Object value, int index,
			SessionImplementor session) throws HibernateException, SQLException {
		if(value == null){
			st.setNull(index, Types.VARCHAR);
		}
		
		try {
			st.setString(index, mapper.writeValueAsString(value));
		} catch (JsonProcessingException e) {
			throw new HibernateException("could not write json value from string: " + value, 
				e);
		}
	}

	@Override
	public Object deepCopy(Object value) throws HibernateException {
		if(value == null) {
			return null;
		}
		return new HashMap<K,V>((Map<K,V>)value);
	}

	@Override
	public boolean isMutable() {
		return true;
	}

	@Override
	public Serializable disassemble(Object value) throws HibernateException {
		return new HashMap<K, V>((Map<K,V>)value);
	}

	@Override
	public Object assemble(Serializable cached, Object owner)
			throws HibernateException {
		return cached;
	}

	@Override
	public Object replace(Object original, Object target, Object owner)
			throws HibernateException {
		return original;
	}

}
