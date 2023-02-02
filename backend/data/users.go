package data

import (
	"context"
	"database/sql"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	Services models.Services
}

func (s *UserService) NewUserModel() *model.User {
	user := &model.User{}

	return user
}

func (s *UserService) GetUserById(ctx context.Context, id string) (*model.User, error) {
	user := s.NewUserModel()

	row := db.DB.QueryRow("SELECT id, first_name, last_name, email, is_disabled, is_admin FROM public.user WHERE id = $1;", id)
	if err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.IsDisabled, &user.IsAdmin); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.NewNotFoundError(ctx, "This user does not exist.")
		}

		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a user's information.", err)
	}

	return user, nil
}

func (s *UserService) ChangeUserPassword(ctx context.Context, id string, newPassword string) error {
	// Create a new password hash
	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while changing a user's password.", err)
	}
	_, err = db.DB.Exec("UPDATE public.user SET password_hash = $2 WHERE id = $1;", id, hash)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while changing a user's password.", err)
	}

	return nil
}
