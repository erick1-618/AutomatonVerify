package com.erick.autoverify_api.exception.exceptions;

public class InvalidFieldException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidFieldException(String field) {
		super("Field with name '" + field + "' is invalid.");
	}
	
	public InvalidFieldException(String field, String message) {
		super("Field with name '" + field + "' is invalid: " + message);
	}
}
