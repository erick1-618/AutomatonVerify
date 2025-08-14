package com.erick.autoverify_api.exception.exceptions;

public class DuplicatedTitleException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DuplicatedTitleException() {
		super("A title with this content already exists");
	}
}
