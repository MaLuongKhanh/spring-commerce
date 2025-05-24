# Spring Commerce Application

## SOLUTION
- [x] Entity-relationship diagram 
  - ![Diagram db](src/main/resources/static/images/erd.png)
- [x] Solution diagram 
  - ![Diagram db](src/main/resources/static/images/solution-diagram.png)

## Software Development Principles, Patterns and Practices

### SOLID Principles
- **Single Responsibility Principle (SRP)**: Mỗi class chỉ có một nhiệm vụ duy nhất
  - Controllers xử lý HTTP requests
  - Services xử lý business logic
  - Repositories xử lý data access

- **Open/Closed Principle (OCP)**: Code mở rộng nhưng không sửa đổi
  - Sử dụng interfaces cho repositories và services
  - Dễ dàng thêm tính năng mới mà không ảnh hưởng code hiện tại

- **Liskov Substitution Principle (LSP)**: Các class con có thể thay thế class cha
  - UserDetailsImpl kế thừa từ UserDetails
  - Các entity kế thừa từ BaseEntity

- **Interface Segregation Principle (ISP)**: Interface nhỏ, tập trung
  - Mỗi repository interface chỉ định nghĩa các method cần thiết
  - Service interfaces được chia nhỏ theo chức năng

- **Dependency Inversion Principle (DIP)**: Phụ thuộc vào abstraction
  - Sử dụng dependency injection của Spring
  - Các dependency được inject thông qua constructor

### Design Patterns
- **MVC Pattern**:
  - Model: Entities, Repositories, Services
  - View: Frontend React components
  - Controller: REST Controllers

- **Repository Pattern**:
  - Tách biệt logic truy cập dữ liệu
  - JPA Repositories cho database operations

- **Service Layer Pattern**:
  - Business logic được đóng gói trong services
  - Transaction management
  - Data validation

- **DTO Pattern**:
  - Tách biệt entity và data transfer objects
  - Mapping giữa entity và DTO

## Code Structure

```
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── commerce/
│   │   │           ├── config/         # Configuration classes
│   │   │           ├── controller/     # REST Controllers
│   │   │           ├── dto/           # Data Transfer Objects
│   │   │           ├── entity/        # JPA Entities
│   │   │           ├── repository/    # JPA Repositories
│   │   │           ├── service/       # Business Logic
│   │   │           └── security/      # Security Configuration
│   │   └── resources/
│   │       ├── application.yml       # Application Configuration
│   │       └── static/              # Static Resources
├── frontend/
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── pages/        # Page Components
│   │   ├── services/     # API Services
│   │   └── types/        # TypeScript Types
└── pom.xml               # Maven Configuration
```

## Setup Instructions

1. **Prerequisites**
   - Java 17
   - Node.js 16+
   - Maven
   - SQL Server

2. **Backend Setup**
   ```bash
   # Clone repository
   git clone https://github.com/MaLuongKhanh/spring-commerce.git
   
   # Navigate to project directory
   cd spring-commerce
   
   # Build project
    mvn clean install

   # Run application
    mvn spring-boot:run
    ```

3. **Frontend Setup**
    ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

4. **Database Setup**
   - Create SQL Server database named 'commerce'
   - Update database credentials in `application.yml`
   - Run database migrations

## API Documentation

### Authentication APIs

| URL                          | METHOD | IMAGE                                                                     | DESCRIPTION                     |
| ---------------------------- | :----: | ------------------------------------------------------------------------- | ------------------------------- |
| `/api/auth/authenticate`     |  POST  | ![image](src/main/resources/static/images/api_result/api.auth.login.png)            | Login user                      |
| `/api/auth/register`        |  POST  | ![image](src/main/resources/static/images/api_result/api.auth.register.png)        | Register new user               |
| `/api/auth/refresh-token`   |  POST  | ![image](src/main/resources/static/images/api_result/api.auth.refresh.png)         | Refresh access token            |

### Product APIs

