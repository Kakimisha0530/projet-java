package com.aicha.filters;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.aicha.models.User;
import com.aicha.utils.Connexion;
import com.aicha.utils.Utils;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * Servlet Filter implementation class FilterServlet
 */
@WebFilter("/FilterServlet")
public class FilterServlet implements Filter {

	private int connected;
	private Connexion connect;

	/**
	 * Default constructor.
	 */
	public FilterServlet() {
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
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		try {
			HttpServletRequest req = (HttpServletRequest) request;
			HttpServletResponse res = (HttpServletResponse) response;
			Gson gson = new GsonBuilder().excludeFieldsWithModifiers(Modifier.TRANSIENT).setPrettyPrinting().create();
			HashMap<String, Object> donnees = new HashMap<String, Object>();

			String token = (String) req.getParameter("token");
			Object obj = req.getSession().getAttribute("CONNECTED");
			this.connected = (obj != null && Utils.isInteger(obj.toString()))?Integer.parseInt(obj.toString()):0;
			
			int iduser = 0;

			if (this.checkToken(token))
				chain.doFilter(request, response);
			else if (token != null && !token.isEmpty() && ((iduser = isToken(token)) > 0)) {
				User user = new User(iduser);
				user.find(connect);
				if(user.exist()){
					req.getSession().setAttribute("CONNECTED", user.getId());
					chain.doFilter(request, response);
				}
				else{
					HashMap<String, Object> message = new HashMap<String, Object>();
					message.put("type", "erreur");
					message.put("value", new String[]{"Le token est invalide"});
					donnees.put("message", message);
					response.getOutputStream().print(gson.toJson(donnees));
				}
			}
			else {
				req.getRequestDispatcher("/bytoken/connect").forward(req, res);
				/*HashMap<String, Object> message = new HashMap<String, Object>();
				message.put("type", "erreur");
				message.put("value", new String[]{"Le token est invalide" , "token=" + token , "id=" + isToken(token) , "connected=" + this.connected});
				donnees.put("message", message);
				response.getOutputStream().print(gson.toJson(donnees));*/
			}
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

	private boolean checkToken(String str) {
		int id_ = isToken(str);
		return id_ > 0 && this.connected > 0 && id_ == this.connected;
	}

	private int isToken(String str) {
		if(str != null && str.matches("(\\d+)-([a-z]|[A-Z]|\\d)+")){
			String id_ = str.split("-")[0];
			return Utils.isInteger(id_)?Integer.parseInt(id_):0;
		}
		return 0;
	}

}
