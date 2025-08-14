package com.erick.autoverify_api.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Title {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	private String name;
	
	@Column(length = 400) // gera VARCHAR(1000)
	private String description;
	
	private String hash;
	
	private Date date;
	
	@ManyToMany(mappedBy = "favoriteTitles")
	private Set<User> favoritedByUsers = new HashSet<>();
	
	public Set<User> getFavoritedByUsers() {
		return favoritedByUsers;
	}

	public void setFavoritedByUsers(HashSet<User> favoritedByUsers) {
		this.favoritedByUsers = favoritedByUsers;
	}

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getHash() {
		return hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
	public Title(String name, String description, String hash, Date date, User user) {
		this.name = name;
		this.description = description;
		this.hash = hash;
		this.date = date;
		this.user = user;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Title() {
	}

	public Long getId() {
		return id;
	}
	
	
}