| URL                          | METHOD | IMAGE                                                                           | DESCRIPTION                              |
| ---------------------------- | :----: | ------------------------------------------------------------------------------- | ---------------------------------------- |
| `/api/products`              |  GET   | ![image](src/main/resources/static/images/api_result/api.products.get.png)                 | Get all products                         |
| `/api/products/filter`       |  GET   | ![image](src/main/resources/static/images/api_result/api.products.filter.png)             | Filter products by criteria              |
| `/api/products`              |  POST  | ![image](src/main/resources/static/images/api_result/api.products.post.png)                | Create a new product                     |
| `/api/products/id`           |  GET   | ![image](src/main/resources/static/images/api_result/api.products.id.get.png)              | Get product by ID                        |
| `/api/products/id`           |  PUT   | ![image](src/main/resources/static/images/api_result/api.products.id.put.png)              | Update product by ID                     |
| `/api/products/id`           | DELETE | ![image](src/main/resources/static/images/api_result/api.products.id.delete.png)           | Delete product by ID                     |

### Order APIs

| URL                       | METHOD | IMAGE                                                                     | DESCRIPTION                     |
| ------------------------- | :----: | ------------------------------------------------------------------------- | ------------------------------- |
| `/api/orders`             |  GET   | ![image](src/main/resources/static/images/api_result/api.orders.get.png)             | Get all orders                  |
| `/api/orders`             |  POST  | ![image](src/main/resources/static/images/api_result/api.orders.post.png)            | Create a new order              |
| `/api/orders/id`          |  GET   | ![image](src/main/resources/static/images/api_result/api.orders.id.get.png)          | Get order by ID                 |
| `/api/orders/id/status`          |  PUT   | ![image](src/main/resources/static/images/api_result/api.orders.id.put.png)          | Update order status by ID              |
| `/api/orders/id`          | DELETE | ![image](src/main/resources/static/images/api_result/api.orders.id.delete.png)       | Delete order by ID              |

### Category APIs

| URL                    | METHOD | IMAGE                                                                     | DESCRIPTION                     |
| ---------------------- | :----: | ------------------------------------------------------------------------- | ------------------------------- |
| `/api/categories`      |  GET   | ![image](src/main/resources/static/images/api_result/api.categories.get.png)        | Get all categories              |
| `/api/categories`      |  POST  | ![image](src/main/resources/static/images/api_result/api.categories.post.png)       | Create new category             |
| `/api/categories/id`   |  GET   | ![image](src/main/resources/static/images/api_result/api.categories.id.get.png)     | Get category by ID              |
| `/api/categories/id`   |  PUT   | ![image](src/main/resources/static/images/api_result/api.categories.id.put.png)     | Update category by ID           |
| `/api/categories/id`   | DELETE | ![image](src/main/resources/static/images/api_result/api.categories.id.delete.png)  | Delete category by ID           |

### Comment APIs

| URL                          | METHOD | IMAGE                                                                     | DESCRIPTION                     |
| ---------------------------- | :----: | ------------------------------------------------------------------------- | ------------------------------- |
| `/api/comments/product/id`   |  GET   | ![image](src/main/resources/static/images/api_result/api.comments.get.png)          | Get comments for product        |
| `/api/comments/product/id/user/id` | POST | ![image](src/main/resources/static/images/api_result/api.comments.post.png) | Add comment to product          |

## Screenshots

### Authentication
- ![](src/main/resources/static/images/web_result/register.png)
- ![](src/main/resources/static/images/web_result/login.png)

### Product 
- ![](src/main/resources/static/images/web_result/homepage.png)
- ![](src/main/resources/static/images/web_result/product-detail.png)

### Shopping Cart
- ![](src/main/resources/static/images/web_result/cart.png)

### Order
- ![](src/main/resources/static/images/web_result/order.png)
- ![](src/main/resources/static/images/web_result/order-success.png)

### User Management
- ![](src/main/resources/static/images/web_result/user-management.png)
- ![](src/main/resources/static/images/web_result/orders-history.png)

### Admin Management
- ![](src/main/resources/static/images/web_result/admin-dashboard.png)
- ![](src/main/resources/static/images/web_result/admin_users.png)
- ![](src/main/resources/static/images/web_result/admin-orders.png)
- ![](src/main/resources/static/images/web_result/admin-products.png)

## Security Implementation

### Spring Security Configuration
- JWT based authentication
- Role-based authorization
- Password encryption using BCrypt
- CORS configuration
- CSRF protection

### Security Features
- User registration and login
- Role-based access control (ADMIN, USER)
- JWT token generation and validation
- Password encryption
- Session management

### Protected Endpoints
- `/api/admin/**` - Admin only access
- `/api/user/**` - Authenticated user access
- `/api/public/**` - Public access