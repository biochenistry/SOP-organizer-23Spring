package data

import (
	"context"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
)

type UserService struct {
	Services models.Services
}

func (s *UserService) GetUserById(ctx context.Context, id string) (*model.User, error) {
	// TODO - Complete implementation
	return &model.User{
		ID:        "1234",
		FirstName: "Test",
		LastName:  "User",
	}, nil
}
