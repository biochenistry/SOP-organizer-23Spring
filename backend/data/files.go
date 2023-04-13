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
	"time"

	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/db"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/errors"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/graph/model"
	"git.las.iastate.edu/SeniorDesignComS/2023spr/sop/models"
	strip "github.com/grokify/html-strip-tags-go"
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
		} else if strings.Contains(item.Type, "document") {
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

func (s *FileService) SearchFiles(ctx context.Context, query string) ([]*model.File, error) {
	files, err := s.getAllFiles(ctx)
	if err != nil {
		return nil, err
	}

	cachedFiles, err := s.getCachedFiles(ctx)
	if err != nil {
		return nil, err
	}

	// Make sure every file in the drive root folder has an updated cache
	for _, file := range files {
		fileLastUpdatedUTC, err := time.Parse("2006-01-02T15:04:05.000Z", file.LastUpdated)
		if err != nil {
			return nil, err
		}

		if cachedFiles[file.ID] == nil {
			contents, err := s.getFileContents(ctx, file.ID)
			if err != nil {
				return nil, err
			}

			strippedContent := strip.StripTags(*contents)
			strippedContent = strings.ReplaceAll(strippedContent, "&nbsp;", "")

			s.saveFileCache(ctx, file.ID, file.Name, &strippedContent)
		} else {
			cacheLastUpdatedUTC, err := time.Parse(time.RFC3339Nano, cachedFiles[file.ID].LastUpdated)
			if err != nil {
				return nil, err
			}

			if fileLastUpdatedUTC.After(cacheLastUpdatedUTC) {
				contents, err := s.getFileContents(ctx, file.ID)
				if err != nil {
					return nil, err
				}

				strippedContent := strip.StripTags(*contents)
				strippedContent = strings.ReplaceAll(strippedContent, "&nbsp;", "")

				s.saveFileCache(ctx, file.ID, file.Name, &strippedContent)
			}
		}
	}

	// Search the cache for the query
	foundFileIDs, err := s.searchFileCache(ctx, query)
	if err != nil {
		return nil, err
	}

	// Map the found file IDs to the actual file objects
	foundFiles := []*model.File{}
	for _, foundFileID := range foundFileIDs {
		for _, file := range files {
			if file.ID == *foundFileID {
				foundFiles = append(foundFiles, file)
			}
		}
	}

	return foundFiles, nil
}

// Gets all files in a Drive folder, including files in nested folders
func (s *FileService) getAllFiles(ctx context.Context) ([]*model.File, error) {
	rootFolders, err := s.GetAllFolders(ctx)
	if err != nil {
		return nil, err
	}

	files := []*model.File{}

	for _, folder := range rootFolders {
		nestedFiles, err := s.getFilesInFolderRec(ctx, folder.ID)
		if err != nil {
			return nil, err
		}

		files = append(files, nestedFiles...)
	}

	return files, nil
}

// Gets all files in a Drive folder, including files in nested folders. You should call getAllFiles instead of this function.
func (s *FileService) getFilesInFolderRec(ctx context.Context, folderId string) ([]*model.File, error) {
	files := []*model.File{}

	// Get all files in this folder
	folderItems, err := s.GetFolderContents(ctx, folderId)
	if err != nil {
		return nil, err
	}

	// Append all files in this folder to the slice. If the item is a folder, recursively call this function
	for _, item := range folderItems {
		if file, ok := item.(*model.File); ok {
			files = append(files, file)
		} else if folder, ok := item.(*model.Folder); ok {
			nestedFiles, err := s.getFilesInFolderRec(ctx, folder.ID)
			if err != nil {
				return nil, err
			}

			files = append(files, nestedFiles...)
		}
	}

	return files, nil
}

// Gets all files that are cached in the database
func (s *FileService) getCachedFiles(ctx context.Context) (map[string]*model.File, error) {
	rows, err := db.DB.Query("SELECT id, title, snapshot_timestamp FROM file;")
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving cached files.", err)
	}

	files := map[string]*model.File{}

	for rows.Next() {
		file := &model.File{}
		if err := rows.Scan(&file.ID, &file.Name, &file.LastUpdated); err != nil {
			return nil, errors.NewInternalError(ctx, "An unexpected error occurred while retrieving cached files.", err)
		}

		files[file.ID] = file
	}

	return files, nil
}

// Saves the text content of a file to the database
func (s *FileService) saveFileCache(ctx context.Context, id string, title string, contents *string) error {
	if contents == nil {
		return errors.NewInputError(ctx, "File contents cannot be nil.")
	}

	tx, err := db.DB.BeginTx(ctx, nil)
	if err != nil {
		return errors.NewInternalError(ctx, "An unexpected error occurred while saving a file.", err)
	}

	// Delete the existing file cache, if there is one
	_, err = tx.Exec("DELETE FROM file WHERE id = $1;", id)
	if err != nil {
		tx.Rollback()
		return errors.NewInternalError(ctx, "An unexpected error occurred while saving a file.", err)
	}

	// Insert the new file cache
	_, err = tx.Exec("INSERT INTO file (id, title, contents, snapshot_timestamp) VALUES ($1, $2, $3, $4);", id, title, *contents, time.Now().UTC())
	if err != nil {
		tx.Rollback()
		return errors.NewInternalError(ctx, "An unexpected error occurred while saving a file.", err)
	}

	err = tx.Commit()
	if err != nil {
		tx.Rollback()
		return errors.NewInternalError(ctx, "An unexpected error occurred while saving a file.", err)
	}

	return nil
}

// Gets the text content of a file
func (s *FileService) getFileContents(ctx context.Context, id string) (*string, error) {
	// Make a request to Google Drive API to get all items in the root folder
	requestURL := fmt.Sprintf("https://docs.google.com/document/d/%s/export", id)
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
	contents := string(resBody)

	return &contents, nil
}

// Searches all files in the cache for files that have a matching title or contents. Returns an array with the IDs of every file that matches the query.
func (s *FileService) searchFileCache(ctx context.Context, query string) ([]*string, error) {
	rows, err := db.DB.Query("SELECT id FROM file WHERE title ILIKE $1 OR contents ILIKE $1;", "%"+query+"%")
	if err != nil {
		return nil, errors.NewInternalError(ctx, "An unexpected error occurred while searching for files.", err)
	}

	fileIDs := []*string{}

	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, errors.NewInternalError(ctx, "An unexpected error occurred while searching for files.", err)
		}

		fileIDs = append(fileIDs, &id)
	}

	return fileIDs, nil
}
