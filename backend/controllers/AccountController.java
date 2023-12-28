package com.learninglabyrinth.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.learninglabyrinth.backend.dto.LoginInfo;
import com.learninglabyrinth.backend.dto.LoginResponse;
import com.learninglabyrinth.backend.models.Account;
import com.learninglabyrinth.backend.services.AccountService;
import java.util.UUID;

/**
 * The Account Controller handles the requests to and from the client server and
 * provides responses in return.
 * 
 * @author Alvin Osterndorff
 */
@RestController
@RequestMapping("/account")
@CrossOrigin
public class AccountController {
	private final AccountService service;

	/**
	 * Constructor. Instantiates the AccountService field.
	 * 
	 * @param service: The AccountService object
	 */
	public AccountController(AccountService service) {
		this.service = service;
	}

	/**
	 * Calls the AccountService to create an account.
	 * 
	 * @param account: The account to be saved in the database.
	 * @return The saved account
	 */
	@PostMapping("/signup")
	public Account createAccount(@RequestBody Account account) {
		try {
			return service.creatAccount(account);
		} catch (IllegalAccessException e) {
			// an account with item id already exists
			throw new ResponseStatusException(HttpStatus.PRECONDITION_FAILED);
		} catch (IllegalCallerException e) {
			// user name already exists
			throw new ResponseStatusException(HttpStatus.CONFLICT);
		} catch (IllegalArgumentException e) {
			// missing required fields
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			// some other error occurred
			throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
		}
	}

	/**
	 * Calls the AccountService to retrieve an account.
	 * 
	 * @param token: The login token mapped to the account
	 * @return The requested account
	 */
	@GetMapping("/login")
	public Account getAccount(@RequestParam UUID token) {
		try {
			return service.getAccount(token);
		} catch (Exception e) {
			// user name or password doesn't exist
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Calls the AccountService to log the user in.
	 * 
	 * @param credentials: The user's user name and password
	 * @return The LoginResponse object created during login
	 */
	@PostMapping("/login")
	public LoginResponse login(@RequestBody LoginInfo credentials) {
		try {
			return service.login(credentials);
		} catch (Exception e) {
			// user name or password doesn't exist
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Calls the AccountService to log the user out
	 * 
	 * @param token: The login token of the user
	 */
	@GetMapping("/logout")
	public void logout(@RequestParam UUID token) {
		service.logout(token);
	}

	/**
	 * Calls the AccountService to update a user's account information.
	 * 
	 * @param   token: The login token of the user
	 * @param account: The account to be updated
	 */
	@PutMapping("/updateAccount")
	public void updateAccount(@RequestParam UUID token,
                            @RequestBody Account account) {
		try {
			service.updateAccount(token, account);
		} catch (IllegalStateException e) {
			// user name already taken
			throw new ResponseStatusException(HttpStatus.CONFLICT);
		} catch (Exception e) {
			// account doesn't exist
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}

	/**
	 * Calls the AccountService to delete a specified account.
	 * 
	 * @param   token: The login token of the user
	 * @param account: The account to be deleted
	 */
	@DeleteMapping("/deleteAccount")
	public void deleteAccount(@RequestParam UUID token,
							  @RequestBody Account account) {
		try {
			service.deleteAccount(token, account);
		} catch (Exception e) {
			// account doesn't exist
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
	}
}
