package com.example.demo.controller;

import com.example.demo.dto.AddItemToCartDto;
import com.example.demo.dto.ShoppingCartDto;
import com.example.demo.service.ShoppingCartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shopping-carts")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    public ShoppingCartController(ShoppingCartService shoppingCartService) {
        this.shoppingCartService = shoppingCartService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ShoppingCartDto> getShoppingCartByUserId(@PathVariable("userId") Long userId) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.getShoppingCartByUserId(userId);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @PostMapping("/user/{userId}/items")
    public ResponseEntity<ShoppingCartDto> addItemToCart(
            @PathVariable("userId") Long userId,
            @Valid @RequestBody AddItemToCartDto addItemToCartDto) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.addItemToCart(userId, addItemToCartDto);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @DeleteMapping("/user/{userId}/items/{itemId}")
    public ResponseEntity<ShoppingCartDto> removeItemFromCart(
            @PathVariable("userId") Long userId,
            @PathVariable("itemId") Long itemId) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.removeItemFromCart(userId, itemId);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @DeleteMapping("/user/{userId}/clear")
    public ResponseEntity<ShoppingCartDto> clearShoppingCart(@PathVariable("userId") Long userId) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.clearShoppingCart(userId);
        return ResponseEntity.ok(shoppingCartDto);
    }
}
