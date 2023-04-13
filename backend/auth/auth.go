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
var requestCtxKey = &contextKey{"request"}

type contextKey struct {
	name string
}

type AuthUser struct {
	ID         string
	FirstName  string
	LastName   string
	Username   string
	IsInactive bool
	IsAdmin    bool
}

func newUserModel() *AuthUser {
	user := &AuthUser{}
	return user
}

type Request struct {
	ResponseWriter http.ResponseWriter
}

func (r *Request) SetAuthToken(token string, expires time.Time) {
	http.SetCookie(r.ResponseWriter, &http.Cookie{
		Name:     "sop_auth",
		Value:    token,
		HttpOnly: true,
		Secure:   false,
		Path:     "/",
		Expires:  time.Now().Add(time.Hour * 24 * 30),
	})
}

func (r *Request) ClearAuthToken() {
	expires, _ := time.Parse("Jan 2, 2006", "Jan 1, 1970")

	http.SetCookie(r.ResponseWriter, &http.Cookie{
		Name:     "sop_auth",
		Value:    "",
		HttpOnly: true,
		Secure:   false,
		Path:     "/",
		Expires:  expires,
	})
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
				row := db.DB.QueryRow("SELECT u.id, u.first_name, u.last_name, u.username, u.is_disabled, u.is_admin FROM user_session s INNER JOIN public.user u ON u.id = s.user_id WHERE s.session_token = $1 AND s.expires >= $2 AND u.is_disabled = false;", authToken.Value, time.Now().UTC())
				if err := row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Username, &user.IsInactive, &user.IsAdmin); err != nil {
					if err == sql.ErrNoRows {
						// The auth token was invalid or expired
						user = nil
					} else {
						log.Error(errors.New("unexpected error while looking up user auth token"))
					}
				}
			}

			// Add response writer to context
			request := &Request{
				ResponseWriter: w,
			}
			ctx := context.WithValue(r.Context(), requestCtxKey, request)

			// Add user to request context
			ctx = context.WithValue(ctx, userCtxKey, user)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// Sets a user's auth token in the response headers
func GetRequestFromContext(ctx context.Context) *Request {
	request, _ := ctx.Value(requestCtxKey).(*Request)
	return request
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
