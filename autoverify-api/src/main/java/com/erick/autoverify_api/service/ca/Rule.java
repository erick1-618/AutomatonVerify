package com.erick.autoverify_api.service.ca;

public class Rule {

	private String ruleStr;
	
	public Rule(String rule) {
		this.ruleStr = rule;
	}
	
	public String getRuleStr() {
		return this.ruleStr;
	}
	
	public char charAt(int index) {
		return ruleStr.charAt(index);
	}
}
