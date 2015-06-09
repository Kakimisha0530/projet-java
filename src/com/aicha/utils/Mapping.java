package com.aicha.utils;

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Vector;

public abstract class Mapping implements Serializable {

	protected transient String table;
    protected transient String condition;
    protected transient boolean exist;

    /**
     * constructeur de la classe
     *
     * @param table la table sur laquelle on va travailler
     * @param cnd la condition de recherche et de mise &agrave; jour
     * @throws SQLException
     * @throws IOException
     * @throws ClassNotFoundException
     */
    public Mapping(String table, String cnd) throws ClassNotFoundException,
    IOException, SQLException {
        this.table = table;
        this.condition = cnd;
        //setClasses();
    }
    
    /**
     * Permet de modifier la condition initiale
     * @param cnd la nouvelle condition
     */
    protected void setCondition(String cnd){
        this.condition = cnd;
    }


    /**
     * m&eacute;thode qui permet de remplir une map de donn&eacute;es qui vont faciliter les reqêtes sql
     *
     * @return une HashMap contenant en cl&eacute;s les attributs de l'objet(correspondannts aux colonnes de la table) et en entr&eacute;es leurs valeurs (correspondants aux entr&eacute;es dans la table)
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public HashMap<String, Object> map() throws IllegalArgumentException,
    IllegalAccessException {
        HashMap<String, Object> map = new HashMap<String, Object>();
        for (Field i : this.getClass().getDeclaredFields()) {
            i.setAccessible(true);
            if (true)//!isEntite(i))
            {
                map.put(i.getName(), i.get(this));
            }
        }

        return map;
    }

    /**
     * ************************** Methodes de traitement des donn&eacute;es *******************************
     */
    /**
     * m&eacute;thode qui permet de sauvegarder les donn&eacute;es en base.<br>
     * Si la donn&eacute;e existe deja elle ne fait que mettre &agrave; jour les informations en base de donn&eacute;es
     *
     * @param connect
     * @throws IllegalAccessException
     * @throws SQLException
     * @throws IllegalArgumentException
     */
    public void save(Connexion connect) throws IllegalAccessException, IllegalArgumentException,
    SQLException {
        if (this.exist) {
            HashMap<String, Object> donnees = this.map();
            donnees.remove("id");
            connect.update(table, donnees, condition);
        }
        else {
            int i = connect.insertInto(table, this.map());
            exist = i > 0;
            updateObj(i);
        }

    }

    /**
     * m&eacute;thode de suppression de donn&eacute;es en base
     *
     * @param condition
     * @param connect
     * @throws SQLException
     */
    public void delete(Connexion connect) throws SQLException {
        connect.delete(table, condition);
        exist = false;
    }

    /**
     * Cette m&eacute;thode permet de recup&eacute;rer une ligne de la base donn&eacute;es et de avec les informations recup&eacute;rer,
     * initialiser un objet.
     *
     * @param condition
     * @param connect
     * @throws SQLException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     */
    public boolean find(String condition, Connexion connect) throws SQLException,
    IllegalArgumentException, IllegalAccessException {
        ResultSet r = connect.selectObject(table, condition);
        if (r.next()) {
            for (Field i : this.getClass().getDeclaredFields()) {
                i.setAccessible(true);
                if (true)//(!isEntite(i))
                {
                    i.set(this, r.getObject(i.getName()));
                }
            }
            exist = true;

            r.close();
        }
        else {
            exist = false;
        }
        
        return exist;
    }

    /**
     * Surcharge de la m&eacute;thode {@link #find(String, Connexion)}.<br>
     * Cette fois on utilise comme condition celle renseign&eacute;e depuis le constructeur;
     * 
     * @param connect
     * @throws SQLException
     * @throws IllegalArgumentException
     * @throws IllegalAccessException
     * @see {@link #find(String, Connexion)}
     */
    public boolean find(Connexion connect) throws SQLException,
    IllegalArgumentException, IllegalAccessException {
        return this.find(condition, connect);
    }

    /**
     * Cette m&eacute;thode permet de recup&eacute;rer la liste des id pour les lignes qui repondent aux conditions.
     * 
     * @param condition
     * @param connect
     * @return
     * @throws SQLException
     */
    public ArrayList<Integer> findAll(String[] champs , String condition, Connexion connect , String orderb) throws SQLException {

        ArrayList<Integer> liste = new ArrayList<Integer>();
        Vector<String> data = new Vector<String>();
        data.add("id");
        for (String ch : champs) {
			data.add(ch);
		}
        ResultSet r = connect.select(table, data, condition,((orderb != null && !orderb.isEmpty())?orderb:" id DESC"),"","");

        while (r.next()) {
            liste.add(r.getInt("id"));
        }

        r.close();

        return liste;
    }
    
    public ArrayList<Integer> findAll(String condition, Connexion connect) throws SQLException {
        return findAll(new String[]{},condition,connect , "");
    }

    /**
     * Retourne le nombre de ligne de la {@link #table} r&eacute;pondant &agrave; la condition. 
     * 
     * @param tab
     * @param condition
     * @param connect
     * @return
     * @throws SQLException
     */
    public int count(String condition, Connexion connect) throws SQLException {
        return connect.count(table, condition);
    }

    /**
     * Permet de determiner si l'objet exist.
     * 
     * @return
     */
    public boolean exist() {
        return exist;
    }

    /**
     * 
     * @param i
     */
    public abstract void updateObj(int i);
    
    public abstract void reset();
}
