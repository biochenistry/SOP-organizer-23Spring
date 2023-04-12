# Build the Go API
FROM golang:latest AS builder
ADD /backend /app
ADD /frontend /app/client
WORKDIR /app
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w" -a -o /main .

# Build the React application
FROM node:alpine AS node_builder
COPY --from=builder /app/client ./
RUN npm install
RUN npm run build

# Final stage build, this will be the container
# that we will deploy to production
FROM alpine:latest
# RUN apk --no-cache add ca-certificates
COPY --from=builder /main ./
COPY --from=node_builder /build ./build
RUN chmod +x ./main
EXPOSE 8080
EXPOSE 22
CMD ./main