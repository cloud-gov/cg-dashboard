package main

import (
	"log"
	"net"
	"net/http"
	"strings"

	"github.com/gocraft/web"
)

func registerTICMiddleware(router *web.Router, e *EnvVars) {
	if e.TICSecret == "" {
		// If TICSercret is not defined, skip this middleware
		return
	}
	router.Middleware(func(resp web.ResponseWriter, req *web.Request, next web.NextMiddlewareFunc) {
		clientIP, err := getClientIP(req.Request)
		if err != nil {
			log.Println(err)
			resp.WriteHeader(http.StatusInternalServerError)
			resp.Write([]byte("error parsing client ip"))
			// don't continue the request in this case.
			return
		}
		if clientIP != "" {
			// Set headers for requests to CF API proxy
			req.Header.Add("X-Client-IP", clientIP)
			req.Header.Add("X-TIC-Secret", e.TICSecret)
		}
		next(resp, req)
	})
}

// getClientIP gets a Client IP address from either X-Forwarded-For or RemoteAddr
func getClientIP(req *http.Request) (string, error) {
	addrs := strings.Split(req.Header.Get("X-Forwarded-For"), ", ")
	for idx := len(addrs) - 1; idx >= 0; idx-- {
		if net.ParseIP(addrs[idx]).IsGlobalUnicast() {
			return addrs[idx], nil
		}
	}
	if req.RemoteAddr == "" {
		return "", nil
	}
	host, _, err := net.SplitHostPort(req.RemoteAddr)
	return host, err
}
