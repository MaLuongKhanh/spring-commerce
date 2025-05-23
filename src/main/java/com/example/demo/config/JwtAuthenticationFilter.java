package com.example.demo.config;

import com.example.demo.service.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        logger.info("Processing request to: {}", request.getRequestURI());

        // Kiểm tra header Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.info("No Authorization header or invalid format");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        logger.info("JWT token: {}", jwt);
        
        try {
            username = jwtService.extractUsername(jwt);
            logger.info("Extracted username from token: {}", username);
        } catch (ExpiredJwtException e) {
            logger.error("Token expired: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired");
            return;
        } catch (Exception e) {
            logger.error("Invalid token: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token");
            return;
        }

        // Xác thực user
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            logger.info("Loading user details for username: {}", username);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            logger.info("User authorities: {}", userDetails.getAuthorities());
            
            if (jwtService.isTokenValid(jwt, userDetails)) {
                logger.info("Token is valid, getting authentication");
                Authentication authentication = jwtService.getAuthentication(jwt);
                logger.info("Authentication authorities: {}", authentication.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                logger.info("Authentication set in SecurityContext");
            } else {
                logger.error("Token is invalid for user: {}", username);
            }
        } else {
            logger.info("Username is null or authentication already exists");
        }
        filterChain.doFilter(request, response);
    }
} 