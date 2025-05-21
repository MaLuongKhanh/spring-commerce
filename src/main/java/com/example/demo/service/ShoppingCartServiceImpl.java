package com.example.demo.service;

import com.example.demo.dto.AddItemToCartDto;
import com.example.demo.dto.CartItemDto;
import com.example.demo.dto.ShoppingCartDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.CartItem;
import com.example.demo.model.Product;
import com.example.demo.model.ShoppingCart;
import com.example.demo.model.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ShoppingCartRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShoppingCartServiceImpl implements ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ShoppingCartServiceImpl(
            ShoppingCartRepository shoppingCartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public ShoppingCartDto getShoppingCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user)
                .orElseGet(() -> createNewShoppingCart(user));

        return convertToDto(shoppingCart);
    }

    @Override
    @Transactional
    public ShoppingCartDto addItemToCart(Long userId, AddItemToCartDto addItemToCartDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user)
                .orElseGet(() -> createNewShoppingCart(user));

        Product product = productRepository.findById(addItemToCartDto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", addItemToCartDto.getProductId()));

        CartItem existingCartItem = cartItemRepository.findByShoppingCartIdAndProductId(shoppingCart.getId(), product.getId())
                .orElse(null);

        if (existingCartItem != null) {
            existingCartItem.setQuantity(existingCartItem.getQuantity() + addItemToCartDto.getQuantity());
            cartItemRepository.save(existingCartItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setShoppingCart(shoppingCart);
            cartItem.setProduct(product);
            cartItem.setQuantity(addItemToCartDto.getQuantity());
            cartItemRepository.save(cartItem);
            shoppingCart.addItem(cartItem);
        }

        return getShoppingCartByUserId(userId);
    }

    @Override
    @Transactional
    public ShoppingCartDto removeItemFromCart(Long userId, Long cartItemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user)
                .orElseGet(() -> createNewShoppingCart(user));

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getShoppingCart().getId().equals(shoppingCart.getId())) {
            throw new ResourceNotFoundException("CartItem", "id", cartItemId);
        }

        shoppingCart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);

        return getShoppingCartByUserId(userId);
    }

    @Override
    @Transactional
    public ShoppingCartDto clearShoppingCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        ShoppingCart shoppingCart = shoppingCartRepository.findByUser(user)
                .orElseGet(() -> createNewShoppingCart(user));

        List<CartItem> cartItems = shoppingCart.getItems();
        cartItemRepository.deleteAll(cartItems);
        shoppingCart.getItems().clear();

        return getShoppingCartByUserId(userId);
    }

    private ShoppingCart createNewShoppingCart(User user) {
        ShoppingCart newCart = new ShoppingCart();
        newCart.setUser(user);
        return shoppingCartRepository.save(newCart);
    }

    private ShoppingCartDto convertToDto(ShoppingCart shoppingCart) {
        ShoppingCartDto dto = new ShoppingCartDto();
        dto.setId(shoppingCart.getId());
        dto.setUserId(shoppingCart.getUser().getId());
        dto.setItems(shoppingCart.getItems().stream()
                .map(item -> {
                    CartItemDto cartItemDto = new CartItemDto();
                    cartItemDto.setId(item.getId());
                    cartItemDto.setProductId(item.getProduct().getId());
                    cartItemDto.setProductName(item.getProduct().getName());
                    cartItemDto.setProductPrice(item.getProduct().getPrice());
                    cartItemDto.setQuantity(item.getQuantity());
                    // Lấy ảnh đầu tiên từ danh sách ảnh của sản phẩm
                    if (item.getProduct().getImages() != null && item.getProduct().getImages().length > 0) {
                        cartItemDto.setImageUrl(item.getProduct().getImages()[0]);
                    }
                    return cartItemDto;
                })
                .collect(Collectors.toList()));
        return dto;
    }
}
