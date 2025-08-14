package com.erick.autoverify_api.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.erick.autoverify_api.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

	Optional<User> findByName(String name);
}
