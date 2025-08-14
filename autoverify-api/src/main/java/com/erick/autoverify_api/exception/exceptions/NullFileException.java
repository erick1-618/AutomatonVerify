package com.erick.autoverify_api.exception.exceptions;

public class NullFileException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NullFileException() {
		super("File choosen is null");
	}
}
