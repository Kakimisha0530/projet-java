package com.aicha.restApi;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.aicha.models.Categorie;
import com.aicha.utils.Connexion;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class CategoriesRest
 */
@WebServlet("/bytoken/categories")
public class CategoriesRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connexion connect;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CategoriesRest() {
        super();
        try {
			connect = Connexion.makeConnexion();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		lister(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		lister(request, response);
	}
	
	private void lister(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
			HashMap<String, Object> donnees = new HashMap<String, Object>();
			HashMap<Integer, Categorie> cat_list = Categorie.getAllCategories(connect);
			HashMap<String, Object> message = new HashMap<String, Object>();
			message.put("type", "Ok");
			donnees.put("message", message);
			donnees.put("donnees", cat_list);
			response.getOutputStream().print(gson.toJson(donnees));
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
