package com.erick.autoverify_api.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.erick.autoverify_api.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final String SECRET = "AutomatosCelularesSãoIncríveis:D";

	@Value("${jwt.expiration-hours:168}")
	private long expirationHours;

	public String generateToken(String userName) {
		long expirationMillis = 1000L * 3600L * (expirationHours > 0 ? expirationHours : 168);
		return Jwts.builder()
				.setSubject(userName)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expirationMillis))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8)), io.jsonwebtoken.SignatureAlgorithm.HS256)
				.compact();
	}

	public String extractName(String token) {
		try {
			return getClaims(token).getSubject();
		} catch (Exception e) {
			return null;
		}
	}

	public boolean isTokenValid(String token, User user) {
		try {
			Claims claims = getClaims(token);
			String name = claims.getSubject();
			Date expiration = claims.getExpiration();
			return name != null && name.equals(user.getName()) && expiration.after(new Date());
		} catch (Exception e) {
			return false;
		}
	}

	private Claims getClaims(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(SECRET.getBytes(StandardCharsets.UTF_8))
				.build()
				.parseClaimsJws(token)
				.getBody();
	}
}
