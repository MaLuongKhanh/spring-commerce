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

    @GetMapping("{id}")
    public ResponseEntity<ShoppingCartDto> getShoppingCart(@PathVariable("id") Long cartId){
        ShoppingCartDto shoppingCartDto = shoppingCartService.getShoppingCart(cartId);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @PostMapping("{id}/items")
    public ResponseEntity<ShoppingCartDto> addItemToCart(
            @PathVariable("id") Long cartId,
            @Valid @RequestBody AddItemToCartDto addItemToCartDto){
        ShoppingCartDto shoppingCartDto = shoppingCartService.addItemToCart(cartId, addItemToCartDto);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @DeleteMapping("{cartId}/items/{itemId}")
    public ResponseEntity<ShoppingCartDto> removeItemFromCart(
            @PathVariable("cartId") Long cartId,
            @PathVariable("itemId") Long itemId) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.removeItemFromCart(cartId, itemId);
        return ResponseEntity.ok(shoppingCartDto);
    }

    @DeleteMapping("{id}/clear")
    public ResponseEntity<ShoppingCartDto> clearShoppingCart(@PathVariable("id") Long cartId) {
        ShoppingCartDto shoppingCartDto = shoppingCartService.clearShoppingCart(cartId);
        return ResponseEntity.ok(shoppingCartDto);
    }
}
