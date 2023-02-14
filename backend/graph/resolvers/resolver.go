package graph

import "git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	FileService models.FileService
	UserService models.UserService
}
