package com.erick.autoverify_api.controller;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.erick.autoverify_api.dto.TitleDTO;
import com.erick.autoverify_api.model.Title;
import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.response.GlobalResponseEntity;
import com.erick.autoverify_api.service.TitleServices;

@RestController
@RequestMapping(path = "/title")
public class TitleController {

	@Autowired
	private TitleServices service;

	@GetMapping("/newests")
	public ResponseEntity<List<TitleDTO>> get10NewestTitles(){
		
		List<Title> titles = service.get10NewestTitles();
		
		List<TitleDTO> titlesDTO = new ArrayList<>();
		
		titles.forEach(t -> titlesDTO.add(new TitleDTO(t.getId(), t.getName(), t.getDescription(), t.getUser().getName(), t.getDate())));
		
		return ResponseEntity.ok(titlesDTO);
	}
	
	@GetMapping("/topfavorites")
	public ResponseEntity<List<TitleDTO>> get10MostFavorites(){
		
		List<TitleDTO> titles = service.get10MostFavorites();
		
		return ResponseEntity.ok(titles);
	}
	
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<GlobalResponseEntity> makeTitle(
			@RequestPart(name = "file", required = false) MultipartFile file,
			@RequestPart(name = "details") TitleDTO details) {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String titleName = details.getTitleName();

		String titleDescription = details.getTitleDescription();

		service.makeTitle(titleName, titleDescription, file, user);

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.OK, "Title created sucessfully");

		return ResponseEntity.ok(response);
	}

	@GetMapping(path = "/{id}")
	public ResponseEntity<TitleDTO> findTitleById(@PathVariable Long id) {
		
		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		TitleDTO title = service.getTitleByID(id, user);
		
		return ResponseEntity.ok(title);
	}

	@GetMapping(path = "/user/id/{id}")
	public ResponseEntity<List<TitleDTO>> getTitlesFromUser(@PathVariable Long id) {

		List<Title> titles = service.getTitlesFromUser(id);

		List<TitleDTO> titleDTOs = new ArrayList<TitleDTO>();

		titles.forEach(t -> titleDTOs.add(new TitleDTO(t.getId(), t.getName(), t.getDescription(), t.getUser().getName(), t.getDate())));

		return ResponseEntity.ok(titleDTOs);
	}
	
	@GetMapping(path = "/user/name/{name}")
	public ResponseEntity<List<TitleDTO>> getTitlesByUserName(@PathVariable String name) {

		List<Title> titles = service.getTitlesByUsername(name);

		List<TitleDTO> titleDTOs = new ArrayList<TitleDTO>();

		titles.forEach(t -> titleDTOs.add(new TitleDTO(t.getId(), t.getName(), t.getDescription(), t.getUser().getName(), t.getDate())));

		return ResponseEntity.ok(titleDTOs);
	}

	@PostMapping(path = "/{id}")
	public ResponseEntity<GlobalResponseEntity> checkIntegrity(@PathVariable Long id,
			@RequestPart(name = "file", required = false) MultipartFile file) {

		boolean result = service.verifyIntegrity(id, file);

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.OK, "" + result);

		return ResponseEntity.ok(response);

	}

	@PostMapping(path = "/{id}/favorite")
	public ResponseEntity<TitleDTO> favoriteTitle(@PathVariable Long id) {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		TitleDTO dto = service.favoriteTitle(id, user.getId());

		return ResponseEntity.ok(dto);
	}

	@DeleteMapping(path = "/{id}/favorite")
	public ResponseEntity<TitleDTO> unfavoriteTitle(@PathVariable Long id) {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		TitleDTO dto = service.unfavoriteTitle(id, user.getId());

		return ResponseEntity.ok(dto);
	}

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<GlobalResponseEntity> deleteTitle(@PathVariable Long id) {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		service.deleteById(id, user);

		GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.OK, "Title deleted sucessfully");

		return ResponseEntity.ok(response);
	}

	@GetMapping(path = "/favorites")
	public ResponseEntity<List<TitleDTO>> getFavorites() {

		User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		Set<Title> titles = service.getFavorites(user);

		if (titles.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(List.of(new TitleDTO()));
		}
		
		List<TitleDTO> titleDTOs = new ArrayList<>();
		
		titles.forEach(t -> titleDTOs.add(new TitleDTO(t.getId(), t.getName(), t.getDescription(), t.getUser().getName(), t.getDate())));
			
		return ResponseEntity.ok(titleDTOs);
	}
	
	@GetMapping(path = "/search/name")
	public ResponseEntity<Object> searchByName(@RequestParam String query, @RequestParam int page) {
		
		Page<Title> titles = service.getTitleByQuery(query, page);

		if (titles.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		Set<TitleDTO> dtos = new HashSet<>();
		
		titles.forEach(t -> dtos.add(new TitleDTO(t.getId(), t.getName(), t.getUser().getName())));
		
		Object[] res = new Object[2];
		
		res[0] = dtos;
		res[1] = titles.hasNext();
		
		return ResponseEntity.ok(res);
	}
	
	@GetMapping(path = "/search/author")
	public ResponseEntity<Set<GlobalResponseEntity>> searchByAuthor(@RequestParam String query) {
		
		System.out.println(query);

		Set<Title> titles = service.getTitleByUserQuery(query);
		
		if (titles.isEmpty()) {
			GlobalResponseEntity response = new GlobalResponseEntity(HttpStatus.NOT_FOUND, "No titles found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Set.of(response));
		}

		Set<GlobalResponseEntity> responses = titles.stream()
				.map(t -> new GlobalResponseEntity(HttpStatus.OK, t.getId().toString(), t.getUser().getName(), t.getName(), t.getDescription(), t.getDate().toString()))
				.collect(Collectors.toSet());

		return ResponseEntity.ok(responses);
	}
}
