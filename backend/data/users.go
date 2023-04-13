package data

import (
	"context"
	"database/sql"
	"time"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	Services models.Services
}

func (s *UserService) NewUserModel() *model.User {
	user := &model.User{}

	return user
}

// Creates a new user account in the database
func (s *UserService) CreateUser(ctx context.Context, firstname string, lastname string, username string, password string, admin bool) (*string, error) {
	// Generate a new user id
	id := uuid.NewString()
	// Create a new password hash
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while creating new user account.", err)
	}
	// Create new user account in db
	_, err = db.DB.Exec("INSERT INTO public.user (id, first_name, last_name, username, password_hash, is_admin, force_password_change) VALUES ($1, $2, $3, $4, $5, $6, $7)",
		id,
		firstname,
		lastname,
		username,
		hash,
		admin,
		true,
	)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while creating new user account.", err)
	}

	return &id, nil
}

// Updates a users account in the database
func (s *UserService) UpdateUser(ctx context.Context, id string, firstname string, lastname string) error {
	// User exists, update user information
	_, err := db.DB.Exec("UPDATE public.user SET first_name = $2, last_name = $3 WHERE id = $1",
		id,
		firstname,
		lastname,
	)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error has occurred while updating user account.", err)
	}

	return nil
}

func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	_, err := db.DB.Exec("DELETE FROM public.user WHERE id = $1;", id)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while deleting user account.", err)
	}

	return nil
}

// Get's all users from the database
func (s *UserService) GetAllUsers(ctx context.Context) ([]*model.User, error) {
	users := []*model.User{}
	// Get all users from table
	rows, err := db.DB.Query("SELECT id, first_name, last_name, username, is_disabled, is_admin, force_password_change FROM public.user")
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving all users", err)
	}

	for rows.Next() {
		user := s.NewUserModel()
		// scan row data into user model
		if err := rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.IsDisabled, &user.IsAdmin, &user.ShouldForcePasswordChange); err != nil {
			return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a user's information", err)
		}
		// add user to list
		users = append(users, user)
	}

	return users, nil
}

func (s *UserService) GetUserById(ctx context.Context, id string) (*model.User, error) {
	user := s.NewUserModel()

	row := db.DB.QueryRow("SELECT id, first_name, last_name, username, is_disabled, is_admin, force_password_change FROM public.user WHERE id = $1;", id)
	if err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.IsDisabled, &user.IsAdmin, &user.ShouldForcePasswordChange); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.NewNotFoundError(ctx, "This user does not exist.")
		}

		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a user's information.", err)
	}

	return user, nil
}

// Changes a users role
func (s *UserService) ChangeUserRole(ctx context.Context, id string, admin bool) error {
	_, err := s.GetUserById(ctx, id)
	if err != nil {
		return err
	}

	_, err = db.DB.Exec("UPDATE public.user SET is_admin = $2 WHERE id = $1", id, admin)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while updating user role", err)
	}

	return nil
}

func (s *UserService) ChangeUserPassword(ctx context.Context, id string, newPassword string) error {
	// Create a new password hash
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while changing a user's password.", err)
	}
	_, err = db.DB.Exec("UPDATE public.user SET password_hash = $2, force_password_change = $3 WHERE id = $1;", id, hash, false)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while changing a user's password.", err)
	}

	return nil
}

// Verifies that the provided username and password combination is associated with a user. Returns the ID of the associated user if the login information is correct
func (s *UserService) ValidateLogin(ctx context.Context, username string, password string) (*string, error) {
	// Lookup the user by their username
	row := db.DB.QueryRow("SELECT id, password_hash, is_disabled FROM public.user WHERE username = $1;", username)

	var id string
	var passwordHash string
	var isDisabled bool
	if err := row.Scan(&id, &passwordHash, &isDisabled); err != nil {
		if err == sql.ErrNoRows {
			// The user does not exist
			return nil, errors.NewUnauthorizedError(ctx, "Invalid username or password")
		}
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while logging you in.", err)
	}

	// Make sure the password they provided is correct
	err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(password))
	if err != nil {
		// Password was invalid
		return nil, errors.NewUnauthorizedError(ctx, "Incorrect username or password")
	}

	// If the login info was correct, make sure the account is not disabled
	if isDisabled {
		return nil, errors.NewForbiddenError(ctx, "Your account has been disabled.")
	}

	return &id, nil
}

// Creates a new user session token that expires on the given local time
func (s *UserService) CreateUserSession(ctx context.Context, userId string, expires time.Time) (*string, error) {
	token := uuid.NewString()

	_, err := db.DB.Exec("INSERT INTO user_session (session_token, user_id, expires) VALUES ($1, $2, $3);", token, userId, expires.UTC())
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while logging you in.", err)
	}

	return &token, nil
}

// Deletes all of a user's sessions
func (s *UserService) DeleteUserSessions(ctx context.Context, userId string) error {
	_, err := db.DB.Exec("DELETE FROM user_session WHERE user_id = $1;", userId)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while logging you out.", err)
	}

	return nil
}
