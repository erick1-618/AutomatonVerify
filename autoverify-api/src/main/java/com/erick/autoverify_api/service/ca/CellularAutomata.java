package com.erick.autoverify_api.service.ca;

import java.util.BitSet;

public class CellularAutomata {

	private static final Long[] RULE = { 985768897567085864L, 987986786758695857L};
	
	public static final int CUBE_ROOT = 737;
	public static final int SIZE = 400315553;

	private BitSet cube;
	private Rule rule;

	public CellularAutomata(BitSet initialGen, Long... rule) {

		setRule(rule[0], rule[1]);

		this.cube = initialGen;
	}

	public CellularAutomata(BitSet initialGen) {

		setRule(RULE[0], RULE[1]);

		this.cube = initialGen;
	}
	
	public CellularAutomata(BitSet initialGen, String ruleStr) {

		this.rule = new Rule(ruleStr);

		this.cube = initialGen;
	}

	public CellularAutomata(Long... rule) {

		setRule(rule[0], rule[1]);

		this.cube = new BitSet(SIZE);

		int middleIndex = (CUBE_ROOT / 2) * (CUBE_ROOT * CUBE_ROOT) + (CUBE_ROOT / 2) * (CUBE_ROOT) + (CUBE_ROOT / 2);

		this.cube.set(middleIndex);
	}

	public String getRule() {
		return this.rule.getRuleStr();
	}

	private void setRule(long r1, long r2) {
		String num1 = Long.toBinaryString(r1);
		String num2 = Long.toBinaryString(r2);
		String num3 = num1 + num2;
		while (num3.length() < 128) {
			num3 = "0" + num3;
		}
		String ruleStr = new StringBuilder(num3).reverse().toString();
		this.rule = new Rule(ruleStr);
	}

	public BitSet getGen() {
		return cube;
	}

	// Cálculo índice: int index = x * (Y * Z) + y * Z + z;
	public void nextGen() {

		BitSet newGen = new BitSet(SIZE);

		int N = CUBE_ROOT;

		for (int i = 0; i < CUBE_ROOT; i++) {
			for (int j = 0; j < CUBE_ROOT; j++) {
				for (int k = 0; k < CUBE_ROOT; k++) {
					// Índice linear da célula atual (i, j, k)
					int index = i * N * N + j * N + k;

					// Obtém o valor dos vizinhos. Fora dos limites → trata como 0.
					int ruleIndex = 0;
					ruleIndex |= (getBitSafe(i - 1, j, k, N) ? 1 << 6 : 0);
					ruleIndex |= (getBitSafe(i, j - 1, k, N) ? 1 << 5 : 0);
					ruleIndex |= (getBitSafe(i, j, k - 1, N) ? 1 << 4 : 0);
					ruleIndex |= (getBitSafe(i, j, k, N) ? 1 << 3 : 0);
					ruleIndex |= (getBitSafe(i, j, k + 1, N) ? 1 << 2 : 0);
					ruleIndex |= (getBitSafe(i, j + 1, k, N) ? 1 << 1 : 0);
					ruleIndex |= (getBitSafe(i + 1, j, k, N) ? 1 : 0);

					// Aplica a regra
					boolean result = rule.charAt(ruleIndex) == '1';
					newGen.set(index, result);
				}
			}
		}

		this.cube = newGen;
	}

	private boolean getBitSafe(int i, int j, int k, int N) {
		if (i < 0 || i >= N || j < 0 || j >= N || k < 0 || k >= N) {
			return false;
		}
		int index = i * N * N + j * N + k;
		return cube.get(index);
	}
}