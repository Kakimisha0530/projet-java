package com.aicha.restApi;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.sql.SQLException;
import java.util.ArrayList;
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
 * Servlet implementation class ActivitesRest
 */
@WebServlet("/bytoken/activites")
public class ActivitesRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connexion connect;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ActivitesRest() {
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

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	private void lister(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
		HashMap<String, Object> donnees = new HashMap<String, Object>();
		HashMap<String, Object> message = new HashMap<String, Object>();

		Object act_ = request.getParameter("id");
		Object deb_ = request.getParameter("debut");
		Object fin_ = request.getParameter("fin");
		Object mois_ = request.getParameter("mois");
		Object sem_ = request.getParameter("sem");
		
		int connected = Integer.parseInt(request.getSession().getAttribute("CONNECTED").toString());
		
		int actId = 0 , da_deb = 0 , da_fin = 0;
		
		if (act_ != null && Utils.isInteger(act_.toString()))
			actId = Integer.parseInt(act_.toString());
		
		if (deb_ != null && fin_ != null && Utils.isInteger(deb_.toString()) && Utils.isInteger(fin_.toString())){
			da_deb = Integer.parseInt(deb_.toString());
			da_fin = Integer.parseInt(fin_.toString());
			if(da_deb > da_fin){
				int var_ = da_fin;
				da_fin = da_deb;
				da_deb = var_;
			}
		}
		
		try {
			Activite acti = new Activite(actId);
			
			if(da_deb > 0 && da_fin > 0){
				HashMap<Integer, HashMap<Integer, Integer>> d1 = null;
				ArrayList<Activite> d2 = null;
				HashMap<Long, ArrayList<Activite>> d3 = null;
				if(mois_ != null){
					d1 = Activite.getForPeriode(connect, connected, da_deb, da_fin , true);
					donnees.put("donnees", d1);
				}
				else if(sem_ != null){
					d3 = Activite.getForPeriode(connect, connected, da_deb, da_fin);
					donnees.put("donnees", d3);
				}
				else{
					d2 = Activite.getForDate(connect, connected, da_deb);
					donnees.put("donnees", d2.toArray());
				}
				message.put("type", "ok");
				donnees.put("message", message);
			}
			else if(actId > 0 && acti.find(connect) && acti.getUserId() == connected){
				message.put("type", "ok");
				donnees.put("message", message);
				donnees.put("donnees", acti);
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
