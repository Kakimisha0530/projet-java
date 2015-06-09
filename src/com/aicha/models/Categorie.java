package com.aicha.models;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import com.aicha.utils.Connexion;
import com.aicha.utils.Mapping;

public class Categorie extends Mapping {

	private int id;
	private String nom;
	private String description;

	public Categorie(int id) throws ClassNotFoundException, IOException,
			SQLException {
		super("categories", "id=" + id);
		setId(id);
	}

	public Categorie() throws ClassNotFoundException, IOException, SQLException {
		this(0);
	}

	@Override
	public void reset(){
		this.id = 0;
		this.nom = "";
		this.description = "";
	}

	@Override
	public void save(Connexion connect) throws IllegalAccessException,
			IllegalArgumentException, SQLException {
		super.save(connect);
	}

	public int getId() {
		return this.id;
	}

	private void setId(int id) {
		if (this.id <= 0 && id > 0) {
			this.id = id;
		}
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public String toString() {
		String str = "";
		str += this.getId() + ". ";
		str += this.nom ;
		str += " (" + this.description + ")";
		return str;
	}

	@Override
	public void updateObj(int i) {
		setId(i);
	}

	public static HashMap<Integer, Categorie> getAllCategories(Connexion connect)
			throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, Categorie> liste = new HashMap<Integer, Categorie>();

		Categorie cat = new Categorie();
		ArrayList<Integer> id_liste = cat.findAll("", connect);
		for (int i : id_liste) {
			cat = new Categorie(i);
			cat.find(connect);
			liste.put(i, cat);
		}

		return liste;
	}

}
