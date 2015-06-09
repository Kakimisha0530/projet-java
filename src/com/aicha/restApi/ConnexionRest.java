package com.aicha.restApi;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.aicha.models.User;
import com.aicha.utils.Connexion;
import com.aicha.utils.Utils;

/**
 * Servlet implementation class ConnexionRest
 */
@WebServlet("/bytoken/connect")
public class ConnexionRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connexion connect;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ConnexionRest() {
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
		connectUser(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		connectUser(request, response);
	}
	
	private void connectUser(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
			HashMap<String, Object> donnees = new HashMap<String, Object>();
			boolean connected = false;
			ArrayList<String> erreurs = new ArrayList<String>();
			String mail = request.getParameter("mai");
			String code = request.getParameter("code");
			
			if(mail != null && !mail.isEmpty() && code != null && !code.isEmpty()){
				User user = new User(mail);
				user.find(connect);

				if (!user.exist()) {
					erreurs.add("Cet email ne correspond &agrave; aucun utilisateur.<br>Veuillez cr&eacute;er un compte pour pouvoir utiliser l'application.");
				}
				else {
					user.setCode(code);
					user.connecter(connect);
					connected = user.exist();
					if (!connected){
						erreurs.add("Le mot de passe est incorrect !");
						//request.setAttribute("user_mail", mail);
					}
				}

				if (connected){
					//request.getSession(
					//request.getSession().setAttribute("USER", user);
					request.getSession().setAttribute("CONNECTED", user.getId());
					HashMap<String, Object> message = new HashMap<String, Object>();
					message.put("type", "Ok");
					donnees.put("message", message);
					donnees.put("donnees", user);
					donnees.put("token", user.getId() + "-" + Utils.generateMD5(request.getServletContext().getSessionCookieConfig().getName() + user.getEmail()));
					//HashMap<Integer, Categorie> cat_list = Categorie.getAllCategories(connect);
					//request.getSession().setAttribute("CATEGORIES", cat_list);
				}
				else{
					HashMap<String, Object> message = new HashMap<String, Object>();
					message.put("type", "erreur");
					message.put("value", erreurs);
					donnees.put("message", message);
				}
			}
			else{
				HashMap<String, Object> message = new HashMap<String, Object>();
				message.put("type", "erreur");
				message.put("value", new String[]{"Identifiants invalides"});
				donnees.put("message", message);
			}
			
			response.getOutputStream().print(gson.toJson(donnees));
			
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		} catch (SQLException e1) {
			e1.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
