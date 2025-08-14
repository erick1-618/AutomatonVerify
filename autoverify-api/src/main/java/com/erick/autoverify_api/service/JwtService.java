package com.erick.autoverify_api.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import com.erick.autoverify_api.model.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final String SECRET = "AutomatosCelularesSãoIncríveis:D";
	
	public String generateToken(String userName) {
		return Jwts.builder()
				.setSubject(userName)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 3600))
				.signWith(Keys.hmacShaKeyFor(SECRET.getBytes()), io.jsonwebtoken.SignatureAlgorithm.HS256)
				.compact();
	}
	
	public String extractName(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(SECRET.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean isTokenValid(String token, User user) {
        String name = extractName(token);
        return name.equals(user.getName()) && !isExpired(token);
    }

    private boolean isExpired(String token) {
        Date expiration = Jwts.parserBuilder()
            .setSigningKey(SECRET.getBytes())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration();
        return expiration.before(new Date());
    }
}
