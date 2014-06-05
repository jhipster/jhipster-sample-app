package com.mycompany.myapp.domain.type;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.usertype.UserType;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ListAsJsonType<K,V> implements UserType {

	private static final ObjectMapper mapper = new ObjectMapper();
	
	@Override
	public int[] sqlTypes() {
		return new int[]{Types.VARCHAR};
	}

	@Override
	public Class returnedClass() {
		return java.util.List.class;
	}

	@SuppressWarnings("unchecked")
	@Override
	public boolean equals(Object x, Object y) throws HibernateException {
		
		List<K> source = (List<K>) x;
		List<K> destination = (List<K>) y;
		
		if(source == null && destination == null){
			return true;
		}
		
		// TODO: use a better equals comparison
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
		
		String list = rs.getString(names[0]);
		if(StringUtils.isEmpty(list)){
			return null;
		}
		
		try {
			return mapper.readValue(list,
				new TypeReference<ArrayList<K>>() {
				});
		} catch (Exception e) {
			throw new HibernateException("unable to read as json: " + list, e);
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
		return new ArrayList<K>((List<K>)value);
	}

	@Override
	public boolean isMutable() {
		return true;
	}

	@Override
	public Serializable disassemble(Object value) throws HibernateException {
		return new ArrayList<K>((List<K>)value);
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
