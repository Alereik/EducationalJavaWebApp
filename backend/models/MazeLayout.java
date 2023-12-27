package com.learninglabyrinth.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

/**
 * This class represents the layout of a maze entry
 * @author Ben Persick
 */
@Entity
public class MazeLayout {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @JsonProperty("id")
    public Long id;

    @JsonProperty("size")
    public int size;

    @JsonProperty("layout")
    public String layout;

    @JsonProperty("clickCount")
    public int uses;

    @JsonProperty("creatorId")
    public long creatorId;
}
