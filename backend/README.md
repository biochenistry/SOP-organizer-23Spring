### Running Locally


### Manually deploying to ISU server
Build the application for Linux AMD64 using `GOOS=linux GOARCH=amd64 go build`.

Transfer the binary file to the remote server.

Make the file executable: `sudo chmod +x sop`

Run the application: `./sop`

To transfer the application to a background process: Ctr+Z, then enter `bg`

### Go beginners

The basics of Go and how the files are generated for reference: https://gqlgen.com/

### Organization

In ./graph/schema are the graphqls files, which contain the GraphQL schema definitions. Use `go generate` after updating these files to regenerate the resolver functions.

The logic for mutations/queries is located in ./data/files.go and ./data/users.go

The files in ./graph/resolvers and ./graph/generated are automatically generated

### Run backend

Navigate in terminal to backend folder.

`go run main.go` will run the app on the backend.

Navigate in your browser to localhost:8080/playground for testing queries/mutations.