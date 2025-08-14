package com.erick.autoverify_api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.erick.autoverify_api.exception.exceptions.MissingParamException;
import com.erick.autoverify_api.exception.exceptions.UserNotFoundException;
import com.erick.autoverify_api.model.Title;
import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.repositories.UserRepository;

@Service
public class UserService {
	
	@Autowired
	UserRepository userRepo;
	
	public User getUserById(Long id) {
		
		if(id == null) throw new MissingParamException("id");
		
		Optional<User> user = userRepo.findById(id);
		
		if(user.isEmpty()) throw new UserNotFoundException();
		
		return user.get();
	}
	
	public User getUserByName(String name) {
		
		if(name == null) throw new MissingParamException("name");
		
		Optional<User> usr = userRepo.findByName(name);
		
		if(usr.isEmpty()) throw new UserNotFoundException();
		
		return usr.get();
	}
	
	public void deleteUser(User user) {
		
		if(user == null) throw new MissingParamException("user");

		Optional<User> userFromDb = userRepo.findById(user.getId());
		
		if(userFromDb.isEmpty()) throw new UserNotFoundException();
		
		user = userFromDb.get();
		
		for(Title title : user.getCreatedTitles()) {
			title.getFavoritedByUsers().forEach(t -> t.getFavoriteTitles().remove(title)); 
		}
		
		user.getCreatedTitles().clear();
		
		userRepo.delete(user);
	}
	
	public void updateUser(User user) {
		
		if(user == null) throw new MissingParamException("user");
		
		userRepo.save(user);
	}
}
