package main

//go:generate go run github.com/99designs/gqlgen generate

import (
	"log"
	"net/http"
	"os"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/data"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/generated"
	graph "git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/resolvers"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
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
	db.InitDB()

	router := chi.NewRouter()
	//router.Use(auth.Middleware())
	router.Use(errors.Middleware())
	//router.Use(loaders.Middleware)

	// Create services
	userService := &data.UserService{}

	services := models.Services{
		UserService: userService,
	}

	// Nest services so they can access each other
	userService.Services = services

	// Attach services to resolvers
	resolver := &graph.Resolver{
		UserService: userService,
	}

	config := generated.Config{Resolvers: resolver}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(config))
	if os.Getenv("MODE") == "dev" || true {
		router.Handle("/playground", playground.Handler("SOP Schema Playground", "/api"))
	}
	router.Handle("/api", srv)

	// Serve React application
	router.Handle("/static/*", http.FileServer(http.Dir("./build")))
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})

	log.Printf("Now listening on port :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
