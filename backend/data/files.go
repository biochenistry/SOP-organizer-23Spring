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

type DriveSearchQueryResponse struct {
	Incomplete bool               `json:"incompleteSearch"`
	Files      []*DriveSearchItem `json:"files"`
}

type DriveSearchItem struct {
	Id   string `json:"id"`
	Name string `json:"name"`
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

func (s *FileService) NewSearchResultModel() *model.SearchResult {
	result := &model.SearchResult{}
	return result
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

// Gets a single file by ID
func (s *FileService) GetFileById(ctx context.Context, id string) (*model.File, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://www.googleapis.com/drive/v2/files/%s?key=%s", id, os.Getenv("GOOGLE_DRIVE_API_KEY"))
	res, err := http.Get(requestURL)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a file.", err)
	}

	// Read the response
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a file.", err)
	}

	// Parse the JSON string response into a struct
	data := &DriveFolderItem{}
	err = json.Unmarshal([]byte(resBody), &data)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving a file.", err)
	}

	// Make sure the requested resource is actually a file
	if !strings.Contains(data.Type, "document") && !strings.Contains(data.Type, "pdf") {
		return nil, errors.NewNotFoundError(ctx, "Oops! This file does not exist.")
	}

	// Map the response into a model.Folder struct
	file := s.NewFileModel()
	file.ID = data.ID
	file.Name = data.Name
	file.Created = data.Created
	file.LastUpdated = data.LastModified
	file.LastModifiedBy = data.LastModifiedBy

	return file, nil
}

func (s *FileService) SearchFiles(ctx context.Context, query string) ([]*model.SearchResult, error) {
	folders, err := s.GetAllFolders(ctx)
	if err != nil {
		return nil, err
	}

	// Replace any spaces in the query string with a '+' character (e.g. "Hello World" becomes "Hello+World")
	query = strings.Replace(query, " ", "+", -1)

	folderIds := []string{}
	// Append all root folder ids to slice
	for _, folder := range folders {
		folderIds = append(folderIds, folder.ID)
	}

	// Append all nested folder ids inside of each root folder to slice
	for _, folder := range folders {
		// Get all nested folders under this folder
		err = s.GetNestedFoldersRec(ctx, folder.ID, &folderIds)
		if err != nil {
			return nil, err
		}
	}

	fmt.Printf("Found %d folders\n", len(folderIds))

	results := []*model.SearchResult{}
	for _, id := range folderIds {
		result, err := s.SearchFolder(ctx, query, id)
		if err != nil {
			return nil, err
		}
		results = append(results, result...)
	}

	return results, nil
}

// Recursive algorithm for extracting nested folders inside of a given folder
func (s *FileService) GetNestedFoldersRec(ctx context.Context, folderId string, folderIds *[]string) error {
	folderContents, err := s.GetFolderContents(ctx, folderId)
	if err != nil {
		return err
	}

	for _, item := range folderContents {
		if folder, ok := item.(*model.Folder); ok {
			// If this is a folder, then recurse and search it to find nested folders
			err := s.GetNestedFoldersRec(ctx, folder.ID, folderIds)
			if err != nil {
				return err
			}
			*folderIds = append(*folderIds, folder.ID)
		}
	}

	return nil
}

func (s *FileService) SearchFolder(ctx context.Context, query string, folderId string) ([]*model.SearchResult, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://www.googleapis.com/drive/v3/files?q=fullText+contains+'%s'+and+trashed+%%3d+false+and+'%s'+in+parents&key=%s",
		query,
		folderId,
		os.Getenv("GOOGLE_DRIVE_API_KEY"),
	)
	res, err := http.Get(requestURL)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while searching files.", err)
	}

	// Read the response
	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while searching files.", err)
	}

	// Parse the JSON string response into a struct
	data := new(DriveSearchQueryResponse)
	err = json.Unmarshal([]byte(resBody), &data)
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while searching files.", err)
	}

	// Check if the search was incomplete; if so, an error occurred with the search request string
	if data.Incomplete {
		return nil, errors.NewInternalError(ctx, "An incomplete search was conducted", err)
	}

	results := []*model.SearchResult{}
	for _, item := range data.Files {
		// Append file to list
		result := s.NewSearchResultModel()

		result.ID = item.Id
		result.Name = item.Name

		results = append(results, result)
	}

	return results, nil
}
