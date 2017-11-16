package docker

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"testing"

	dockerclient "github.com/fsouza/go-dockerclient"
	"github.com/ory/dockertest"
)

// connectToDockerNetwork will connect the given docker container to the
// "servicesTestNetwork" and assign it the provided alias.
// This method assumes that the servicesTestNetwork already exists (which is
// the case if using the docker-compose way.) By using docker-compose,
// DOCKER_IN_DOCKER will be set and the logic in here will only take effect
// then. We need to connect the service to the network when in
// DOCKER_IN_DOCKER mode / docker-compose so that the container running the
// test can connect to the test container.
// Returns the hostname and true/false if successfully able to
// connect to the network.
func connectToDockerNetwork(pool *dockertest.Pool,
	resource *dockertest.Resource,
	hostname string) (string, bool) {
	if os.Getenv("DOCKER_IN_DOCKER") == "1" {
		if networks, err := pool.Client.ListNetworks(); err == nil {
			for _, network := range networks {
				if strings.Contains(network.Name, "servicesTestNetwork") {
					pool.Client.ConnectNetwork(network.ID,
						dockerclient.NetworkConnectionOptions{
							Container: resource.Container.Name,
							EndpointConfig: &dockerclient.EndpointConfig{
								Aliases: []string{hostname},
							},
						})
					return hostname, true
				}
			}
		}
	}
	return "", false
}

// skipIfNoDocker will detect if Docker is unable to run, and if not, will skip the test
func skipIfNoDocker(t *testing.T) {
	if os.Getenv("SKIP_DOCKER") == "1" {
		t.Skip("No support for docker")
	}
}

// CreateTestMailCatcher creates a actual redis instance with docker.
// Useful for unit tests.
func CreateTestMailCatcher(t *testing.T) (string, string, string, func()) {
	skipIfNoDocker(t)
	pool, err := dockertest.NewPool("")
	if err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}

	resource, err := pool.Run("tophfr/mailcatcher", "latest", nil)
	if err != nil {
		log.Fatalf("Could not start resource: %s", err)
	}
	// Get the hostname of the Docker Host.
	u, _ := url.Parse(pool.Client.Endpoint())
	hostname := u.Hostname()

	// Get the exposed ports of the docker container which uses 25 & 80 internally.
	smtpPort := resource.GetPort("25/tcp")
	apiPort := resource.GetPort("80/tcp")

	// Create a docker network if necessary.
	// refer to connectToDockerNetwork
	internalHost, connected := connectToDockerNetwork(pool,
		resource, "test-mailcatcher")
	if connected {
		// If network created, reassign the hostname and ports to use.
		hostname = internalHost
		smtpPort = "25"
		apiPort = "80"
	}

	if err = pool.Retry(func() error {
		_, dialErr := http.Get("http://" + hostname + ":" + apiPort + "/messages/")
		if err != nil {
			return err
		}

		return dialErr
	}); err != nil {
		log.Fatalf("Could not connect to docker: %s", err)
	}
	return hostname, smtpPort, apiPort, func() { pool.Purge(resource) }
}

// GetLatestMailMessageData gets the metadata from mailcatcher from the
// last message.
// Upon reading this message, the message is automatically removed
// (by design of mailcatcher.)
func GetLatestMailMessageData(hostname, apiPort string) ([]byte, error) {
	res, err := http.Get("http://" + hostname + ":" + apiPort + "/messages/1.json")
	if err != nil {
		return []byte{}, err
	}
	body, err := ioutil.ReadAll(res.Body)
	res.Body.Close()
	if err != nil {
		return []byte{}, err
	}
	return body, nil
}
