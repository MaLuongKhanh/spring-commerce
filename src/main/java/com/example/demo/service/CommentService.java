package com.example.demo.service;

import com.example.demo.dto.CommentDTO;
import java.util.List;

public interface CommentService {
    List<CommentDTO> getCommentsByProduct(Long productId);
    CommentDTO addComment(Long productId, Long userId, String content);
}
