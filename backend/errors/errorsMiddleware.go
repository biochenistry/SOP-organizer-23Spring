package errors

import (
	"context"
	"net/http"
)

var requestCtxKey = &contextKey{"request"}

type contextKey struct {
	name string
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Add request data to request context
			ctx := context.WithValue(r.Context(), requestCtxKey, r)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// GetRequestFromContext finds the request from the context. REQUIRES Middleware to have already run.
func GetRequestFromContext(ctx context.Context) *http.Request {
	r, _ := ctx.Value(requestCtxKey).(*http.Request)
	return r
}
