package docker

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"

	"github.com/garyburd/redigo/redis"
	"github.com/ory/dockertest"
)

// CreateTestRedis creates a actual redis instance with docker.
// Useful for unit tests.
func CreateTestRedis() (string, func()) {
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	resource, err := pool.Run("redis", "2.8", nil)
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}
	u, _ := url.Parse(pool.Client.Endpoint())
	hostnameAndPort := u.Hostname() + ":" + resource.GetPort("6379/tcp")
	if err = pool.Retry(func() error {
		_, dialErr := redis.Dial("tcp", hostnameAndPort)

		return dialErr
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	return "redis://" + hostnameAndPort, func() { pool.Purge(resource) }
}

// CreateTestMailCatcher creates a actual redis instance with docker.
// Useful for unit tests.
func CreateTestMailCatcher() (string, string, string, func()) {
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	resource, err := pool.Run("tophfr/mailcatcher", "latest", nil)
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}
	u, _ := url.Parse(pool.Client.Endpoint())
	hostname := u.Hostname()
	if err = pool.Retry(func() error {
		_, dialErr := redis.Dial("tcp", hostname+":"+resource.GetPort("25/tcp"))

		return dialErr
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	smtpPort := resource.GetPort("25/tcp")
	apiPort := resource.GetPort("80/tcp")
	return hostname, smtpPort, apiPort, func() { pool.Purge(resource) }
}

// GetLatestMailMessageData gets the metadata from mailcatcher from the
// last message.
// Upon reading this message, the message is automatically removed
// (by design of mailcatcher.)
func GetLatestMailMessageData(hostname, apiPort string) ([]byte, string, string) {
	res, err := http.Get("http://" + hostname + ":" + apiPort + "/messages/1.json")
	if err != nil {
		log.Fatal(err)
	}
	body, err := ioutil.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		log.Fatal(err)
	}
	return body, "", ""
}
