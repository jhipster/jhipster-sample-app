package com.mycompany.myapp.domain.util;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;

@JsonAutoDetect(fieldVisibility = Visibility.ANY)
public class TestConstants implements Serializable {

	public final String[] HTTP_METHODS = { "GET", "POST", "PUT", "PATCH",
			"DELETE", "COPY", "HEAD", "OPTIONS", "LINK", "UNLINK", "PURGE" };
	public final String[] MEDIA_TYPES = { "XML", "JSON" };

}
