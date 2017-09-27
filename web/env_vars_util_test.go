package main

import "os"

// GetMockCompleteEnvVars is just a commonly used env vars object that contains non-empty values for all the fields of the EnvVars struct.
func GetMockCompleteEnvVars() EnvVars {
	return EnvVars{
		ClientID:      "ID",
		ClientSecret:  "Secret",
		Hostname:      "https://hostname",
		APIURL:        "https://apiurl",
		PProfEnabled:  "true",
		SessionKey:    "lalala",
		BasePath:      os.Getenv(helpers.BasePathEnvVar),
		SMTPFrom:      "cloud@cloud.gov",
		SMTPHost:      "localhost",
		SecureCookies: "1",
		TICSecret:     "tic",
	}
}
