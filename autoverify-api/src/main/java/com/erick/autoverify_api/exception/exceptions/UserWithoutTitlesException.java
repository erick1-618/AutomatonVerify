package com.erick.autoverify_api.exception.exceptions;

public class UserWithoutTitlesException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public UserWithoutTitlesException() {
		
		super("The given user has no titles");
	}
}
