package models

import (
	"context"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
)

type UserService interface {
	GetUserById(ctx context.Context, id string) (*model.User, error)
	ChangeUserPassword(ctx context.Context, id string, newPassword string) error
}
