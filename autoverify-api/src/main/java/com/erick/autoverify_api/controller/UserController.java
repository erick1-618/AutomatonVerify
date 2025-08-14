package com.erick.autoverify_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.response.GlobalResponseEntity;
import com.erick.autoverify_api.service.UserService;

@RestController
@RequestMapping(path = "/us")
public class UserController {

	@Autowired
	private UserService service;
	
	@DeleteMapping
	public ResponseEntity<GlobalResponseEntity> deleteUser() {
		
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		service.deleteUser(user);
		
		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.OK, "User deleted successfully");
		
		return ResponseEntity.ok(response);
	}
}
