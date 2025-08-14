package com.erick.autoverify_api.exception.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.erick.autoverify_api.exception.exceptions.InvalidFieldException;
import com.erick.autoverify_api.response.GlobalResponseEntity;

import io.jsonwebtoken.ExpiredJwtException;

@RestControllerAdvice
public class GlobalExceptionsHandler {

	@ExceptionHandler(InvalidFieldException.class)
	public ResponseEntity<GlobalResponseEntity> handleInvalidFieldException(InvalidFieldException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<GlobalResponseEntity> handleMissingServletRequestParameterException(
			MissingServletRequestParameterException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<GlobalResponseEntity> handleExpiredJwtException(ExpiredJwtException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.UNAUTHORIZED, ex.getMessage());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	}
}
