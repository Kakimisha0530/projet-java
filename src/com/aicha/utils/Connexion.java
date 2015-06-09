package com.aicha.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.sql.*;
//import java.util.Date;
import java.util.HashMap;
import java.util.ArrayList;
//import java.util.Iterator;
import java.util.Vector;
import java.util.Map.Entry;

public class Connexion implements Serializable {

    private transient Connection connect;
    private static final long serialVersionUID = -6957272553879917188L;
    private transient static final String FILE_NAME = "agendaDB";
    private transient static final boolean DEBUG_MODE = true;

    private String url = "jdbc:mysql://localhost:8889/agenda";
    private String login = "root";
    private String password = "root";

    /**
     * constructeur de la class<br>
     * permet de se connecter &agrave; une base de donn&eacute;ees qu'on aura choisie
     *
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public Connexion() throws ClassNotFoundException, SQLException {
        if (DEBUG_MODE) {
            System.out.println("Connection read in file " + FILE_NAME);
        }
        this.connect = getConnection(url, login, password);
        //System.out.println("test");
        writeConnexion();
    }

    private Connexion(String url, String login, String password) throws ClassNotFoundException, SQLException {
        if (DEBUG_MODE) {
            System.out.println("Connection created with " + url + ", " + login + ", " + password);
        }
        this.connect = getConnection(url, login, password);
        this.url = url;
        this.login = login;
        this.password = password;
        writeConnexion();
    }

    private static Connection getConnection(String url, String login, String password) throws ClassNotFoundException, SQLException {
        Class.forName("com.mysql.jdbc.Driver");
        //System.out.println("Connection begin");
        return DriverManager.getConnection(url, login, password);
    }

    private Connection getConnection() throws ClassNotFoundException, SQLException {
        return getConnection(url, login, password);
    }

    private void writeConnexion() {
        try {
            if (DEBUG_MODE) {
                System.out.println("try to write the connection file");
            }
            FileOutputStream fichier = new FileOutputStream(FILE_NAME);
            ObjectOutputStream stream = new ObjectOutputStream(fichier);
            stream.writeObject(this);
            stream.flush();
            stream.close();
            if (DEBUG_MODE) {
                System.out.println("connection file writen");
            }
        }
        catch (IOException e) {
            System.out.println(e);
        }
    }

    public static Connexion makeConnexion() throws IOException, ClassNotFoundException, SQLException {
        Connexion connexion = null;

        if (new File(FILE_NAME).exists()) {
            if (DEBUG_MODE) {
                System.out.println("try to read the connection file");
            }
            FileInputStream fichier = new FileInputStream(FILE_NAME);
            if (DEBUG_MODE) {
                System.out.println("file found");
            }
            ObjectInputStream stream = new ObjectInputStream(fichier);
            connexion = (Connexion) stream.readObject();
            if (DEBUG_MODE) {
                System.out.println("deserialization successful");
            }
            stream.close();
            connexion.connect = connexion.getConnection();
            if (DEBUG_MODE) {
                System.out.println("connection successful");
            }
        }
        else {
            connexion = new Connexion();
        }

        return connexion;
    }

    public static Connexion makeConnexion(String url, String login, String password) throws IOException, ClassNotFoundException, SQLException {
        return new Connexion(url, login, password);
    }

    /**
     * **************************** METHODES DE MISE EN FORME ******************************************
     */
    private void debugPrintArgs(String req, Object[] values) {
        System.out.println(req);
        System.out.print("with ");
        int n = values.length;
        
        for (int i = 0; i < n; i++) {
            System.out.print(values[i] + ((i < (n-1))?", ":""));
        }
        System.out.println();
    }

    /**
     * m&eacute;thode de la classe qui permet de mettre sous forme de chaine de caract&egrave;re les diff&eacute;rentes colonnes (ici les cl&eacute; ou key ) de notre table (comprise dans la HashMap) <br>
     * cette m&eacute;thode est utile pour les m&eacute;thodes de type insert(), update() et delete()
     *
     * @param map : une map contenant des valeurs mapp&eacute;es avec le nom des champs
     * @see {@link #insertInto(String, HashMap)}
     * @see {@link #update(String, HashMap, String)}
     * @see {@link #delete(String, String)}
     * @return
     */
    public String colonnes(HashMap<String, Object> map) {
        String colonnes = "";
        int i = map.size();

        for (Entry<String, Object> entry : map.entrySet()) {
            i--;
            colonnes += entry.getKey();
            if (i != 0) {
                colonnes += ",";
            }
        }

        return colonnes;
    }

