package models

import (
	"context"
	"time"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
)

type UserService interface {
	// Gets a user by id
	GetUserById(ctx context.Context, id string) (*model.User, error)

	// Get all users
	GetAllUsers(ctx context.Context) ([]*model.User, error)

	// Create a new user account
	CreateUser(ctx context.Context, firstname string, lastname string, username string, password string, admin bool) (*string, error)

	// Updates an existing user account
	UpdateUser(ctx context.Context, id string, firstname string, lastname string) error

	// Deletes an existing user account
	DeleteUser(ctx context.Context, id string) error

	// Change's amn existing users role
	ChangeUserRole(ctx context.Context, id string, admin bool) error

	// Change's an existing users password
	ChangeUserPassword(ctx context.Context, id string, newPassword string) error

	// Verifies that the provided username and password combination is associated with a user. Returns the ID of the associated user if the login information is correct
	ValidateLogin(ctx context.Context, username string, password string) (*string, error)

	// Creates a new user session token
	CreateUserSession(ctx context.Context, userId string, expires time.Time) (*string, error)

	// Deletes all of a user's sessions
	DeleteUserSessions(ctx context.Context, userId string) error
}
