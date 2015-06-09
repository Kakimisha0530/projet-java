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

import com.aicha.models.Activite;
import com.aicha.utils.Connexion;
import com.aicha.utils.Utils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class DelActiviteRest
 */
@WebServlet("/bytoken/delactivite")
public class DelActiviteRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connexion connect;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DelActiviteRest() {
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
		delActi(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		delActi(request,response);
	}
	
	private void delActi(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
		HashMap<String, Object> donnees = new HashMap<String, Object>();
		HashMap<String, Object> message = new HashMap<String, Object>();

		Object act_ = request.getParameter("id");
		
		int connected = Integer.parseInt(request.getSession().getAttribute("CONNECTED").toString());
		
		int actId = 0 ;
		
		try {
			if (act_ != null && Utils.isInteger(act_.toString()))
				actId = Integer.parseInt(act_.toString());
			Activite acti = new Activite(actId);
			
			if(actId > 0 && acti.find(connect) && acti.getUserId() == connected){
				acti.delete(connect);
				message.put("type", "ok");
				donnees.put("message", message);
			}
			else{
					message.put("type", "erreur");
					message.put("value", new String[]{"Identifiant invalide"});
					donnees.put("message", message);
			}
			response.getOutputStream().print(gson.toJson(donnees));

		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
	}

}
