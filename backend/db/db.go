package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v4/stdlib"
	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	if os.Getenv("MODE") == "dev" {
		// Connect to local development database (user must be running Auth Proxy on local device)
		// host := "localhost"
		// port := 3306
		// user := os.Getenv("DB_USER")
		// password := ""
		// dbname := "bs-global-development"

		// connStr := fmt.Sprintf("host=%s port=%d user=%s "+
		// 	"password=\"%s\" dbname=%s sslmode=disable",
		// 	host, port, user, password, dbname)

		// db, err := sql.Open("postgres", connStr)
		// if err != nil {
		// 	log.Panic(err)
		// }

		// if err = db.Ping(); err != nil {
		// 	log.Panic(err)
		// }

		// db.SetMaxOpenConns(5)

		// DB = db

		// log.Println("Connection to database established")
	} else {
		var (
			dbUser = os.Getenv("DB_USER")
			dbPwd  = os.Getenv("DB_PASS")
			dbName = os.Getenv("DB_NAME")
			host   = os.Getenv("DB_HOST")
		)

		dbURI := fmt.Sprintf("user=%s password=%s database=%s host=%s",
			dbUser, dbPwd, dbName, host)

		db, err := sql.Open("pgx", dbURI)
		if err != nil {
			log.Panic(err)
		}

		if err = db.Ping(); err != nil {
			log.Panic(err)
		}

		db.SetMaxOpenConns(5)

		DB = db

		log.Println("Connection to database established")
	}
}
