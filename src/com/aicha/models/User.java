package com.aicha.models;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import com.aicha.utils.Connexion;
import com.aicha.utils.Mapping;
import com.aicha.utils.Utils;

/**
 * La classe repr&eacute;sentant les utilisateurs de l'application (y compris
 * les administrateurs)
 * 
 * @author admin
 *
 */
public class User extends Mapping {

	private int id;
	/**
	 * Le status de l'utilisateur :<br>
	 * <ul>
	 * <li>1 : utilisateur simple</li>
	 * <li>2 : administrateur</li>
	 * </ul>
	 */
	private int status;
	private String nom;
	private String prenom;
	private String email;
	/**
	 * Le mot de passe de l'utilisateur crypt&eacute;
	 */
	private String code;
	/**
	 * Cet attribut va contenir un bout de css qui permet de d&eacute;finir le
	 * code couleur que l'utilisateur aura choisi pour les cat&eacute;gories
	 */
	private String couleurs;
	private String portable;

	public User(int id) throws ClassNotFoundException, IOException,
			SQLException {
		super("users", "id=" + id);
		setId(id);
	}

	public User(String mail) throws ClassNotFoundException, IOException,
			SQLException {
		super("users", "email=" + Connexion.makeQuery(mail));
		this.email = mail;
	}

	public User() throws ClassNotFoundException, IOException, SQLException {
		this(0);
	}

	@Override
	public void reset() {
		this.id = 0;
		this.status = 0;
		this.code = "";
		this.email = "";
		this.nom = "";
		this.prenom = "";
		this.couleurs = "";
		this.portable = "";
	}

	@Override
	public void save(Connexion connect) throws IllegalAccessException,
			IllegalArgumentException, SQLException {
		setCondition(" id=" + this.getId());
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

	public String getPrenom() {
		return prenom;
	}

	public void setPrenom(String prenom) {
		this.prenom = prenom;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public void setHashCode(String code) throws NoSuchAlgorithmException {
		this.code = Utils.generateMD5(code);
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getStatus() {
		return status;
	}

	public String getCouleurs() {
		return couleurs;
	}

	public void setCouleurs(String color) {
		this.couleurs = color;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPortable() {
		return portable;
	}

	public void setPortable(String portable) {
		this.portable = portable;
	}

	@Override
	public String toString() {
		String str = "";
		str += this.getId() + ". ";
		str += this.nom + " " + this.prenom;
		str += " (" + this.email + ")";
		return str;
	}

	@Override
	public void updateObj(int i) {
		setId(i);
	}

	public boolean connecter(Connexion connect) throws SQLException,
			IllegalArgumentException, IllegalAccessException, IOException,
			ClassNotFoundException {

		String str = " email=" + Connexion.makeQuery(this.email) + " AND code="
				+ Connexion.makeQuery(this.code);
		this.find(str, connect);
		return this.exist();
	}

	public static HashMap<Integer, User> getAllUsers(Connexion connect)
			throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, User> liste = new HashMap<Integer, User>();

		User u = new User();
		ArrayList<Integer> id_liste = u.findAll("", connect);
		for (int i : id_liste) {
			u = new User(i);
			u.find(connect);
			liste.put(i, u);
		}

		return liste;
	}
	
}
