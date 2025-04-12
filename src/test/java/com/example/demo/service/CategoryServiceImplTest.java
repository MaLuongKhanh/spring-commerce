package com.example.demo.service;

import com.example.demo.dto.CategoryDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;
    private CategoryDto categoryDto;

    @BeforeEach
    public void setup() {
        category = Category.builder()
                .id(1L)
                .name("Test Category")
                .build();

        categoryDto = CategoryDto.builder()
                .name("Test Category")
                .build();
    }

    @Test
    public void givenCategoryDto_whenCreateCategory_thenReturnCategoryDto() {
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDto savedCategoryDto = categoryService.createCategory(categoryDto);

        assertEquals(category.getId(), savedCategoryDto.getId());
        assertEquals(category.getName(), savedCategoryDto.getName());
    }

    @Test
    public void givenCategoryId_whenGetCategoryById_thenReturnCategoryDto() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        CategoryDto retrievedCategoryDto = categoryService.getCategoryById(1L);

        assertEquals(category.getId(), retrievedCategoryDto.getId());
        assertEquals(category.getName(), retrievedCategoryDto.getName());
    }

    @Test
    public void givenNonExistingCategoryId_whenGetCategoryById_thenThrowsResourceNotFoundException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(1L));
    }

    @Test
    public void givenCategoryIdAndCategoryDto_whenUpdateCategory_thenReturnUpdatedCategoryDto() {
        CategoryDto updatedCategoryDto = CategoryDto.builder()
                .name("Updated Category")
                .build();
        Category updatedCategory = Category.builder()
                .id(1L)
                .name("Updated Category")
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(any(Category.class))).thenReturn(updatedCategory);

        CategoryDto resultDto = categoryService.updateCategory(1L, updatedCategoryDto);

        assertEquals(1L, resultDto.getId());
        assertEquals("Updated Category", resultDto.getName());
    }

    @Test
    public void givenCategoryId_whenDeleteCategory_thenCategoryIsDeleted() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).delete(category);
    }

    @Test
    public void givenNonExistingCategoryId_whenDeleteCategory_thenThrowsResourceNotFoundException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.deleteCategory(1L));
    }
}
