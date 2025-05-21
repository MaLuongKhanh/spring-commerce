package com.example.demo.service;

import com.example.demo.dto.AddItemToCartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.dto.ShoppingCartDto;

public interface ShoppingCartService {
    ShoppingCartDto getShoppingCartByUserId(Long userId);
    ShoppingCartDto addItemToCart(Long userId, AddItemToCartDto addItemToCartDto);
    ShoppingCartDto removeItemFromCart(Long userId, Long cartItemId);
    ShoppingCartDto clearShoppingCart(Long userId);
}
