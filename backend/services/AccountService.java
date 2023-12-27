package com.learninglabyrinth.backend.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.learninglabyrinth.backend.dto.LoginInfo;
import com.learninglabyrinth.backend.dto.LoginResponse;
import com.learninglabyrinth.backend.models.Account;
import com.learninglabyrinth.backend.repositories.AccountRepository;
import java.util.HashMap;
import java.util.UUID;

/**
 * The Account Service places calls to the Account Repository when satisfactory
 * conditions specified in the service are met.
 * 
 * @author Alvin Osterndorff
 */
@Service
public class AccountService {
  public AccountRepository accountRepository;
  public static HashMap<UUID, Account> hashMap = new HashMap<>();
  RestTemplate client;

  /**
   * Constructor. Instantiates fields of this instance.
   * 
   * @param accountRepository: The repository that will handle the MySQL requests
   */
  public AccountService(AccountRepository accountRepository) {
    this.accountRepository = accountRepository;
    this.client = new RestTemplate();
  }

  /**
   * Creates an account for a user by saving the user's account information in the
   * database.
   * 
   * @param account: The account with the new user's account information
   * @return The saved account
   * @throws Exception: Thrown when the user name is already taken or not all
   *                    fields were entered
   */
  public Account creatAccount(Account account) throws Exception {
    // ensure user name doesn't already exist
    if (accountRepository.findByUsername(account.username).isPresent()) {
      throw new IllegalCallerException();
    }
    // ensure all required fields entered
    if (account.username.equals("") || account.password.equals("")) {
      throw new IllegalArgumentException();
    }
    // hash password
    int passwordHash = account.password.hashCode();
    account.password = Integer.toString(passwordHash);
    return accountRepository.save(account);
  }

  /**
   * Logs the user into the application.
   * 
   * @param credentials: The user's user name and password
   * @return The login response object created upon successful login
   */
  public LoginResponse login(LoginInfo credentials) {
    // hash password
    int passwordHash = credentials.password.hashCode();
    credentials.password = Integer.toString(passwordHash);
    Account account = accountRepository
                      .findByUsernameAndPassword(credentials.username,
                                                 credentials.password)
                      .orElseThrow();
    UUID token = UUID.randomUUID();
    hashMap.put(token, account);
    LoginResponse response = new LoginResponse();
    response.username = account.username;
    response.isAdmin = account.isAdmin;
    response.token = token;
    response.id = account.id;
    return response;
  }

  /**
   * Logs the user out of the application.
   * 
   * @param token: The login token of the user
   */
  public void logout(UUID token) {
    hashMap.remove(token);
  }

  /**
   * Retrieves the account of a logged in user.
   * 
   * @param token: The login token of the user
   * @return The account of the logged in user
   * @throws Exception: Thrown if the account is not found
   */
  public Account getAccount(UUID token) throws Exception {
    Account account = hashMap.get(token);
    if (account == null) {
      throw new Exception();
    }
    return account;
  }

  /**
   * Updates a specified account.
   * 
   * @param token:   The login token of the user
   * @param account: The account being updated
   * @throws Exception: Thrown if the user is not authorized to update the
   *                    account, the user name is already taken, or not all
   *                    required fields were entered
   */
  public void updateAccount(UUID token, Account account) throws Exception {
    accountRepository.findById(account.id).orElseThrow();
    // ensure account owner or admin account is updating
    Account tokenedAccount = hashMap.get(token);
    if (tokenedAccount == null || (!account.id.equals(tokenedAccount.id)
        && !tokenedAccount.isAdmin)) {
      throw new Exception();
    }
    // ensure updated user name isn't already taken
    Iterable<Account> existingAccounts = accountRepository.findAll();
    for (Account existingAccount : existingAccounts) {
      if (existingAccount.username.equals(account.username)) {
        throw new IllegalStateException();
      }
    }
    // ensure all required fields entered
    if (account.username.equals("") || account.password.equals("")) {
      throw new IllegalArgumentException();
    }
    Account updatedAccount = accountRepository.save(account);
    hashMap.remove(token);
    hashMap.put(token, updatedAccount);
  }

  /**
   * Deletes the specified account.
   * 
   * @param token:   The login token of the user
   * @param account: The account being deleted
   * @throws Exception: Thrown if the account cannot be found or the user is not
   *                    authorized to deleted the account
   */
  public void deleteAccount(UUID token, Account account) throws Exception {
    Account tokenedAccount = hashMap.get(token);
    if (tokenedAccount == null) {
      throw new Exception();
    }
    try { // ensure account owner or admin account is requesting delete
      if (account.id.equals(tokenedAccount.id) || tokenedAccount.isAdmin) {
        accountRepository.deleteById(account.id);
      }
    } catch (Exception e) {
      throw new IllegalArgumentException();
    }
  }
}
