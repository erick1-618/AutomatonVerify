package com.erick.autoverify_api.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_user")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String name;

	private String password;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Title> createdTitles = new HashSet<>();

	@ManyToMany
	@JoinTable(name = "user_favorite_titles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "title_id"))
	private Set<Title> favoriteTitles = new HashSet<>();

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Long getId() {
		return id;
	}

	public User(String name, String password) {
		this.name = name;
		this.password = password;
	}

	public void setFavoriteTitles(HashSet<Title> favoriteTitles) {
		this.favoriteTitles = favoriteTitles;
	}

	public Set<Title> getCreatedTitles() {
		return createdTitles;
	}

	public Set<Title> getFavoriteTitles() {
		return favoriteTitles;
	}

	public User() {
	}
}
