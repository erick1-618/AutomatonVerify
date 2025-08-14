package com.erick.autoverify_api.dto;

import java.util.Date;

public class TitleDTO {

	private Long id;

	private String titleName;
	private String titleDescription;
	private String author;
	private Date creationDate;
	private Long favoriteCount;

	private boolean isFavorited;

	public String getTitleName() {
		return titleName;
	}

	public void setTitleName(String titleName) {
		this.titleName = titleName;
	}

	public String getTitleDescription() {
		return titleDescription;
	}

	public void setTitleDescription(String titleDescription) {
		this.titleDescription = titleDescription;
	}

	public TitleDTO(String titleName, String titleDescription) {
		this.titleName = titleName;
		this.titleDescription = titleDescription;
	}

	public TitleDTO(Long id, String titleName, String author) {
		this.id = id;
		this.titleName = titleName;
		this.author = author;
	}

	public TitleDTO(Long id, String titleName, String titleDescription, String author, Date date) {
		this.titleName = titleName;
		this.titleDescription = titleDescription;
		this.author = author;
		this.creationDate = date;
		this.id = id;
	}

	public TitleDTO(Long id, String titleName, String titleDescription, String author, Date date, Long favoriteCounts) {
		this.favoriteCount = favoriteCounts;
		this.titleName = titleName;
		this.titleDescription = titleDescription;
		this.author = author;
		this.creationDate = date;
		this.id = id;
	}
	
	public TitleDTO(Long id, String titleName, String titleDescription, String author, Date date, Long favoriteCounts, boolean isFavorited) {
		this.favoriteCount = favoriteCounts;
		this.titleName = titleName;
		this.titleDescription = titleDescription;
		this.author = author;
		this.creationDate = date;
		this.id = id;
		this.isFavorited = isFavorited;
	}

	public boolean isFavorited() {
		return isFavorited;
	}

	public void setFavorited(boolean isFavorited) {
		this.isFavorited = isFavorited;
	}

	public Long getFavoriteCount() {
		return favoriteCount;
	}

	public void setFavoriteCount(Long favoriteCount) {
		this.favoriteCount = favoriteCount;
	}

	public Date getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(Date creationDate) {
		this.creationDate = creationDate;
	}

	public TitleDTO() {
	}

	public String getAuthor() {
		return author;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

}
