package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Category;
import com.example.demo.model.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.persistence.criteria.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceImpl.class);
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final String uploadDir;
    
    public ProductServiceImpl(ProductRepository productRepository, 
                            CategoryRepository categoryRepository,
                            @Value("${app.upload.dir}") String uploadDir) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.uploadDir = uploadDir;
    }

    private String[] saveImages(MultipartFile[] images) {
        if (images == null || images.length == 0) {
            return new String[0];
        }

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            if (image != null && !image.isEmpty()) {
                try {
                    String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                    File uploadDir = new File("src/main/resources/static/images/products");
                    if (!uploadDir.exists()) {
                        uploadDir.mkdirs();
                    }
                    File destFile = new File(uploadDir.getAbsolutePath() + File.separator + fileName);
                    image.transferTo(destFile);
                    imageUrls.add("/images/products/" + fileName);
                } catch (IOException e) {
                    logger.error("Could not save image file: " + image.getOriginalFilename(), e);
                }
            }
        }
        return imageUrls.toArray(new String[0]);
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
        product.setStock(productDto.getStock());

        if (productDto.getImages() != null) {
            String[] imageUrls = saveImages(productDto.getImages());
            product.setImages(imageUrls);
        }

        product.setSold(0);

        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return convertToDto(product);
    }

    @Override
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductDto> productDtos = productPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, productPage.getTotalElements());
    }

    public List<ProductDto> getAllProductsList() {
        return productRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Handle partial updates
        if (productDto.getName() != null) {
            product.setName(productDto.getName());
        }
        if (productDto.getDescription() != null) {
            product.setDescription(productDto.getDescription());
        }
        if (productDto.getPrice() != null) {
            product.setPrice(productDto.getPrice());
        }
        if (productDto.getBrand() != null) {
            product.setBrand(productDto.getBrand());
        }
        if (productDto.getColor() != null) {
            product.setColor(productDto.getColor());
        }
        if (productDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDto.getCategoryId()));
            product.setCategory(category);
        }
        if (productDto.getStock() >= 0) {
            product.setStock(productDto.getStock());
        }

        if (productDto.getImages() != null && productDto.getImages().length > 0) {
            if (product.getImages() != null) {
                for (String oldImage : product.getImages()) {
                    String fileName = oldImage.substring(oldImage.lastIndexOf("/") + 1);
                    File oldFile = new File(uploadDir + File.separator + fileName);
                    if (oldFile.exists()) {
                        oldFile.delete();
                    }
                }
            }
            String[] imageUrls = saveImages(productDto.getImages());
            product.setImages(imageUrls);
        }

        Product updatedProduct = productRepository.save(product);
        return convertToDto(updatedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        productRepository.delete(product);
    }

    @Override
    public Page<ProductDto> getProductsByCriteria(
            String name, String categoryId, String brand, String color,
            Double minPrice, Double maxPrice, Pageable pageable) {
        Specification<Product> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null && !name.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("name"), name));
            }
            if (categoryId != null && !categoryId.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), Long.parseLong(categoryId)));
            }
            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("brand"), brand));
            }
            if (color != null && !color.isEmpty()) {
                predicates.add(criteriaBuilder.like(root.get("color"), color));
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
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return new PageImpl<>(productDtos, pageable, productPage.getTotalElements());
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = ProductDto.builder()
            .id(product.getId())
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .brand(product.getBrand())
            .color(product.getColor())
            .categoryId(product.getCategory().getId())
            .stock(product.getStock())
            .imageUrls(product.getImages())
            .sold(product.getSold())
            .build();
        return dto;
    }
}