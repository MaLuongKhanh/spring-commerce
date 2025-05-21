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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class ShoppingCartServiceImplTest {

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShoppingCartServiceImpl shoppingCartService;

    private User user;
    private ShoppingCart shoppingCart;
    private Product product;
    private CartItem cartItem;
    private AddItemToCartDto addItemToCartDto;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        shoppingCart = ShoppingCart.builder().id(1L).user(user).items(new ArrayList<>()).build();
        product = Product.builder().id(1L).name("Test Product").price(BigDecimal.TEN).build();
        cartItem = CartItem.builder().id(1L).shoppingCart(shoppingCart).product(product).quantity(1).build();
        addItemToCartDto = AddItemToCartDto.builder().productId(1L).quantity(1).build();
    }

    @Test
    public void getShoppingCartByUserId_WhenCartExists_ShouldReturnCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.of(shoppingCart));

        ShoppingCartDto result = shoppingCartService.getShoppingCartByUserId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertTrue(result.getItems().isEmpty());
    }

    @Test
    public void getShoppingCartByUserId_WhenCartNotExists_ShouldCreateNewCart() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.empty());
        when(shoppingCartRepository.save(any(ShoppingCart.class))).thenReturn(shoppingCart);

        ShoppingCartDto result = shoppingCartService.getShoppingCartByUserId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1L, result.getUserId());
        assertTrue(result.getItems().isEmpty());
        verify(shoppingCartRepository).save(any(ShoppingCart.class));
    }

    @Test
    public void getShoppingCartByUserId_WhenUserNotExists_ShouldThrowException() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> 
            shoppingCartService.getShoppingCartByUserId(1L)
        );
    }

    @Test
    public void addItemToCart_WhenItemNotExists_ShouldAddNewItem() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.of(shoppingCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByShoppingCartIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);

        ShoppingCartDto result = shoppingCartService.addItemToCart(1L, addItemToCartDto);

        assertNotNull(result);
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    public void addItemToCart_WhenItemExists_ShouldUpdateQuantity() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.of(shoppingCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByShoppingCartIdAndProductId(1L, 1L)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(any(CartItem.class))).thenReturn(cartItem);

        ShoppingCartDto result = shoppingCartService.addItemToCart(1L, addItemToCartDto);

        assertNotNull(result);
        assertEquals(2, cartItem.getQuantity());
        verify(cartItemRepository).save(cartItem);
    }

    @Test
    public void removeItemFromCart_ShouldRemoveItem() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.of(shoppingCart));
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        ShoppingCartDto result = shoppingCartService.removeItemFromCart(1L, 1L);

        assertNotNull(result);
        verify(cartItemRepository).delete(cartItem);
    }

    @Test
    public void clearShoppingCart_ShouldRemoveAllItems() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUser(user)).thenReturn(Optional.of(shoppingCart));
        shoppingCart.getItems().add(cartItem);

        ShoppingCartDto result = shoppingCartService.clearShoppingCart(1L);

        assertNotNull(result);
        assertTrue(result.getItems().isEmpty());
        verify(cartItemRepository).deleteAll(shoppingCart.getItems());
    }
}
