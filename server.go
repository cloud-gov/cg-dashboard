package main

import (
	"github.com/18F/cf-console/controllers"
	"github.com/18F/cf-console/helpers"

	"fmt"
	"net/http"
	"os"
)

func main() {
	// Initialize the settings.
	settings := helpers.Settings{}
	if err := settings.InitSettings(); err != nil {
		fmt.Println(err.Error())
		return
	}

	// Initialize the router
	router := controllers.InitRouter(&settings)

	// Start the server up.
	var port string
	if port = os.Getenv("PORT"); len(port) == 0 {
		port = "9999"
	}
	http.ListenAndServe(":"+port, router)
}
