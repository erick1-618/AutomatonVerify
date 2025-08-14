package com.erick.autoverify_api.response;

import java.util.Date;

import org.springframework.http.HttpStatus;

public class GlobalResponseEntity {

	private String[] message;

	private Date timestamp;

	private String statusCode;

	public GlobalResponseEntity(HttpStatus code, String... message) {
		this.statusCode = code.name();
		this.message = message;
		this.timestamp = new Date(System.currentTimeMillis());
	}

	public String getStatusCode() {
		return statusCode;
	}

	public String[] getMessage() {
		return message;
	}

	public Date getTimestamp() {
		return timestamp;
	}
}
