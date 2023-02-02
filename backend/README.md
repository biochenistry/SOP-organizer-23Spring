### Running Locally


### Manually deploying to ISU server
Build the application for Linux AMD64 using `GOOS=linux GOARCH=amd64 go build`.

Transfer the binary file to the remote server.

Make the file executable: `sudo chmod +x sop`

Run the application: `./sop`