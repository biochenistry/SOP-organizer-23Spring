package auth

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"time"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"github.com/opentracing/opentracing-go/log"
)

var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

type AuthUser struct {
	ID         string
	FirstName  string
	LastName   string
	Email      string
	IsInactive bool
	IsAdmin    bool
}

func newUserModel() *AuthUser {
	user := &AuthUser{}
	return user
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authToken, err := r.Cookie("sop_auth")

			user := newUserModel()

			if err != nil || authToken == nil {
				// Don't set the user for unauthenticated users
				user = nil
			} else {
				row := db.DB.QueryRow("SELECT u.id, u.first_name, u.last_name, u.email, u.is_disabled, u.is_admin FROM user_session s INNER JOIN public.user u ON u.id = s.user_id WHERE s.session_token = $1 AND s.expires >= $2 AND u.is_disabled = false;", authToken.Value, time.Now().UTC())
				if err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.IsInactive, &user.IsAdmin); err != nil {
					if err == sql.ErrNoRows {
						// The auth token was invalid or expired
						user = nil
					} else {
						log.Error(errors.New("unexpected error while looking up user auth token"))
					}
				}
			}

			// Add user to request context
			ctx := context.WithValue(r.Context(), userCtxKey, user)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// GetUserFromContext finds the user from the context. REQUIRES Middleware to have already run.
func GetUserFromContext(ctx context.Context) *AuthUser {
	user, _ := ctx.Value(userCtxKey).(*AuthUser)
	return user
}

// IsAdmin determines if the provided user is an admin user. You should use this instead of directly checking the IsAdmin property.
func IsAdmin(user *AuthUser) bool {
	if user == nil || user.IsInactive {
		return false
	}

	return user.IsAdmin
}
