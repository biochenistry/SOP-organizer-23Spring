package data

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strings"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
)

type FileService struct {
	Services models.Services
}

type DriveFolderQueryResponse struct {
	Items []*DriveFolderItem `json:"items"`
}

type DriveFolderItem struct {
	ID             string `json:"id"`
	Name           string `json:"title"`
	Type           string `json:"mimeType"`
	Created        string `json:"createdDate"`
	LastModified   string `json:"modifiedDate"`
	LastModifiedBy string `json:"lastModifyingUserName"`
}

// Creates a new folder struct
func (s *FileService) NewFolderModel() *model.Folder {
	folder := &model.Folder{}
	return folder
}

// Creates a new file struct
func (s *FileService) NewFileModel() *model.File {
	file := &model.File{}
	return file
}

// Gets a list of all folders in the root folder
func (s *FileService) GetAllFolders(ctx context.Context) ([]*model.Folder, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://www.googleapis.com/drive/v2/files?q=\"%s\"+in+parents&key=%s", os.Getenv("ROOT_FOLDER_ID"), os.Getenv("GOOGLE_DRIVE_API_KEY"))
	res, err := http.Get(requestURL)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving folders.", err)
	}

	// Read the response
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving folders.", err)
	}

	// Parse the JSON string response into a struct
	data := &DriveFolderQueryResponse{}
	err = json.Unmarshal([]byte(resBody), &data)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving folders.", err)
	}

	// Filter out only the folder objects, and map those to the model.Folder type
	folders := []*model.Folder{}
	for _, item := range data.Items {
		if item.Type == "application/vnd.google-apps.folder" {
			folder := s.NewFolderModel()

			folder.ID = item.ID
			folder.Name = item.Name

			folders = append(folders, folder)
		}
	}

	// Sort folders by name
	sort.SliceStable(folders, func(i, j int) bool {
		return folders[i].Name < folders[j].Name
	})

	return folders, nil
}

// Gets a list of all contents in a folder
func (s *FileService) GetFolderContents(ctx context.Context, id string) ([]model.FolderItem, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://www.googleapis.com/drive/v2/files?q=\"%s\"+in+parents&key=%s", id, os.Getenv("GOOGLE_DRIVE_API_KEY"))
	res, err := http.Get(requestURL)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder's contents.", err)
	}

	// Read the response
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder's contents.", err)
	}

	// Parse the JSON string response into a struct
	data := &DriveFolderQueryResponse{}
	err = json.Unmarshal([]byte(resBody), &data)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder's contents.", err)
	}

	// Sort data items by name
	sort.SliceStable(data.Items, func(i, j int) bool {
		return data.Items[i].Name < data.Items[j].Name
	})

	// Map items to model.Folder and model.File
	contents := []model.FolderItem{}
	for _, item := range data.Items {
		if item.Type == "application/vnd.google-apps.folder" {
			folder := s.NewFolderModel()

			folder.ID = item.ID
			folder.Name = item.Name

			contents = append(contents, folder)
		} else if strings.Contains(item.Type, "document") || strings.Contains(item.Type, "pdf") {
			file := s.NewFileModel()

			file.ID = item.ID
			file.Name = item.Name
			file.Created = item.Created
			file.LastUpdated = item.LastModified
			file.LastModifiedBy = item.LastModifiedBy

			contents = append(contents, file)
		}
	}

	return contents, nil
}

// Gets a single folder by ID
func (s *FileService) GetFolderById(ctx context.Context, id string) (*model.Folder, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://www.googleapis.com/drive/v2/files/%s?key=%s", id, os.Getenv("GOOGLE_DRIVE_API_KEY"))
	res, err := http.Get(requestURL)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder.", err)
	}

	// Read the response
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder.", err)
	}

	// Parse the JSON string response into a struct
	data := &DriveFolderItem{}
	err = json.Unmarshal([]byte(resBody), &data)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a folder.", err)
	}

	// Make sure the requested resource is actually a folder
	if data.Type != "application/vnd.google-apps.folder" {
		return nil, errors.NewNotFoundError(ctx, "Oops! This folder does not exist.")
	}

	// Map the response into a model.Folder struct
	folder := s.NewFolderModel()
	folder.ID = data.ID
	folder.Name = data.Name

	return folder, nil
}
