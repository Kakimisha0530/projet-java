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
 * Servlet implementation class AddActiviteRest
 */
@WebServlet("/bytoken/addactivite")
public class AddActiviteRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connexion connect;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddActiviteRest() {
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
		addAc(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		addAc(request, response);
	}
	
	private void addAc(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
		HashMap<String, Object> donnees = new HashMap<String, Object>();
		HashMap<String, Object> message = new HashMap<String, Object>();
		
		Object act_ = request.getParameter("id");
		Object deb_ = request.getParameter("debut");
		Object fin_ = request.getParameter("fin");
		Object vda_ = request.getParameter("vdate");
		Object cat_ = request.getParameter("categorieId");
		Object txt_ = request.getParameter("texte");
		
		int actId = 0;
		if (act_ != null && Utils.isInteger(act_.toString()))
			actId = Integer.parseInt(act_.toString());

		try {
			Activite acti = new Activite(actId);
			acti.find(connect);
			if (deb_ == null || fin_ == null || vda_ == null || cat_ == null || txt_ == null ) {
				message.put("type", "erreur");
				message.put("value", request.getParameterMap());
				donnees.put("message", message);
			}
			else
			{
				int cat = Integer.parseInt(cat_.toString());
				String desc = txt_.toString();
				long vdate = Long.parseLong(vda_.toString());
				int debut = Integer.parseInt(deb_.toString());
				int fin = Integer.parseInt(fin_.toString());

				acti.setTexte(desc);
				acti.setDebut(debut);
				acti.setFin(fin);
				acti.setVdate(vdate);
				acti.setCategorieId(cat);
				acti.setUserId(Integer.parseInt(request.getSession().getAttribute("CONNECTED").toString()));
				acti.save(connect);

				message.put("type", "ok");
				donnees.put("message", message);
				donnees.put("donnees", acti);
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
