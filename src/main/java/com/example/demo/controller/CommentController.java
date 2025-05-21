package com.example.demo.controller;

import com.example.demo.dto.CommentDTO;
import com.example.demo.service.CommentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByProduct(@PathVariable Long productId) {
        List<CommentDTO> comments = commentService.getCommentsByProduct(productId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/product/{productId}/user/{userId}")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long productId, @PathVariable Long userId, @RequestBody CommentDTO commentDTO) {
        CommentDTO newComment = commentService.addComment(productId, userId, commentDTO.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(newComment);
    }
}



