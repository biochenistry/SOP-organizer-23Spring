package db

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"log"
	"net"
	"os"
	"time"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/lib/pq"
	"golang.org/x/crypto/ssh"
)

var DB *sql.DB

type ViaSSHDialer struct {
	client *ssh.Client
}

func (dialer *ViaSSHDialer) Open(s string) (_ driver.Conn, err error) {
	return pq.DialOpen(dialer, s)
}

func (dialer *ViaSSHDialer) Dial(network, address string) (net.Conn, error) {
	return dialer.client.Dial(network, address)
}

func (dialer *ViaSSHDialer) DialTimeout(network, address string, timeout time.Duration) (net.Conn, error) {
	return dialer.client.Dial(network, address)
}

func InitDB() {
	if os.Getenv("MODE") == "dev" {
		sshHost := os.Getenv("SSH_HOST") // SSH Server Hostname/IP
		sshPort := 22                    // SSH Port
		sshUser := os.Getenv("SSH_USER") // SSH Username
		sshPass := os.Getenv("SSH_PASS") // Empty string for no password
		dbUser := os.Getenv("DB_USER")   // DB username
		dbPass := os.Getenv("DB_PASS")   // DB Password
		dbHost := "localhost"            // DB Hostname/IP
		dbName := "sop_organizer"        // Database name

		// The client configuration with configuration option to use the ssh-agent
		sshConfig := &ssh.ClientConfig{
			User:            sshUser,
			Auth:            []ssh.AuthMethod{},
			HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		}

		// When there's a non empty password add the password AuthMethod
		if sshPass != "" {
			sshConfig.Auth = append(sshConfig.Auth, ssh.PasswordCallback(func() (string, error) {
				return sshPass, nil
			}))
		}

		// Connect to the SSH Server
		sshcon, err := ssh.Dial("tcp", fmt.Sprintf("%s:%d", sshHost, sshPort), sshConfig)
		if err != nil {
			log.Panic(err)
		}

		sql.Register("postgres+ssh", &ViaSSHDialer{sshcon})

		db, err := sql.Open("postgres+ssh", fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable", dbUser, dbPass, dbHost, dbName))
		if err != nil {
			log.Panic(err)
		}

		if err = db.Ping(); err != nil {
			log.Panic(err)
		}

		db.SetMaxOpenConns(5)

		DB = db

		log.Println("Connection to database established")
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
