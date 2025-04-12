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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
public class ShoppingCartServiceImplTest {

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ShoppingCartServiceImpl shoppingCartService;

    private ShoppingCart shoppingCart;
    private Product product;
    private CartItem cartItem;
    private AddItemToCartDto addItemToCartDto;

    @BeforeEach
    public void setup() {
        shoppingCart = ShoppingCart.builder().id(1L).items(new ArrayList<>()).build();
        product = Product.builder().id(1L).name("Test Product").price(BigDecimal.TEN).build();
        cartItem = CartItem.builder().id(1L).shoppingCart(shoppingCart).product(product).quantity(1).build();
        addItemToCartDto = AddItemToCartDto.builder().productId(1L).quantity(1).build();
    }

    @Test
    public void givenCartId_whenGetShoppingCart_thenReturnShoppingCartDto() {
        when(shoppingCartRepository.findById(1L)).thenReturn(Optional.of(shoppingCart));

        ShoppingCartDto shoppingCartDto = shoppingCartService.getShoppingCart(1L);

        assertEquals(1L, shoppingCartDto.getId());
    }

    @Test
    public void givenNonExistingCartId_whenGetShoppingCart_thenThrowsResourceNotFoundException() {
        when(shoppingCartRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> shoppingCartService.getShoppingCart(1L));
    }

    @Test
    public void givenCartIdAndAddItemToCartDto_whenAddItemToCart_thenReturnShoppingCartDto() {
        when(shoppingCartRepository.findById(1L)).thenReturn(Optional.of(shoppingCart));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByShoppingCartIdAndProductId(1L, 1L)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any())).thenReturn(cartItem);

        ShoppingCartDto shoppingCartDto = shoppingCartService.addItemToCart(1L, addItemToCartDto);

        assertEquals(1, shoppingCartDto.getItems().size());
        assertEquals(1L, shoppingCartDto.getItems().get(0).getProductId());
    }

    @Test
    public void givenCartIdAndCartItemId_whenRemoveItemFromCart_thenReturnShoppingCartDto() {
        when(shoppingCartRepository.findById(1L)).thenReturn(Optional.of(shoppingCart));
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(cartItem));

        ShoppingCartDto shoppingCartDto = shoppingCartService.removeItemFromCart(1L, 1L);

        verify(cartItemRepository, times(1)).delete(cartItem);
    }

    @Test
    public void givenCartId_whenClearShoppingCart_thenReturnShoppingCartDto() {
        when(shoppingCartRepository.findById(1L)).thenReturn(Optional.of(shoppingCart));

        ShoppingCartDto shoppingCartDto = shoppingCartService.clearShoppingCart(1L);

        verify(cartItemRepository, times(1)).deleteAll(shoppingCart.getItems());
    }
}
