package com.erick.autoverify_api.exception.exceptions;

public class MissingParamException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public MissingParamException(String param) {
		super("The following param is missing: " + param);
	}
}
