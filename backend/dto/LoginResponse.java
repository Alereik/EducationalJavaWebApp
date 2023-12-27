package com.learninglabyrinth.backend.dto;

import java.util.UUID;

public class LoginResponse {
	public Long id;
    public String username;
    public boolean isAdmin;
    public UUID token;
}
