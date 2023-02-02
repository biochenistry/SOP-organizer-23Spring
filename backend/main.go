package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"log"
	"net/http"
	"os"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/generated"
	graph "git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/resolvers"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"
)

const defaultPort = "8080"

func main() {
	godotenv.Load(".env")
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	// Create database connection
	//db.InitDB()

	router := chi.NewRouter()
	//router.Use(auth.Middleware())
	//router.Use(errors.Middleware())
	//router.Use(loaders.Middleware)

	// Create services and attach to resolver
	// categoryService := &data.CategoryService{}
	// invoiceService := &data.InvoiceService{}
	// itemService := &data.ItemService{}
	// locationService := &data.LocationService{}
	// orderService := &data.OrderService{}
	// parService := &data.ParService{}
	// periodService := &data.PeriodService{}
	// vendorService := &data.VendorService{}

	// services := models.Services{
	// 	CategoryService: categoryService,
	// 	InvoiceService:  invoiceService,
	// 	ItemService:     itemService,
	// 	LocationService: locationService,
	// 	OrderService:    orderService,
	// 	ParService:      parService,
	// 	PeriodService:   periodService,
	// 	VendorService:   vendorService,
	// }

	// categoryService.Services = services
	// invoiceService.Services = services
	// itemService.Services = services
	// locationService.Services = services
	// orderService.Services = services
	// parService.Services = services
	// periodService.Services = services
	// vendorService.Services = services

	resolver := &graph.Resolver{
		// CategoryService: categoryService,
		// InvoiceService:  invoiceService,
		// ItemService:     itemService,
		// LocationService: locationService,
		// OrderService:    orderService,
		// ParService:      parService,
		// PeriodService:   periodService,
		// VendorService:   vendorService,
	}

	config := generated.Config{Resolvers: resolver}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(config))
	if os.Getenv("MODE") == "dev" {
		router.Handle("/playground", playground.Handler("SOP Schema Playground", "/"))
	}
	router.Handle("/", srv)

	log.Printf("Now listening on port :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
