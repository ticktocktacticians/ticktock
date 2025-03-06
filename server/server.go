package main

import (
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"server/auth"
	"server/handlers"
	handlersUtils "server/handlers/utils"
	"server/models"

	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {

	dotenvPath := os.Getenv("DOTENV_PATH")
	if dotenvPath == "" {
		dotenvPath = "./env"
	}

	err := godotenv.Load(dotenvPath)
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// init auth provider
	auth := auth.InitAuth()

	// init db conn
	dbName := os.Getenv("PGDATABASE")
	dbUser := os.Getenv("PGUSER")
	dbPass := os.Getenv("PGPASSWORD")
	dbHost := os.Getenv("PGHOST")
	dbPort := os.Getenv("PGPORT")

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUser, dbPass, dbHost, dbPort, dbName),
		PreferSimpleProtocol: true, // disables implicit prepared statement usage
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to DB")
	}

	// Check if the 'format' type already exists
	var formatExists bool
	err = db.Raw("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'format')").Scan(&formatExists).Error
	if err != nil {
		log.Fatal("failed to check if type exists: " + err.Error())
	}

	// Create the custom enum type only if it doesn't exist
	if !formatExists {
		result := db.Exec("CREATE TYPE format AS ENUM ('VIRTUAL', 'PHYSICAL')")
		if result.Error != nil {
			log.Fatal("failed to create enum type: " + result.Error.Error())
		}
	} else {
		fmt.Println("'format' enum type already exists, skipping creation")
	}

	// Check if the 'format' type already exists
	var eventStatusExists bool
	err = db.Raw("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status')").Scan(&eventStatusExists).Error
	if err != nil {
		log.Fatal("failed to check if type exists: " + err.Error())
	}

	// Create the custom enum type only if it doesn't exist
	if !eventStatusExists {
		result := db.Exec("CREATE TYPE event_status AS ENUM ('PENDING_INPUT', 'SCHEDULED', 'COMPLETED', 'CANCELLED')")
		if result.Error != nil {
			log.Fatal("failed to create enum type: " + result.Error.Error())
		}
	} else {
		fmt.Println("'event_status' enum type already exists, skipping creation")
	}

	// Check if the 'format' type already exists
	var notificationStatusExists bool
	err = db.Raw("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status')").Scan(&notificationStatusExists).Error
	if err != nil {
		log.Fatal("failed to check if type exists: " + err.Error())
	}

	// Create the custom enum type only if it doesn't exist
	if !notificationStatusExists {
		result := db.Exec("CREATE TYPE notification_status AS ENUM ('SUCCESS', 'FAIL')")
		if result.Error != nil {
			log.Fatal("failed to create enum type: " + result.Error.Error())
		}
	} else {
		fmt.Println("'notification_status' enum type already exists, skipping creation")
	}

	// Migrate the schema
	db.AutoMigrate(&models.User{}, &models.Availability{}, &models.Timeslot{}, &models.Event{}, &models.Notification{}, &models.Booking{})

	// init server env
	env := &handlersUtils.Env{DB: db, Auth: auth}

	// no auth routes
	attendeeMux := chi.NewRouter()
	attendeeMux.Handle("GET /attendee/event/{id}", handlersUtils.Handler{Env: env, H: handlers.GetAttendeeEvent})
	attendeeMux.Handle("GET /attendee/availability/{id}", handlersUtils.Handler{Env: env, H: handlers.GetAttendeeAvailabity})
	attendeeMux.Handle("POST /attendee/availability", handlersUtils.Handler{Env: env, H: handlers.CreateAttendeeAvailability})

	// authenticated routes
	authMux := chi.NewRouter()
	authMux.Handle("GET /user", handlersUtils.Handler{Env: env, H: handlers.GetUser})
	authMux.Handle("POST /user", handlersUtils.Handler{Env: env, H: handlers.CreateUser})
	authMux.Handle("GET /event/{id}", handlersUtils.Handler{Env: env, H: handlers.GetEventDetails})
	authMux.Handle("POST /event", handlersUtils.Handler{Env: env, H: handlers.CreateEvent})
	authMux.Handle("POST /event/attendees-timeslots", handlersUtils.Handler{Env: env, H: handlers.GetAttendeesTimeslotsForEvent})

	mux := http.NewServeMux()
	mux.Handle("/attendee/", attendeeMux)
	mux.Handle("/auth/", http.StripPrefix("/auth", auth.Authenticate(authMux)))

	slog.Info("Server starting on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handlersUtils.CorsHandler(mux)))
}
