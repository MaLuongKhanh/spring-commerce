package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import com.example.demo.model.Comment;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired private CommentRepository commentRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    @Override
    public List<CommentDTO> getCommentsByProduct(Long productId) {
        return commentRepository.findByProductId(productId).stream()
            .map(this::convertToDTO) 
            .collect(Collectors.toList());
    }

    @Override
    public CommentDTO addComment(Long productId, Long userId, String content) {
        Comment comment = new Comment();
        comment.setProduct(productRepository.findById(productId).orElseThrow());
        comment.setUser(userRepository.findById(userId).orElseThrow());
        comment.setContent(content);
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());
        commentRepository.save(comment);
        return convertToDTO(comment);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return CommentDTO.builder()
            .id(comment.getId())
            .content(comment.getContent())
            .createdAt(comment.getCreatedAt().toString())
            .userId(comment.getUser().getId())
            .userFullname(comment.getUser().getFirstname() + " " + comment.getUser().getLastname())
            .build();
    }
}

