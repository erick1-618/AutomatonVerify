package com.erick.autoverify_api.exception.exceptions;

public class TitleNotFoundException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public TitleNotFoundException() {
		super("Title not found");
	}
}
