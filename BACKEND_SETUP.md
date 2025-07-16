# Java Backend Setup for Employee Portal

## Overview
This document provides essential setup instructions for creating a Java backend to support the Employee Portal Progressive Web Application.

## Tech Stack Recommendation
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + Microsoft Azure AD
- **Database**: PostgreSQL or MySQL
- **File Storage**: AWS S3 or Azure Blob Storage
- **API Documentation**: OpenAPI 3.0 (Swagger)
- **Build Tool**: Maven or Gradle

## Required Dependencies

### Spring Boot Dependencies (Maven)

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- Database Driver (PostgreSQL) -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Microsoft Azure AD Spring Boot Starter -->
    <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-starter-active-directory</artifactId>
    </dependency>
    
    <!-- File Upload Support -->
    <dependency>
        <groupId>commons-fileupload</groupId>
        <artifactId>commons-fileupload</artifactId>
        <version>1.4</version>
    </dependency>
    
    <!-- AWS S3 SDK (for file storage) -->
    <dependency>
        <groupId>software.amazon.awssdk</groupId>
        <artifactId>s3</artifactId>
    </dependency>
    
    <!-- OpenAPI Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.0.2</version>
    </dependency>
</dependencies>
```

## Application Configuration

### application.yml

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  application:
    name: employee-portal-api
  
  datasource:
    url: jdbc:postgresql://localhost:5432/employee_portal
    username: ${DB_USERNAME:portal_user}
    password: ${DB_PASSWORD:portal_password}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
  
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
  
  # Azure AD Configuration
  cloud:
    azure:
      active-directory:
        enabled: true
        tenant-id: ${AZURE_TENANT_ID}
        client-id: ${AZURE_CLIENT_ID}
        client-secret: ${AZURE_CLIENT_SECRET}
        user-group:
          allowed-groups: ${AZURE_ALLOWED_GROUPS:}

# AWS S3 Configuration
aws:
  s3:
    bucket: ${AWS_S3_BUCKET:employee-portal-files}
    region: ${AWS_REGION:us-east-1}
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}

# CORS Configuration
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:http://localhost:3000,https://yourdomain.com}
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true

# JWT Configuration
jwt:
  secret: ${JWT_SECRET:your-secret-key-here}
  expiration: 86400000 # 24 hours
```

## Core Entity Models

### User Entity
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String name;
    
    private String department;
    private String jobTitle;
    private String avatarUrl;
    private String microsoftId;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    private List<Post> posts;
    
    // Constructors, getters, setters
}
```

### Post Entity
```java
@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<PostLike> likes;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> comments;
    
    // Constructors, getters, setters
}
```

## Essential REST API Endpoints

### Authentication Controller
```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Microsoft SSO integration logic
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        // Token refresh logic
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        // Logout logic
    }
}
```

### Post Controller
```java
@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class PostController {
    
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
        // Get paginated posts
    }
    
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody CreatePostRequest request) {
        // Create new post
    }
    
    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long postId) {
        // Like/unlike post
    }
    
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
        @PathVariable Long postId, 
        @RequestBody CreateCommentRequest request) {
        // Add comment to post
    }
}
```

### File Upload Controller
```java
@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class FileController {
    
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
        @RequestParam("file") MultipartFile file) {
        // Upload file to S3/Azure Blob
    }
    
    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable String fileId) {
        // Delete file from storage
    }
}
```

## Security Configuration

### Azure AD Security Config
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .cors().configurationSource(corsConfigurationSource())
            .and()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Database Schema (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255),
    job_title VARCHAR(255),
    avatar_url VARCHAR(500),
    microsoft_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    image_url VARCHAR(500),
    author_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Post likes table
CREATE TABLE post_likes (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT REFERENCES posts(id),
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id)
);

-- Comments table
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id BIGINT REFERENCES posts(id),
    author_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Microsoft Azure AD Setup

### 1. Register Application in Azure Portal
1. Go to Azure Active Directory → App registrations
2. Create new registration:
   - Name: Employee Portal API
   - Supported account types: Accounts in this organizational directory only
   - Redirect URI: http://localhost:8080/login/oauth2/code/azure

### 2. Configure API Permissions
- Microsoft Graph → User.Read
- Microsoft Graph → Group.Read.All (if using group-based access)

### 3. Generate Client Secret
- Go to Certificates & secrets → New client secret
- Copy the secret value (store securely)

### 4. Configure Authentication
- Add redirect URIs for production environment
- Enable ID tokens and access tokens

## Environment Variables

Create a `.env` file or configure these in your deployment environment:

```bash
# Database
DB_USERNAME=portal_user
DB_PASSWORD=your_db_password

# Azure AD
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# AWS S3
AWS_S3_BUCKET=employee-portal-files
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your-access-key
AWS_SECRET_KEY=your-secret-key

# Security
JWT_SECRET=your-jwt-secret-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Deployment Considerations

### 1. Docker Configuration
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/employee-portal-api-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 2. Production Checklist
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up database connection pooling
- [ ] Configure logging (Logback/SLF4J)
- [ ] Set up monitoring (Actuator endpoints)
- [ ] Configure rate limiting
- [ ] Set up backup strategy for database
- [ ] Configure file storage CDN
- [ ] Set up CI/CD pipeline

## Testing

### 1. Unit Tests
```java
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PostServiceTest {
    
    @MockBean
    private PostRepository postRepository;
    
    @Autowired
    private PostService postService;
    
    @Test
    void shouldCreatePost() {
        // Test implementation
    }
}
```

### 2. Integration Tests
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class PostControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateAndRetrievePost() {
        // Integration test implementation
    }
}
```

## Next Steps

1. **Set up Azure AD Application** - Follow the Azure AD setup section
2. **Create Database** - Set up PostgreSQL database with the provided schema
3. **Configure Environment Variables** - Set all required environment variables
4. **Implement Services** - Create service layers for business logic
5. **Add Validation** - Implement request validation and error handling
6. **Set up File Storage** - Configure AWS S3 or Azure Blob Storage
7. **Add Monitoring** - Implement logging and monitoring
8. **Write Tests** - Create comprehensive unit and integration tests
9. **Deploy** - Deploy to your chosen environment

This setup provides a solid foundation for your Employee Portal backend with Microsoft SSO integration, file upload capabilities, and a RESTful API structure.