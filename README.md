# SpringCommerce Application

A simple MVP (Minimum Viable Product) online shopping application built with Java Spring Boot.

## Principles, Patterns, and Practices

*   **RESTful APIs:** The application follows REST principles for designing the web services, providing a standard way to interact with resources (products, categories, orders, etc.).
*   **Layered Architecture:** The code is structured into distinct layers (Controller, Service, Repository) to promote separation of concerns, maintainability, and testability.
*   **Dependency Injection (DI):** Spring's DI framework is used to manage dependencies between components, making the code loosely coupled and easier to test.
*   **DTO Pattern:** Data Transfer Objects (DTOs) are used to transfer data between layers (especially between Controller and Service), preventing the exposure of internal entity structures and providing tailored data views for the API.
*   **JPA (Java Persistence API):** Used for object-relational mapping (ORM) to interact with the database, simplifying data persistence operations.
*   **Spring Data JPA:** Simplifies the implementation of JPA-based repositories by providing standard CRUD operations and query generation capabilities.
*   **Spring Security:** Provides authentication and authorization mechanisms to secure the application's API endpoints using JWT (JSON Web Tokens).
*   **Validation:** Bean Validation (JSR 380) is used to validate input data in DTOs and entities.
*   **Exception Handling:** Custom exception classes (e.g., `ResourceNotFoundException`) and global exception handling mechanisms can be implemented to manage errors gracefully.
*   **Unit Testing:** JUnit and Mockito are used for writing unit tests to ensure the correctness of individual components (services, controllers).

## Code Structure

The project follows a standard Maven project structure:

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── example
│   │           └── demo
│   │               ├── config          # Spring configuration (Security, JWT)
│   │               ├── controller      # REST API controllers
│   │               ├── dto             # Data Transfer Objects
│   │               ├── exception       # Custom exception classes
│   │               ├── model           # JPA entities and enums
│   │               ├── repository      # Spring Data JPA repositories
│   │               ├── service         # Business logic services
│   │               └── DemoApplication.java # Main application class
│   └── resources
│       ├── application.properties # Application configuration
│       └── init.sql               # Database initialization script (if using Docker)
└── test
    └── java
        └── com
            └── example
                └── demo
                    ├── controller      # Controller tests
                    └── service         # Service tests

pom.xml         # Maven project configuration
README.md       # This file
docker-compose.yml # Docker configuration (if applicable)
init.sql        # Database initialization script (if applicable)
```

## Running Locally

1.  **Prerequisites:**
    *   Java JDK 17 or later
    *   Maven 3.6 or later
    *   (Optional) Docker and Docker Compose (if you want to use the provided MSSQL setup)

2.  **Configuration:**
    *   **Database:** The application is currently configured to use an in-memory H2 database. The connection details are in `src/main/resources/application.properties`.
    *   **JWT Secret:** Update the `jwt.secret` property in `src/main/resources/application.properties` with a strong, unique secret key.

3.  **Build the Application:**
    ```bash
    mvn clean install
    ```

4.  **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```
    Alternatively, you can run the packaged JAR file:
    ```bash
    java -jar target/demo-0.0.1-SNAPSHOT.jar
    ```

5.  **Access the Application:**
    *   The application will be running at `http://localhost:8080`.
    *   The H2 database console (if enabled) is available at `http://localhost:8080/h2-console` (use `jdbc:h2:mem:springcommerce_db` as the JDBC URL, `sa` as username, and leave the password empty).

## API Verification (CURL Examples)

**Note:** You need a JWT token for authenticated endpoints. Obtain one using the `/api/auth/authenticate` endpoint after registering a user.

**1. Register a new user:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

**2. Authenticate and get JWT token:**

```bash
curl -X POST http://localhost:8080/api/auth/authenticate \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "password123"
}'
```
*   This will return a JSON response like `{"token":"your_jwt_token"}`. Copy the token.

**3. Get all products (requires authentication):**
   Replace `YOUR_JWT_TOKEN` with the actual token obtained in the previous step.

```bash
curl -X GET http://localhost:8080/api/products \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**4. Get a specific product by ID (requires authentication):**

```bash
curl -X GET http://localhost:8080/api/products/1 \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**5. Create a new category (requires authentication):**

```bash
curl -X POST http://localhost:8080/api/categories \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "Books"
}'
```

**6. Create a new product (requires authentication):**

```bash
curl -X POST http://localhost:8080/api/products \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "Spring in Action",
  "description": "A comprehensive guide to Spring",
  "price": 45.99,
  "brand": "Manning",
  "color": "N/A",
  "categoryId": 4 
}'
```
*(Assuming the "Books" category created in the previous step has ID 4)*

**7. Filter products (requires authentication):**

```bash
curl -X GET "http://localhost:8080/api/products/filter?categoryName=Electronics&brand=Dell&minPrice=1000" \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**8. Add item to shopping cart (requires authentication):**
   *(Assuming a shopping cart with ID 1 exists)*

```bash
curl -X POST http://localhost:8080/api/shopping-carts/1/items \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "productId": 1,
  "quantity": 2
}'
```

**9. Place an order (requires authentication):**

```bash
curl -X POST http://localhost:8080/api/orders \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "customerName": "Jane Doe",
  "shippingAddress": "123 Main St, Anytown, USA",
  "status": "PENDING",
  "orderItems": [
    {
      "productId": 1,
      "quantity": 1
    },
    {
      "productId": 2,
      "quantity": 3
    }
  ]
}'
```

**Note:** These are basic examples. You can use tools like Postman for a more user-friendly way to interact with the APIs.