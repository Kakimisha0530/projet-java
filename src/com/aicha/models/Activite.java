package com.aicha.models;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import com.aicha.utils.Connexion;
import com.aicha.utils.Mapping;
import com.aicha.utils.Utils;

public class Activite extends Mapping {

	private int id;
	private int userId;
	private int categorieId;
	private long vdate;
	private int debut;
	private int fin;
	private String texte = "";

	public Activite(int id) throws ClassNotFoundException, IOException,
			SQLException {
		super("activites", " id=" + id);
		setId(id);
	}

	public Activite() throws ClassNotFoundException, IOException, SQLException {
		this(0);
	}
	
	@Override
	public void reset() {
		this.id = 0;
		this.userId = 0;
		this.categorieId = 0;
		this.vdate = 0;
		this.debut = 0;
		this.fin = 2300;
		this.texte = "";
	}

	public int getId() {
		return this.id;
	}

	private void setId(int id) {
		if (this.id <= 0 && id > 0) {
			this.id = id;
		}
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public int getCategorieId() {
		return categorieId;
	}

	public void setCategorieId(int categorieId) {
		this.categorieId = categorieId;
	}

	public Date getVdate() {
		return Utils.getDate("" + vdate);
	}
	
	public long getVdateLong(){
		return vdate;
	}

	public void setVdate(long vdate) {
		this.vdate = vdate;
	}

	public String getDebut() {
		return Utils.getTime("" + debut);
	}
	
	public int getDebutInt() {
		return debut;
	}

	public void setDebut(int debut) {
		this.debut = debut;
	}

	public String getFin() {
		return Utils.getTime("" + fin);
	}
	
	public int getFinInt() {
		return fin;
	}

	public void setFin(int fin) {
		this.fin = fin;
	}

	public String getTexte() {
		return texte;
	}

	public void setTexte(String texte) {
		this.texte = texte;
	}

	public static ArrayList<Activite> getForDate(Connexion connect,
			int user, int da) throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		ArrayList<Activite> liste = new ArrayList<Activite>();

		Activite t = new Activite();
		String cnd = " userId = " + Connexion.makeQuery(user);
		cnd += " and vdate=" + Connexion.makeQuery(da);
		ArrayList<Integer> id_liste = t.findAll(new String[]{"debut"},cnd, connect,"debut");
		for (int i : id_liste) {
			t = new Activite(i);
			t.find(connect);
			liste.add(t);
		}

		return liste;
	}
	
	public static HashMap<Integer, HashMap<Integer, Integer>> getForPeriode(Connexion connect,
			int user, int deb , int fin , boolean tab) throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, HashMap<Integer, Integer>> liste = new HashMap<Integer, HashMap<Integer, Integer>>();
		ResultSet r = connect.select("activites, categories", "categories.id as cateId, count(activites.id) as nbre ,activites.vdate as v_da " , "activites.userId = " + user + " and vdate>=" + deb + " and vdate<=" + fin + " and categories.id=activites.categorieId", null, "v_da,cateId", null);
		HashMap<Integer, Integer> curr = null;//new HashMap<Integer, Integer>();
		//int curr_d = 0;
		while (r.next()) {
			if(!liste.containsKey(r.getInt("v_da")))
				liste.put(r.getInt("v_da"), new HashMap<Integer, Integer>());
			liste.get(r.getInt("v_da")).put(r.getInt("cateId"), r.getInt("nbre"));
        }

        r.close();
		
		return liste;
	}
	
	public static HashMap<Long, ArrayList<Activite>> getForPeriode(Connexion connect,
			int user, int deb , int fin ) throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Long, ArrayList<Activite>> liste = new HashMap<Long, ArrayList<Activite>>();
		Activite t = new Activite();
		String cnd = " userId = " + Connexion.makeQuery(user);
		cnd += " and vdate>=" + Connexion.makeQuery(deb);
		cnd += " and vdate<=" + Connexion.makeQuery(fin);
		ArrayList<Integer> id_liste = t.findAll(new String[]{"vdate"},cnd, connect,"vdate");
		for (int i : id_liste) {
			t = new Activite(i);
			t.find(connect);
			if(!liste.containsKey(t.getVdateLong()))
				liste.put(t.getVdateLong(), new ArrayList<Activite>());
			liste.get(t.getVdateLong()).add(t);
		}
		
		return liste;
	}
	
	
	public static HashMap<Integer, Activite> getForCategorie(Connexion connect,
			int cat, int user) throws ClassNotFoundException, IOException,
			SQLException, IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, Activite> liste = new HashMap<Integer, Activite>();

		Activite t = new Activite();
		String cnd = " categorieId = " + Connexion.makeQuery(cat)
				+ " AND userId = " + Connexion.makeQuery(user);
		ArrayList<Integer> id_liste = t.findAll(cnd, connect);
		for (int i : id_liste) {
			t = new Activite(i);
			t.find(connect);
			liste.put(i, t);
		}

		return liste;
	}

	public static HashMap<Integer, Activite> getForUser(Connexion connect,
			int user) throws ClassNotFoundException, IOException, SQLException,
			IllegalArgumentException, IllegalAccessException {
		HashMap<Integer, Activite> liste = new HashMap<Integer, Activite>();
		Activite t = new Activite();
		String cnd = " userId = " + Connexion.makeQuery(user);
		ArrayList<Integer> id_liste = t.findAll(cnd, connect);
		for (int i : id_liste) {
			t = new Activite(i);
			t.find(connect);
			liste.put(i, t);
		}

		return liste;
	}

	@Override
	public void updateObj(int i) {
		setId(i);
	}

	@Override
	public String toString() {
		String str = "";
		str += this.id + ". " + this.texte + " (" + this.categorieId + ")";
		return str;
	}

	/*
	 * public void test(){ long tt = 0; DateFormat dateFormat = new
	 * SimpleDateFormat("yyyyMMddHHmmss"); tt =
	 * Long.parseLong(dateFormat.format(new Date())); }
	 */

}
