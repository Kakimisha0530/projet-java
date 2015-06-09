package com.aicha.models;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import com.aicha.utils.Connexion;
import com.aicha.utils.Mapping;

public class Rappel extends Mapping {

	private int id;
	private int activiteId;
	private int heure;
	private long date;
	private String texte;
	

	public Rappel(int id) throws ClassNotFoundException, IOException,
			SQLException {
		super("rappels", "id=" + id);
		setId(id);
	}

	public Rappel() throws ClassNotFoundException, IOException, SQLException {
		this(0);
	}

	@Override
	public void reset() {
		this.id = 0;
		this.setActiviteId(0);
		this.heure = 0;
		this.date = 0;
		this.texte = "";
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

	
	@Override
	public String toString() {
		String str = "";
		str += this.getId() + ". ";
		str += this.texte ;
		str += " (d= " + this.date + " , h= " + this.heure + ")";
		return str;
	}

	@Override
	public void updateObj(int i) {
		setId(i);
	}

	public static HashMap<Integer, Rappel> getForActivite(Connexion connect , int act)
			throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, Rappel> liste = new HashMap<Integer, Rappel>();

		Rappel r = new Rappel();
		String cnd = " activiteId = " + Connexion.makeQuery(act);
		ArrayList<Integer> id_liste = r.findAll(cnd, connect);
		for (int i : id_liste) {
			r = new Rappel(i);
			r.find(connect);
			liste.put(i, r);
		}

		return liste;
	}

	public int getActiviteId() {
		return activiteId;
	}

	public void setActiviteId(int activiteId) {
		this.activiteId = activiteId;
	}
}
