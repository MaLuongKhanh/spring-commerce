package com.example.demo.service;

import com.example.demo.dto.AddItemToCartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.dto.ShoppingCartDto;

public interface ShoppingCartService {
    ShoppingCartDto getShoppingCart(Long id); // For MVP, single cart
    ShoppingCartDto addItemToCart(Long cartId, AddItemToCartDto addItemToCartDto);
    ShoppingCartDto removeItemFromCart(Long cartId, Long cartItemId);
    ShoppingCartDto clearShoppingCart(Long cartId);
}
