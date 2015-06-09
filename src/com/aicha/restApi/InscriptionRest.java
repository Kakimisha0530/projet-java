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

import com.aicha.models.User;
import com.aicha.utils.Connexion;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet implementation class InscriptionRest
 */
@WebServlet("/inscription")
public class InscriptionRest extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private Connexion connect;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InscriptionRest() {
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
		inscri(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		inscri(request, response);
	}
	
	private void inscri(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		try {		
			Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
			HashMap<String, Object> donnees = new HashMap<String, Object>();
			HashMap<String, Object> message = new HashMap<String, Object>();
			
			boolean connected = false;
			ArrayList<String> erreurs = new ArrayList<String>();
			String nom = request.getParameter("nom");
			String prenom = request.getParameter("prenom");
			String mail = request.getParameter("mai");
			String code = request.getParameter("code");
			String tel = request.getParameter("tel");
			User user = null;
			
			if(request.getSession().getAttribute("CONNECTED") == null)
				user = new User(mail);
			else
				user = new User(Integer.parseInt(request.getSession().getAttribute("CONNECTED").toString()));
			
			user.find(connect);

			if (user.exist() && request.getSession().getAttribute("CONNECTED") == null) {
				erreurs.add("l'email que vous avez renseigné existe deja");
			} 
			else if(!user.exist() || request.getSession().getAttribute("CONNECTED") != null){
				if(nom == null || prenom == null || code == null || tel == null || nom == "" || prenom == "" || code == "" || tel == ""){
					erreurs.add("Veuillez renseigner tous les champs !");
				}
				else{
					user.setHashCode(code);
					user.setNom(nom);
					user.setPrenom(prenom);
					user.setPortable(tel);
					if(request.getSession().getAttribute("CONNECTED") == null){
						user.setCouleurs("color");
						user.setStatus(1);
					}
					
					user.save(connect);
					connected = user.exist();
					if (!connected)
						erreurs.add("Une erreur est survenue lors de la création de votre compte");
				}
				
			}

			if (!connected){
				message.put("type", "erreur");
				message.put("value", erreurs);
				donnees.put("message", message);
			}
			else{
				message.put("type", "ok");
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
