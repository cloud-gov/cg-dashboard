package helpers

import (
	"github.com/cloudfoundry/loggregatorlib/logmessage"
	"github.com/gogo/protobuf/proto"
	"golang.org/x/oauth2"

	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
	"time"
)

// ParseLogMessages is a modified version of httpRecent.
// https://github.com/cloudfoundry/loggregator_consumer/blob/89d7fe237afae1e8222554359ec03b72c8466d10/consumer.go#L145
// Also, when using their Recent function, we would get unauthorized errors. If we make the request ourselves, it works.
// TODO eventually figure out the cause of the unauthorized errors
func ParseLogMessages(body *io.ReadCloser, contentType string) (*bytes.Buffer, error) {
	_, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		return nil, err
	}

	var msg logmessage.LogMessage
	reader := multipart.NewReader(*body, params["boundary"])
	var buffer bytes.Buffer
	var messages bytes.Buffer
	firstNotInserted := true
	messages.WriteRune('[')
	for part, loopErr := reader.NextPart(); loopErr == nil; part, loopErr = reader.NextPart() {
		// Skip putting a comma if we haven't put the first element in there yet.
		if !firstNotInserted {
			messages.WriteRune(',')
		} else {
			firstNotInserted = false
		}

		// Clear out temporary buffer.
		buffer.Reset()

		msg = logmessage.LogMessage{}
		// Read raw bytes.
		_, err := buffer.ReadFrom(part)
		if err != nil {
			break
		}
		// Try to unmarshal the bytes into a LogMessage struct.
		proto.Unmarshal(buffer.Bytes(), &msg)
		// Marshal the data into json with only the Message.
		json, err := json.Marshal(struct {
			Message string `json:"message"`
		}{
			Message: string(msg.GetMessage()),
		})
		// Write it to our buffer.
		messages.Write(json)
		part.Close()
	}
	messages.WriteRune(']')
	buffer.Reset()
	return &messages, nil
}

// GetValidToken is a helper function that returns a token struct only if it finds a non expired token for the session.
func GetValidToken(req *http.Request, settings *Settings) *oauth2.Token {
	// Get session from session store.
	session, _ := settings.Sessions.Get(req, "session")
	// If for some reason we can't get or create a session, bail out.
	if session == nil {
		return nil
	}

	// Attempt to get the token from this session.
	if token, ok := session.Values["token"].(oauth2.Token); ok {
		// If valid, just return.
		if token.Valid() {
			return &token
		}

		// Attempt to refresh token using oauth2 Client
		// https://godoc.org/golang.org/x/oauth2#Config.Client
		reqURL := fmt.Sprintf("%s%s", settings.ConsoleAPI, "/v2/info")
		request, _ := http.NewRequest("GET", reqURL, nil)
		request.Close = true
		client := settings.OAuthConfig.Client(settings.TokenContext, &token)
		// Prevents lingering goroutines from living forever.
		// http://stackoverflow.com/questions/16895294/how-to-set-timeout-for-http-get-requests-in-golang/25344458#25344458
		client.Timeout = 5 * time.Second
		resp, err := client.Do(request)
		if resp != nil {
			defer resp.Body.Close()
		}
		if err != nil {
			return nil
		}
		return &token
	}

	// If couldn't find token or if it's expired, return nil
	return nil
}
