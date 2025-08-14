package com.erick.autoverify_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.erick.autoverify_api.dto.LoginRequest;
import com.erick.autoverify_api.dto.TokenResponse;
import com.erick.autoverify_api.dto.UserDTO;
import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.response.GlobalResponseEntity;
import com.erick.autoverify_api.service.AuthService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService;
	
	@PostMapping("/register")
	public ResponseEntity<GlobalResponseEntity> createUser(@RequestBody UserDTO dto){
		
		String name = dto.getUserName();
		
		String password = dto.getPassword();
		
		User user = authService.createUser(name, password);
		
		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.OK, "User sucesfully registered", user.getName());
		
		return ResponseEntity.ok(response);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request){
		String token = authService.login(request.getUserName(), request.getPassword());
		return ResponseEntity.ok(new TokenResponse(token));
	}
}
