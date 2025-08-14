package com.erick.autoverify_api.repositories;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.erick.autoverify_api.model.Title;
import com.erick.autoverify_api.model.User;

public interface TitleRepository extends JpaRepository<Title, Long>{

	List<Title> getByUser(User user);
	
	Optional<Title> getByHash(String hash);
	
	List<Title> findAllByUser(User user);

	Page<Title> findByNameContainingIgnoreCase(PageRequest pg, String query);

	Set<Title> findByUserNameContainingIgnoreCase(String query);

	@Query("SELECT t FROM Title t ORDER BY t.date DESC")
	List<Title> get10NewestTitles(PageRequest page);
	
	@Query("SELECT t, COUNT(u) FROM Title t LEFT JOIN t.favoritedByUsers u GROUP BY t ORDER BY COUNT(u) DESC")
	List<Object[]> get10MostFavorites(PageRequest page);
}
