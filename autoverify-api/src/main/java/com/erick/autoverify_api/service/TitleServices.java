package com.erick.autoverify_api.service;

import java.util.ArrayList;
import java.util.BitSet;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.erick.autoverify_api.dto.TitleDTO;
import com.erick.autoverify_api.exception.exceptions.DuplicatedTitleException;
import com.erick.autoverify_api.exception.exceptions.MissingParamException;
import com.erick.autoverify_api.exception.exceptions.NullFileException;
import com.erick.autoverify_api.exception.exceptions.TitleNotFoundException;
import com.erick.autoverify_api.exception.exceptions.UserNotAllowedException;
import com.erick.autoverify_api.exception.exceptions.UserWithoutTitlesException;
import com.erick.autoverify_api.model.Title;
import com.erick.autoverify_api.model.User;
import com.erick.autoverify_api.repositories.TitleRepository;
import com.erick.autoverify_api.repositories.UserRepository;
import com.erick.autoverify_api.service.ca.CellularAutomata;
import com.erick.autoverify_api.service.ca.tools.CellularAutomataFactory;
import com.erick.autoverify_api.service.ca.tools.FrameCrusher;

@Service
public class TitleServices {

	@Autowired
	TitleRepository titleRepo;

	@Autowired
	UserRepository userRepo;

	@Autowired
	UserService userService;

	public String makeTitle(String titleName, String titleDescription, MultipartFile file, User user) {

		if (file == null)
			throw new NullFileException();

		if (titleDescription == null)
			throw new MissingParamException("TitleDescription");

		if (titleName == null)
			throw new MissingParamException("TitleName");

		String hash = getHash(file);
		
		Optional<Title> duplicated = titleRepo.getByHash(hash);

		if (duplicated.isPresent())
			throw new DuplicatedTitleException();

		Title title = new Title(titleName, titleDescription, hash, new Date(System.currentTimeMillis()), user);

		titleRepo.save(title);

		return hash;
	}

	public boolean verifyIntegrity(Long id, MultipartFile file) {

		if (file == null)
			throw new NullFileException();

		if (id == null)
			throw new MissingParamException("Title ID");

		Optional<Title> title = titleRepo.findById(id);

		if (title.isEmpty())
			throw new TitleNotFoundException();

		String hash = getHash(file);

		return hash.equals(title.get().getHash());

	}

	public TitleDTO getTitleByID(Long id, User usr) {

		if (id == null)
			throw new MissingParamException("Title ID");

		Optional<Title> title = titleRepo.findById(id);

		if (title.isEmpty())
			throw new TitleNotFoundException();

		Title t = title.get();
		
		User user = userService.getUserById(usr.getId());
		
		boolean isFavorited = t.getFavoritedByUsers().contains(user);
		
		long count = t.getFavoritedByUsers().size();
		
		TitleDTO dto = new TitleDTO(t.getId(), t.getName(), t.getDescription(), t.getUser().getName(),
				t.getDate(), count, isFavorited);
		
		return dto;
	}

	public List<Title> getTitlesFromUser(Long id) {

		User user = userService.getUserById(id);

		List<Title> titles = titleRepo.findAllByUser(user);

		if (titles.isEmpty())
			throw new UserWithoutTitlesException();

		return titles;

	}

	public void deleteById(Long id, User user) {

		if (id == null)
			throw new MissingParamException("id");

		Optional<Title> title = titleRepo.findById(id);
		
		if (title.isEmpty())
			throw new TitleNotFoundException();

		if (!title.get().getUser().getId().equals(user.getId()))
			throw new UserNotAllowedException();
		
		title.get().getFavoritedByUsers().forEach(u -> u.getFavoriteTitles().remove(title.get()));

		titleRepo.deleteById(id);
	}

	public TitleDTO favoriteTitle(Long id, Long userId) {

		if (id == null)
			throw new MissingParamException("id");

		Optional<Title> title = titleRepo.findById(id);

		if (title.isEmpty())
			throw new TitleNotFoundException();

		User user = userService.getUserById(userId);

		if (user.getFavoriteTitles().contains(title.get()))
			throw new UserNotAllowedException("Title already favorited");

		user.getFavoriteTitles().add(title.get());

		userService.updateUser(user);
		
		Optional<Title> titleRes = titleRepo.findById(id);

		if (titleRes.isEmpty())
			throw new TitleNotFoundException();
		
		return getTitleByID(id, user);
	}

	public TitleDTO unfavoriteTitle(Long id, Long userId) {

		if (id == null)
			throw new MissingParamException("id");

		Optional<Title> title = titleRepo.findById(id);

		if (title.isEmpty())
			throw new TitleNotFoundException();

		User user = userService.getUserById(userId);

		if (!user.getFavoriteTitles().contains(title.get()))
			throw new UserNotAllowedException("Title not favorited");

		user.getFavoriteTitles().remove(title.get());

		userService.updateUser(user);
		
		Optional<Title> titleRes = titleRepo.findById(id);

		if (titleRes.isEmpty())
			throw new TitleNotFoundException();
		
		return getTitleByID(id, user);
	}

	public Set<Title> getFavorites(User user) {

		User existingUser = userService.getUserById(user.getId());

		return existingUser.getFavoriteTitles();
	}

	public Page<Title> getTitleByQuery(String query, int pageNumber) {

		if (query == null || query.isBlank())
			throw new MissingParamException("Query");

		Page<Title> titles = titleRepo.findByNameContainingIgnoreCase(PageRequest.of(pageNumber, 10), query);

		if (titles.isEmpty())
			throw new TitleNotFoundException();

		return titles;
	}

	public Set<Title> getTitleByUserQuery(String query) {

		if (query == null || query.isBlank())
			throw new MissingParamException("Query");

		Set<Title> titles = titleRepo.findByUserNameContainingIgnoreCase(query);

		if (titles.isEmpty())
			throw new TitleNotFoundException();

		return titles;

	}

	private String getHash(MultipartFile file) {

		CellularAutomata ca = CellularAutomataFactory.create(file);

		for(int i = 0; i < 5; i++)
			ca.nextGen();

		BitSet result = ca.getGen();

		String hash = FrameCrusher.flatten(result);

		return hash;
	}

	public List<Title> get10NewestTitles() {
		List<Title> titles = titleRepo.get10NewestTitles(PageRequest.of(0, 10));
		return titles;
	}

	public List<TitleDTO> get10MostFavorites() {
		
		List<Object[]> titles = titleRepo.get10MostFavorites(PageRequest.of(0, 10));
		
		List<TitleDTO> titlesDTO = new ArrayList<>();
		
		titles.forEach((t) -> {
			Long count = (Long) t[1];
			Title title = (Title) t[0];
			titlesDTO.add(new TitleDTO(title.getId(), title.getName(), title.getDescription(), 
					title.getUser().getName(), title.getDate(), count));
		});
		
		return titlesDTO;
	}

	public List<Title> getTitlesByUsername(String name) {

			User user = userService.getUserByName(name);

			List<Title> titles = titleRepo.findAllByUser(user);

			if (titles.isEmpty())
				throw new UserWithoutTitlesException();

			return titles;
	}
}
