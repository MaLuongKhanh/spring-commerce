package com.example.demo.service;

import com.example.demo.dto.AddItemToCartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.dto.ShoppingCartDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.ShoppingCart;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShoppingCartRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public ShoppingCartServiceImpl(ShoppingCartRepository shoppingCartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public ShoppingCartDto getShoppingCart(Long id) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ShoppingCart", "id", id));

        ShoppingCartDto shoppingCartDto = new ShoppingCartDto();
        shoppingCartDto.setId(shoppingCart.getId());
        shoppingCartDto.setItems(shoppingCart.getItems().stream()
                .map(item -> {
                    CartItemDto cartItemDto = new CartItemDto();
                    cartItemDto.setId(item.getId());
                    cartItemDto.setProductId(item.getProduct().getId());
                    cartItemDto.setProductName(item.getProduct().getName());
                    cartItemDto.setProductPrice(item.getProduct().getPrice());
                    cartItemDto.setQuantity(item.getQuantity());
                    return cartItemDto;
                })
                .collect(Collectors.toList()));

        return shoppingCartDto;
    }

    @Override
    public ShoppingCartDto addItemToCart(Long cartId, AddItemToCartDto addItemToCartDto) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("ShoppingCart", "id", cartId));

        Product product = productRepository.findById(addItemToCartDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", addItemToCartDto.getProductId()));

        CartItem existingCartItem = cartItemRepository.findByShoppingCartIdAndProductId(cartId, product.getId())
                .orElse(null);

        if (existingCartItem != null) {
            // Update quantity if item exists
            existingCartItem.setQuantity(existingCartItem.getQuantity() + addItemToCartDto.getQuantity());
            cartItemRepository.save(existingCartItem);
        } else {
            // Create new CartItem
            CartItem cartItem = new CartItem();
            cartItem.setShoppingCart(shoppingCart);
            cartItem.setProduct(product);
            cartItem.setQuantity(addItemToCartDto.getQuantity());
            cartItemRepository.save(cartItem);
            shoppingCart.addItem(cartItem);
        }

        return getShoppingCart(cartId); // Return updated cart
    }

    @Override
    public ShoppingCartDto removeItemFromCart(Long cartId, Long cartItemId) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("ShoppingCart", "id", cartId));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        shoppingCart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        return getShoppingCart(cartId);
    }

    @Override
    public ShoppingCartDto clearShoppingCart(Long cartId) {
        ShoppingCart shoppingCart = shoppingCartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("ShoppingCart", "id", cartId));

        List<CartItem> cartItems = shoppingCart.getItems();
        cartItemRepository.deleteAll(cartItems);
        shoppingCart.getItems().clear(); // Clear the list in the ShoppingCart entity

        return getShoppingCart(cartId);
    }
}
