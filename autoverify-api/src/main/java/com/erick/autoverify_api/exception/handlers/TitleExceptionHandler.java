package com.erick.autoverify_api.exception.handlers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.erick.autoverify_api.exception.exceptions.DuplicatedTitleException;
import com.erick.autoverify_api.exception.exceptions.MissingParamException;
import com.erick.autoverify_api.exception.exceptions.NullFileException;
import com.erick.autoverify_api.exception.exceptions.TitleNotFoundException;
import com.erick.autoverify_api.response.GlobalResponseEntity;

@RestControllerAdvice
public class TitleExceptionHandler {

	@ExceptionHandler(NullFileException.class)
	public ResponseEntity<GlobalResponseEntity> handleNullFileException(NullFileException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<GlobalResponseEntity> handleLargeFileException(MaxUploadSizeExceededException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.PAYLOAD_TOO_LARGE, ex.getMessage());

		return ResponseEntity.status(413).body(response);
	}

	@ExceptionHandler(MissingParamException.class)
	public ResponseEntity<GlobalResponseEntity> handleMissingParamException(MissingParamException ex) {

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

	@ExceptionHandler(DuplicatedTitleException.class)
	public ResponseEntity<GlobalResponseEntity> handleDuplicatedTitleException(DuplicatedTitleException ex) {
		
		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.BAD_REQUEST, ex.getMessage());

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}
	
	@ExceptionHandler(TitleNotFoundException.class)
	public ResponseEntity<GlobalResponseEntity> handleTitleNotFoundException(TitleNotFoundException ex) {
		
		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.NOT_FOUND, ex.getMessage());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
	}
}