    /**
     * M&eacute;thode pour recup&eacute;rer les &eacute;l&eacute;ments (les champs de bdd) sous forme de String.
     * <br>M&eacute;thode utile pour les select()
     *
     * @param map : une liste contenant les champs de recherche
     * @see {@link #select(String, Vector, String, String, String)}
     * @return
     */
    public String colonnes(Vector<String> map) {
        String colonnes = "";
        for (String i : map) {
            colonnes += i;
            if (!i.equals(map.lastElement())) {
                colonnes += ",";
            }
        }

        return colonnes;
    }

    /**
     * M&eacute;thode permettant de r&eacute;cup&eacute;rer sous forme de chaine de caract&egrave;res les valeurs qui vont &ecirc;tre entr&eacute;es dans les tables
     *
     * @param map
     * @return la HashMap qui contient nos donn&eacute;es (les colonnes et leurs valeurs)
     */
    public String valeurs(HashMap<String, Object> map) {
        String valeurs = "";
        int i = map.size();
        for (Entry<String, Object> entry : map.entrySet()) {
            i--;

            valeurs += makeQuery(entry.getValue());

            if (i != 0) {
                valeurs += ",";
            }
        }
        return valeurs;
    }

    /**
     * M&eacute;thode retournant dans un tableau d'objet les champs, les chaine d'int&eacute;rrogation et les valeurs des champs.<br>
     * Cette m&eacute;thode est utilis&eacute;e pour les requ&ecirc;tes pr&eacute;par&eacute;es
     *
     * @param map : HashMap avec les champs et leurs valeurs
     * @return :
     * <ul>
     * <li>Object[0] ==>String ==> liste des champs</li>
     * <li>Object[1] ==>String ==> chaine d'interrogation</li>
     * <li>Object[2] ==>Object[] ==> liste des valeurs champs</li>
     * </ul>
     */
    public Object[] valuesArray(HashMap<String, Object> map) {
        Object[] tab = new Object[3];
        String colonnes = "";
        String stringValeurs = "";
        Object[] tabValeurs = new Object[map.size()];
        int i = map.size();
        int index = 0;

        for (Entry<String, Object> entry : map.entrySet()) {
            i--;
            colonnes += entry.getKey();
            stringValeurs += "?";
            if (i != 0) {
                colonnes += ",";
                stringValeurs += ",";
            }
            tabValeurs[index] = entry.getValue();
            index++;
        }

        tab[0] = colonnes;
        tab[1] = stringValeurs;
        tab[2] = tabValeurs;

        return tab;
    }

    /**
     * **************************** toutes les requetes insert() **************************************
     */
    /**
     * M&eacute;thode d'insertion en base de donn&eacute;es
     *
     * @param table (<i>String</i>) : la table d'insertion
     * @param donnees (<i>HashMap</i>) : la HashMap contenant en cl&eacute;s les colonnes et en entr&eacute;es les valeurs correspondantes
     * @param condition (<i>String</i>) : la condition d'ex&eacute;cution de la requete
     * @return retourne l'id de l'entr&eacute;e en base de donn&eacute;es
     * @see {@link #valuesArray(HashMap)}
     */
    public int insertInto(String table, HashMap<String, Object> donnees) throws SQLException {
        Object[] tabValeurs = (Object[]) valuesArray(donnees)[2];
        String req = "INSERT INTO " + table + "(" + valuesArray(donnees)[0] + ")"
        + " VALUES(" + valuesArray(donnees)[1] + ")";

        if (DEBUG_MODE) {
            debugPrintArgs(req, tabValeurs);
        }

        PreparedStatement s = connect.prepareStatement(req, Statement.RETURN_GENERATED_KEYS);
        for (int i = 0; i < donnees.size(); i++) {
            s.setObject(i + 1, tabValeurs[i]);
        }
        //s.setString(i+1, valuesArray(donnees)[2][i]);
        s.executeUpdate();
        ResultSet rs = s.getGeneratedKeys();
        int id = -1;
        if (rs.next()) {
            id = rs.getInt(1);

        }
        else {
            System.out.println("no id generated.");
        }
        return id;
    }

