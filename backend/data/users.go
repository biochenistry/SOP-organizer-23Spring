package data

import (
	"context"
	"database/sql"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
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

	row := db.DB.QueryRow("SELECT id, first_name, last_name FROM public.user WHERE id = $1;", id)
	if err := row.Scan(&user.ID, &user.FirstName, &user.LastName); err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.NewNotFoundError(ctx, "This user does not exist.")
		}

		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a user's information.", err)
	}

	return user, nil
}
