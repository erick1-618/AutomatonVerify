package com.erick.autoverify_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.erick.autoverify_api.exception.exceptions.InvalidFieldException;
import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.repositories.UserRepository;

@Service
public class AuthService {

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	JwtService jwtService;
	
	public String login(String name, String password){
		
		User user = userRepository.findByName(name).orElseThrow(
				() -> new UsernameNotFoundException("User not found"));
		
		if(!passwordEncoder.matches(password, user.getPassword())) {
			throw new BadCredentialsException("Senha inválida");
		}
		
		String userName = user.getName();
		
		return jwtService.generateToken(userName);	
	}
	
	@Autowired
	PasswordEncoder encoder;
	
	public User createUser(String userName, String password) {
		
		if(!userName.matches("^[A-Za-z][A-Za-z0-9_]{4,}$")) throw new InvalidFieldException("name");
		
		if(!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) throw new InvalidFieldException("password");
		
		if(userRepository.findByName(userName).isPresent()) {
			throw new InvalidFieldException("name", "User with this name already exists");
		}
		
		User us = new User(userName, encoder.encode(password));
		
		userRepository.save(us);
		
		return us;
	}
}
