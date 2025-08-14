package com.erick.autoverify_api.exception.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.erick.autoverify_api.exception.exceptions.UserNotAllowedException;
import com.erick.autoverify_api.exception.exceptions.UserNotFoundException;
import com.erick.autoverify_api.exception.exceptions.UserWithoutTitlesException;
import com.erick.autoverify_api.response.GlobalResponseEntity;

@RestControllerAdvice
public class UserExceptionHandler {

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<GlobalResponseEntity> handleUserNotFoundException(UserNotFoundException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());

		return ResponseEntity.status(404).body(response);
	}

	@ExceptionHandler(UserWithoutTitlesException.class)
	public ResponseEntity<GlobalResponseEntity> handleUserWithouTitlesException(UserWithoutTitlesException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());

		return ResponseEntity.status(404).body(response);
	}

	@ExceptionHandler(UserNotAllowedException.class)
	public ResponseEntity<GlobalResponseEntity> handleUserNotAllowedException(UserNotAllowedException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}
}
