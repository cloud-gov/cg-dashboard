package controllers

import (
	"github.com/cloudfoundry/loggregatorlib/logmessage"
	"github.com/gocraft/web"
	"github.com/gogo/protobuf/proto"

	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"mime/multipart"
	"net/http"
)

// LogContext stores the session info and access token per user.
// All routes within LogContext represent the Loggregator routes
type LogContext struct {
	*SecureContext // Required.
}

// RecentLogs returns a log dump of the given app.
func (c *LogContext) RecentLogs(rw web.ResponseWriter, req *web.Request) {
	reqURL := fmt.Sprintf("%s/%s", c.Settings.LogURL, "recent?app="+req.URL.Query().Get("app"))
	c.Proxy(rw, req.Request, reqURL, c.logMessageResponseHandler)
}

// logMessageResponseHandler is a response handler that constructs log messages structs from the response
// given by the loggregator.
func (c *LogContext) logMessageResponseHandler(rw http.ResponseWriter, response *http.Response) {
	messages, err := c.ParseLogMessages(&(response.Body), response.Header.Get("Content-Type"))
	if err != nil {
		rw.WriteHeader(http.StatusInternalServerError)
		rw.Write([]byte(err.Error()))
		return
	}
	rw.WriteHeader(response.StatusCode)
	rw.Write(messages.Bytes())
	return

}

// ParseLogMessages is a modified version of httpRecent.
// https://github.com/cloudfoundry/loggregator_consumer/blob/89d7fe237afae1e8222554359ec03b72c8466d10/consumer.go#L145
// Also, when using their Recent function, we would get unauthorized errors. If we make the request ourselves, it works.
// TODO eventually figure out the cause of the unauthorized errors
func (c *LogContext) ParseLogMessages(body *io.ReadCloser, contentType string) (*bytes.Buffer, error) {
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
		if err != nil {
			return nil, err
		}
		// Write it to our buffer.
		messages.Write(json)
		part.Close()
	}
	messages.WriteRune(']')
	buffer.Reset()
	return &messages, nil
}
