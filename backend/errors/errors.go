package errors

import (
	"context"
	"fmt"

	"github.com/99designs/gqlgen/graphql"
	"github.com/pkg/errors"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type stackTracer interface {
	StackTrace() errors.StackTrace
}

type causer interface {
	Cause() error
}

// Creates and logs a new internal error
func NewInternalError(ctx context.Context, publicMessage string, err error) *gqlerror.Error {
	internalError := errors.WithStack(err) // Wraps the passed in error so a stack trace can be added
	callStack := fmt.Sprintf("%v\n%v", internalError.(causer).Cause(), internalError.(stackTracer).StackTrace())

	logError(publicMessage, callStack)

	return &gqlerror.Error{
		Path:    graphql.GetPath(ctx),
		Message: publicMessage,
		Extensions: map[string]interface{}{
			"status": 500,
		},
	}
}

// Creates a new not found error
func NewNotFoundError(ctx context.Context, message string) *gqlerror.Error {
	return &gqlerror.Error{
		Path:    graphql.GetPath(ctx),
		Message: message,
		Extensions: map[string]interface{}{
			"status": 404,
		},
	}
}

// Create a new forbidden error
func NewForbiddenError(ctx context.Context, message string) *gqlerror.Error {
	return &gqlerror.Error{
		Path:    graphql.GetPath(ctx),
		Message: message,
		Extensions: map[string]interface{}{
			"status": 403,
		},
	}
}

// Create a new unauthorized error
func NewUnauthorizedError(ctx context.Context, message string) *gqlerror.Error {
	return &gqlerror.Error{
		Path:    graphql.GetPath(ctx),
		Message: message,
		Extensions: map[string]interface{}{
			"status": 401,
		},
	}
}

// Create a new input error to indicate the user supplied bad input
func NewInputError(ctx context.Context, message string) *gqlerror.Error {
	return &gqlerror.Error{
		Path:    graphql.GetPath(ctx),
		Message: message,
		Extensions: map[string]interface{}{
			"status": 400,
		},
	}
}

// Logs an error in the database (prod mode) or to the console (dev mode)
func logError(publicMessage string, callStack string) {
	fmt.Printf("%s\n%v", publicMessage, callStack)
}
