package controllers

import (
	"github.com/gocraft/web"

	"fmt"
)

// LogContext stores the session info and access token per user.
// All routes within LogContext represent the Loggregator routes
type LogContext struct {
	*SecureContext // Required.
}

// RecentLogs returns a log dump of the given app.
func (c *LogContext) RecentLogs(rw web.ResponseWriter, req *web.Request) {
	reqURL := fmt.Sprintf("%s/%s", c.Settings.LogURL, "recent?app="+req.URL.Query().Get("app"))
	c.Proxy(rw, req.Request, reqURL)

}
