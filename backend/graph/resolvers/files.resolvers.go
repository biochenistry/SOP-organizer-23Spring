package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/generated"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
)

// Contents is the resolver for the contents field.
func (r *folderResolver) Contents(ctx context.Context, obj *model.Folder) ([]model.FolderItem, error) {
	contents, err := r.FileService.GetFolderContents(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	return contents, nil
}

// Folders is the resolver for the folders field.
func (r *queryResolver) Folders(ctx context.Context) ([]*model.Folder, error) {
	folders, err := r.FileService.GetAllFolders(ctx)
	if err != nil {
		return nil, err
	}

	return folders, nil
}

// Folder is the resolver for the folder field.
func (r *queryResolver) Folder(ctx context.Context, id string) (*model.Folder, error) {
	folder, err := r.FileService.GetFolderById(ctx, id)
	if err != nil {
		return nil, err
	}

	return folder, nil
}

// File is the resolver for the file field.
func (r *queryResolver) File(ctx context.Context, id string) (*model.File, error) {
	file, err := r.FileService.GetFileById(ctx, id)
	if err != nil {
		return nil, err
	}

	return file, nil
}

// Search is the resolver for the search field.
func (r *queryResolver) Search(ctx context.Context, query string) ([]*model.SearchResult, error) {
	results, err := r.FileService.SearchFiles(ctx, query)
	if err != nil {
		return nil, err
	}

	return results, nil
}

// Folder returns generated.FolderResolver implementation.
func (r *Resolver) Folder() generated.FolderResolver { return &folderResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type folderResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