    /**
     * **************************** toutes les requetes select() **************************************
     */
    /**
     * La requete select qui sera la base, avec tous les &eacute;l&eacute;ments
     *
     * @param table (<i> String </i>) : table de selection
     * @param donnees (<i> Vector </i>) : collection qui contient les elements &agrave; selectionner
     * @param condition (<i> String </i>) : la condition de selection (1 si pas de condition)
     * @param orderBy (<i> String </i>) : si on veut un tri par colonne
     * @param limit (<i> String </i>) : si on veut un nombre de resultat limit&eacute;
     * @return cette methode retourne un ResultSet qui contient toute la selection
     *
     * @see {@link #colonnes(Vector)}
     * @throws SQLException
     */
    public ResultSet select(String table, Vector<String> donnees,
    String condition, String orderBy, String groupby , String limit) throws SQLException {
    	return select(table, colonnes(donnees), condition, orderBy, groupby,limit);
    }
    
    public ResultSet select(String table, String donnees,
    	    String condition, String orderBy, String groupby , String limit) throws SQLException{
    	if(DEBUG_MODE){
    		if(connect == null)
    			System.out.println("connect = null");
    		else
    			System.out.println("connect not null");
    	}
    	
    	
        Statement transmission = connect.createStatement();
        ResultSet result = null;
        String req = "SELECT " + donnees + " FROM " + table;

        /**
         * ************** verifcation pour la compl&eacute;tion des requ&ecirc;tes sql ************************************
         */
        if (condition != null && !"".equals(condition)) {
            req += " WHERE " + condition;
        }
        if (orderBy != null && !orderBy.isEmpty()) {
            req += " ORDER BY " + orderBy;
        }
        if (groupby != null && !groupby.isEmpty()) {
            req += " GROUP BY " + groupby;
        }
        if (limit != null && !limit.isEmpty()) {
            req += " LIMIT " + limit;
        }

        if (DEBUG_MODE) {
            System.out.println(req);
        }
        /**
         * ***************************************************************************************************
         */
        try {
            result = transmission.executeQuery(req);
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }

    // les surcharges de select
    /**
     * surcharge de la m&eacute;thode select()
     *
     * @param table
     * @param donnees
     * @param condition
     * @return
     * @see {@link #select(String, Vector, String, String, String)}
     * @throws SQLException
     * @see Connexion
     */
    public ResultSet select(String table, Vector<String> donnees,
    String condition) throws SQLException {
        return select(table, donnees, condition, null, null,null);
    }

    /**
     * methode qui permet de selectionner tous les attributs d'un ou plusieurs &eacute;l&eacute;ments
     *
     * @param table (<i> String </i>) : la table de selection
     * @param condition (<i> String </i>) : la condition de selection
     * @return retourne un ResultSet
     * @throws SQLException
     * @see {@link #select(String, Vector, String, String, String)}
     */
    public ResultSet selectObject(String table, String condition) throws SQLException {
        Vector<String> donnees = new Vector<String>();
        donnees.add("*");
        return select(table, donnees, condition, null, null,null);
    }

    /**
     * Autre surcharge de la m&eacute;thode select()
     *
     * @param table
     * @param condition
     * @param orderBy
     * @param limit
     * @return
     * @see {@link #select(String, Vector, String, String, String)}
     * @throws SQLException
     */
    public ResultSet selectObject(String table, String condition, String orderBy, String limit) throws SQLException {
        Vector<String> donnees = new Vector<String>();
        donnees.add("*");
        return select(table, donnees, condition, orderBy, null ,limit);
    }

    /**
     * methode qui permet de selectionner tous les &eacute;l&eacute;ments d'une table
     *
     * @param table (<i> String </i>) : la table de selection
     * @return retourne un ResultSet
     * @see {@link #select(String, Vector, String, String, String)}
     * @see {@link #selectObject(String, String)}
     * @throws SQLException
     */
    public ResultSet selectAll(String table) throws SQLException {
        return selectObject(table, "1");
    }

    /**
     * *************************** les requetes update *****************************************
     */
    /**
     * methode de mise &agrave; jour de la base de donn&eacute;es
     *
     * @param table
     * @param donnees
     * @param condition
     * @return
     * @throws java.sql.SQLException
     * @see {@link #chaine(Object)}
     * @throws SQLException
     */
    public int update(String table, HashMap<String, Object> donnees, String condition) throws SQLException {
        Statement transmission = connect.createStatement();
        int resultat = 0;
        String update = "";
        int n = donnees.size();

        for (Entry<String, Object> i : donnees.entrySet()) {
            n--;
            update += i.getKey() + "=";
            update += makeQuery(i.getValue());

            if (n != 0) {
                update += ",";
            }
        }

        String req = "UPDATE " + table + " SET " + update;

        if (condition != null && !"".equals(condition)) {
            req += " WHERE " + condition;
        }

        if (DEBUG_MODE) {
            System.out.println(req);
        }

        try {
            resultat = transmission.executeUpdate(req);
        }
        catch (Exception e) {
            System.out.println(e);
        }
        if(DEBUG_MODE)
            System.out.println(req);
        return resultat;
    }

    /**
     * Surcharge de la m&eacute;thode update()
     *
     * @param table
     * @param donnees
     * @return
     * @throws java.sql.SQLException
     * @see {@link #update(String, HashMap, String)}
     * @throws SQLException
     */
    public int update(String table, HashMap<String, Object> donnees) throws SQLException {
        return update(table, donnees, null);
    }

    /**
     * ******************************* les requetes DELETE ********************************************
     */
    /**
     * methode de suppression dans la base de donn&eacute;es
     *
     * @param table
     * @param condition
     * @return
     * @throws SQLException
     */
    public int delete(String table, String condition) throws SQLException {
        Statement transmission = connect.createStatement();
        String req = "DELETE FROM " + table
        + " WHERE " + condition;

        if (DEBUG_MODE) {
            System.out.println(req);
        }

        int resultat = 0;
        try {
            resultat = transmission.executeUpdate(req);
            System.out.println(req);
        }
        catch (Exception e) {
            System.out.println(e);
            return 0;
        }
        return resultat;
    }

    /**
     * **************comptage des resultats******************
     */
    /**
     * permet de compter le nombre de ligne d'une table de la bdd
     *
     * @param table
     * @param condition
     * @return
     * @see {@link #select(String, Vector, String, String, String)}
     * @throws SQLException
     */
    public int count(String table, String condition) throws SQLException {
        ResultSet result = null;
        int count = 0;
        Vector<String> donnees = new Vector<String>();
        donnees.add("count(*)");
        try {
            result = select(table, donnees, condition);
            if (result.next()) {
                count = result.getInt("count(*)");
            }
        }
        catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }

    /**
     * determine si l'objet pass&eacute; en param&egrave;tre doit &ecirc;tre converti en chaine (en rajoutant des quotes ou des doubles quotes)
     *
     * @param o
     * @return
     */
    public static String makeQuery(Object o) {
        ArrayList<Class<?>> chaine = new ArrayList<Class<?>>();
        chaine.add(String.class);
        chaine.add(Date.class);
        chaine.add(Timestamp.class);
        chaine.add(Time.class);

        String str = "";
        if (o != null && chaine.contains(o.getClass())) {
            str += "\"" + o + "\"";
        }
        else if(o != null && o.getClass().equals(int[].class)){
            int[] tab = (int[])o;
            int n_ = tab.length;
            str +="(";
            for(int i=0;i<n_;i++){
                if(tab[i] > 0)
                    str += tab[i] + ",";
            }
            if((n_ = str.lastIndexOf(",")) == str.length() - 1)
                str = str.substring(0, n_);
            str +=")";
        }
        else {
            str += o;
        }
        return str;
    }

    /**
     * ferme l'instance de conexion &agrave; la base de donn&eacute;es
     * @throws SQLException
     */
    public void close() throws SQLException {
        this.connect.close();
    }
}
