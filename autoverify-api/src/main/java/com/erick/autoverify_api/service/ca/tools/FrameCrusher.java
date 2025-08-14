package com.erick.autoverify_api.service.ca.tools;

import java.math.BigInteger;
import java.util.BitSet;

public class FrameCrusher {
	
	public static String flatten(BitSet bs) {
		
		BitSet flat = new BitSet(737);
		
		for(int i = 0; i < 400315553; i += 737) {
			flat.xor(bs.get(i, i + 737));
		}
		
		String binStr = "";
		
		for(int i = 0; i < 737; i++) {
			binStr += flat.get(i) ? '1' : '0';
		}
		
		BigInteger result = new BigInteger(binStr, 2);
		return result.toString(26);
	}
}
