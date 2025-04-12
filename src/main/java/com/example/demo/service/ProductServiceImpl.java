package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDto.getCategoryId()));

        Product product = new Product();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setBrand(productDto.getBrand());
        product.setColor(productDto.getColor());
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        ProductDto savedProductDto = new ProductDto();
        savedProductDto.setId(savedProduct.getId());
        savedProductDto.setName(savedProduct.getName());
        savedProductDto.setDescription(savedProduct.getDescription());
        savedProductDto.setPrice(savedProduct.getPrice());
        savedProductDto.setBrand(savedProduct.getBrand());
        savedProductDto.setColor(savedProduct.getColor());
        savedProductDto.setCategoryId(savedProduct.getCategory().getId());

        return savedProductDto;
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        ProductDto productDto = new ProductDto();
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setBrand(product.getBrand());
        productDto.setColor(product.getColor());
        productDto.setCategoryId(product.getCategory().getId());

        return productDto;
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductDto> productDtos = productPage.getContent().stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getId());
                    productDto.setName(product.getName());
                    productDto.setDescription(product.getDescription());
                    productDto.setPrice(product.getPrice());
                    productDto.setBrand(product.getBrand());
                    productDto.setColor(product.getColor());
                    productDto.setCategoryId(product.getCategory().getId());
                    return productDto;
                })
                .collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, productPage.getTotalElements());
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDto.getCategoryId()));

        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setPrice(productDto.getPrice());
        product.setBrand(productDto.getBrand());
        product.setColor(productDto.getColor());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        ProductDto updatedProductDto = new ProductDto();
        updatedProductDto.setId(updatedProduct.getId());
        updatedProductDto.setName(updatedProduct.getName());
        updatedProductDto.setDescription(updatedProduct.getDescription());
        updatedProductDto.setPrice(updatedProduct.getPrice());
        updatedProductDto.setBrand(updatedProduct.getBrand());
        updatedProductDto.setColor(updatedProduct.getColor());
        updatedProductDto.setCategoryId(updatedProduct.getCategory().getId());

        return updatedProductDto;
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    @Override
    public Page<ProductDto> getProductsByCriteria(
            String categoryName,
            String brand,
            String color,
            Double minPrice,
            Double maxPrice,
            Pageable pageable
    ) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoryName != null && !categoryName.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("name"), categoryName));
            }
            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("brand"), brand));
            }
            if (color != null && !color.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("color"), color));
            }
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), BigDecimal.valueOf(minPrice)));
            }
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), BigDecimal.valueOf(maxPrice)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<Product> productPage = productRepository.findAll(spec, pageable);
        List<ProductDto> productDtos = productPage.getContent().stream()
                .map(product -> {
                    ProductDto productDto = new ProductDto();
                    productDto.setId(product.getId());
                    productDto.setName(product.getName());
                    productDto.setDescription(product.getDescription());
                    productDto.setPrice(product.getPrice());
                    productDto.setBrand(product.getBrand());
                    productDto.setColor(product.getColor());
                    productDto.setCategoryId(product.getCategory().getId());
                    return productDto;
                })
                .collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, productPage.getTotalElements());
    }
}
