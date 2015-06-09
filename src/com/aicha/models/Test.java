package com.aicha.models;

import com.aicha.utils.Utils;

public class Test {

	public static void main(String[] args) {
		String str = "12345-921a1bc376baabb31c42b904b623f611";
			if(str != null && str.matches("(\\d+)-([a-z]|[A-Z]|\\d)+")){
				String id_ = str.split("-")[0];
				System.out.println(Utils.isInteger(id_)?Integer.parseInt(id_):0);
			}
			else
				System.out.println(0);
	}

}
