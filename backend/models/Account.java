package com.learninglabyrinth.backend.models;

import jakarta.persistence.*;

/**
 * The Account class embodies the user's account information.
 * 
 * @author Alvin Osterndorff
 */
@Entity
public class Account {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Long id;
	
	@Column(unique = true)
  public String username;
	
  public String password;
  
  public boolean isAdmin;
}
