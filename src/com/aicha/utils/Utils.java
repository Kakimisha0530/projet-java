package com.aicha.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 *
 * @author aicha
 */
public abstract class Utils {

	// public static final String DEFAULT_COLORS = "";

	public static int[] getInterval(int annee, int mois) {
		int debut, fin;
		Calendar cal = Calendar.getInstance();
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		cal.set(annee, mois, 1);
		debut = Integer.parseInt(dateFormat.format(cal.getTime()));
		cal.set(annee, mois, cal.getActualMaximum(Calendar.DAY_OF_MONTH));
		fin = Integer.parseInt(dateFormat.format(cal.getTime()));

		return new int[] { debut, fin };
	}

	public static boolean isNotEmpty(String... val) {
		for (String str : val) {
			if ("".equals(str) || str == null)
				return false;
		}
		return true;
	}

	public static int getCurrentYear() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());

		return cal.get(Calendar.YEAR);
	}

	public static int getCurrentMonth() {
		Calendar cal = Calendar.getInstance();
		cal.setTime(new Date());

		return cal.get(Calendar.MONTH);
	}

	public static int[] parserDate(String str) {
		if (str.length() >= 8) {
			// System.out.println(str);
			int a = Integer.parseInt(str.substring(0, 4));
			int m = Integer.parseInt(str.substring(4, 6)) - 1;
			int j = Integer.parseInt(str.substring(6, 8));
			return new int[] { a, m, j };
		}

		return null;
	}

	public static String getTime(String str) {
		String res = "";
		if (str.length() >= 3) {
			str = (str.length() < 4) ? "0" + str : str;
			String h = str.substring(0, 2),
				   m = str.substring(2, 4);
			
			res = h + ":" + m;
		}
		else if(Integer.parseInt(str) <= 0)
			res = "00:00";

		return res;
	}

	public static Date getDate(String str) {
		int[] dd = parserDate(str);
		Calendar cal = Calendar.getInstance();
		cal.set(dd[0], dd[1], dd[2]);
		return cal.getTime();
	}

	public static boolean isInteger(String s) {
		try {
			Integer.parseInt(s);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}

	public static boolean isFloat(String s) {
		try {
			Float.parseFloat(s);
		} catch (NumberFormatException e) {
			return false;
		}
		return true;
	}
	
	public static String generateMD5(String str) throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("MD5");
        md.update(str.getBytes());
 
        byte byteData[] = md.digest();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < byteData.length; i++) {
         sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
        }
 
        return sb.toString();
	}
}
