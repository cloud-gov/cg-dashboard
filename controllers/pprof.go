package controllers

import (
	"github.com/gocraft/web"
	"net/http"
	"net/http/pprof"
	"strings"
)

// PProfContext is a debug context to profile information about the backend.
type PProfContext struct {
	*SecureContext // Required.
}

// Index responds with the pprof-formatted profile named by the request.
func (c *PProfContext) Index(rw web.ResponseWriter, req *web.Request) {
	// PPROF will automatically make paths for you. Need to make sure that the index has a / at the end.
	if !strings.HasSuffix(req.URL.Path, "/") {
		http.Redirect(rw, req.Request, req.URL.Path+"/", http.StatusMovedPermanently)
		return
	}
	pprof.Index(rw, req.Request)
}

// Heap responds with the heap pprof-formatted profile. (Based off Index)
func (c *PProfContext) Heap(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("heap").ServeHTTP(rw, req.Request)
}

// Goroutine responds with the goroutine pprof-formatted profile. (Based off Index)
func (c *PProfContext) Goroutine(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("goroutine").ServeHTTP(rw, req.Request)
}

// Threadcreate responds with the threadcreate pprof-formatted profile. (Based off Index)
func (c *PProfContext) Threadcreate(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("threadcreate").ServeHTTP(rw, req.Request)
}

// Block responds with the the block pprof-formatted profile. (Based off Index)
func (c *PProfContext) Block(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("block").ServeHTTP(rw, req.Request)
}

// Profile responds with the cpu pprof-formatted profile.
func (c *PProfContext) Profile(rw web.ResponseWriter, req *web.Request) {
	pprof.Profile(rw, req.Request)
}

// Symbol looks up the program counters listed in the request,
// responding with a table mapping program counters to function names.
func (c *PProfContext) Symbol(rw web.ResponseWriter, req *web.Request) {
	pprof.Symbol(rw, req.Request)
}
