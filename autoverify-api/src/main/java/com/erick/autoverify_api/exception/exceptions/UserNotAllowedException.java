package com.erick.autoverify_api.exception.exceptions;

public class UserNotAllowedException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UserNotAllowedException() {
		super("User not allowed");
	}
	
	public UserNotAllowedException(String message) {
		super("User not allowed: " + message);
	}
}
