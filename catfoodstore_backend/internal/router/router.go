package router

import (
    "database/sql"
    "net/http"

    "catfoodstore_backend/internal/handler"
    "catfoodstore_backend/internal/middleware"
    "catfoodstore_backend/internal/repository"
    "catfoodstore_backend/internal/service"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

func New(db *sql.DB) *gin.Engine {
    // ⭐ ใช้ Default() → มี Logger + Recovery ให้ครบ
    r := gin.Default()

    // ⭐⭐⭐ CORS สำหรับ React และ Nginx ⭐⭐⭐
    r.Use(cors.New(cors.Config{
        AllowOrigins: []string{
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost",    // Nginx
            "http://127.0.0.1",
        },
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        AllowCredentials: true,
    }))

    // -------------------------------
    // HEALTH CHECK
    // -------------------------------
    r.GET("/health", func(c *gin.Context) {
        if err := db.Ping(); err != nil {
            c.JSON(http.StatusServiceUnavailable, gin.H{"status": "unhealthy"})
            return
        }
        c.JSON(200, gin.H{"status": "ok"})
    })

    // -------------------------------
    // PRODUCT MODULE (PUBLIC)
    // -------------------------------
    productRepo := repository.NewProductRepository(db)
    productService := service.NewProductService(productRepo)
    productHandler := handler.NewProductHandler(productService)
    productHandler.RegisterRoutes(r) // → /api/products

    // -------------------------------
    // USER MODULE (REGISTER + LOGIN)
    // -------------------------------
    userRepo := repository.NewUserRepository(db)
    userService := service.NewUserService(userRepo)
    userHandler := handler.NewUserHandler(userService)
    userHandler.RegisterRoutes(r)

    // -------------------------------
    // ADMIN ROUTES
    // -------------------------------
    admin := r.Group("/api/admin")
    admin.Use(middleware.AuthMiddleware, middleware.AdminOnly)

    // Admin CRUD
    admin.POST("/products", productHandler.Create)
    admin.PUT("/products/:id", productHandler.Update)
    admin.DELETE("/products/:id", productHandler.Delete)

    return r
}
