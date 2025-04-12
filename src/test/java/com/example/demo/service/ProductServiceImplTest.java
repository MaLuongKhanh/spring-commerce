package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private ProductDto productDto;
    private Category category;

    @BeforeEach
    public void setup() {
        category = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        product = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .price(BigDecimal.valueOf(100))
                .brand("Test Brand")
                .color("Test Color")
                .category(category)
                .build();

        productDto = ProductDto.builder()
                .name("Test Product")
                .description("Test Description")
                .price(BigDecimal.valueOf(100))
                .brand("Test Brand")
                .color("Test Color")
                .categoryId(1L)
                .build();
    }

    @Test
    public void givenProductDto_whenCreateProduct_thenReturnProductDto() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto savedProductDto = productService.createProduct(productDto);

        assertEquals(product.getId(), savedProductDto.getId());
        assertEquals(product.getName(), savedProductDto.getName());
    }

    @Test
    public void givenProductId_whenGetProductById_thenReturnProductDto() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductDto retrievedProductDto = productService.getProductById(1L);

        assertEquals(product.getId(), retrievedProductDto.getId());
        assertEquals(product.getName(), retrievedProductDto.getName());
    }

    @Test
    public void givenNonExistingProductId_whenGetProductById_thenThrowsResourceNotFoundException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(1L));
    }

    @Test
    public void givenProductIdAndProductDto_whenUpdateProduct_thenReturnUpdatedProductDto() {
        ProductDto updatedProductDto = ProductDto.builder()
                .name("Updated Product")
                .description("Updated Description")
                .price(BigDecimal.valueOf(200))
                .brand("Updated Brand")
                .color("Updated Color")
                .categoryId(1L)
                .build();
        Product updatedProduct = Product.builder()
                .id(1L)
                .name("Updated Product")
                .description("Updated Description")
                .price(BigDecimal.valueOf(200))
                .brand("Updated Brand")
                .color("Updated Color")
                .category(category)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductDto resultDto = productService.updateProduct(1L, updatedProductDto);

        assertEquals(1L, resultDto.getId());
        assertEquals("Updated Product", resultDto.getName());
        assertEquals("Updated Description", resultDto.getDescription());
        assertEquals(BigDecimal.valueOf(200), resultDto.getPrice());
        assertEquals("Updated Brand", resultDto.getBrand());
        assertEquals("Updated Color", resultDto.getColor());
    }

    @Test
    public void givenProductId_whenDeleteProduct_thenProductIsDeleted() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).delete(product);
    }

    @Test
    public void givenNonExistingProductId_whenDeleteProduct_thenThrowsResourceNotFoundException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(1L));
    }

    @Test
    public void givenCriteria_whenGetProductsByCriteria_thenReturnProductDtoPage() {
        Pageable pageable = Pageable.unpaged();
        List<Product> products = Collections.singletonList(product);
        Page<Product> productPage = new PageImpl<>(products, pageable, products.size());

        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(productPage);

        Page<ProductDto> resultPage = productService.getProductsByCriteria(
                "Test Category", "Test Brand", "Test Color", 50.0, 150.0, pageable
        );

        assertEquals(1, resultPage.getContent().size());
        assertEquals("Test Product", resultPage.getContent().get(0).getName());
    }
}
