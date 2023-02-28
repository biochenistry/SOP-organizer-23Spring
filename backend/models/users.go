package models

import (
	"context"
	"time"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
)

type UserService interface {
	GetUserById(ctx context.Context, id string) (*model.User, error)
	ChangeUserPassword(ctx context.Context, id string, newPassword string) error

	// Verifies that the provided email and password combination is associated with a user. Returns the ID of the associated user if the login information is correct
	ValidateLogin(ctx context.Context, email string, password string) (*string, error)

	// Creates a new user session token
	CreateUserSession(ctx context.Context, userId string, expires time.Time) (*string, error)

	// Deletes all of a user's sessions
	DeleteUserSessions(ctx context.Context, userId string) error
}
