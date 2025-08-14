package com.erick.autoverify_api.service.ca.tools;

import java.io.IOException;
import java.util.BitSet;

import org.springframework.web.multipart.MultipartFile;

import com.erick.autoverify_api.service.ca.CellularAutomata;

public class CellularAutomataFactory {

	private CellularAutomataFactory() {
	}

	public static CellularAutomata create(MultipartFile file) {

		try {

			byte[] bytes = file.getBytes();
			
			BitSet bs = getBitSet(bytes);
			
			return new CellularAutomata(bs);
			
		} catch (IOException e) {
			return null;
		}
	}
	
	private static BitSet getBitSet(byte[] bytes) {
	    BitSet bs = new BitSet(CellularAutomata.SIZE);
	    int index = 0;

	    for (byte b : bytes) {
	        for (int j = 7; j >= 0; j--) {
	            boolean bit = ((b >> j) & 1) == 1;
	            bs.set(index, bit);
	            index++;
	        }
	    }

	    return bs;
	}
}
