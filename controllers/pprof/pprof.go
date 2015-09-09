package pprof

import (
	"github.com/18F/cf-deck/controllers"
	"github.com/gocraft/web"
	"net/http"
	"net/http/pprof"
	"strings"
)

// InitPProfRouter adds the routes for PProf.
func InitPProfRouter(parentRouter *web.Router) {
	// Setup the /pprof subrouter.
	pprofRouter := parentRouter.Subrouter(Context{}, "/debug/pprof")
	pprofRouter.Get("/", (*Context).Index)
	pprofRouter.Get("/heap", (*Context).Heap)
	pprofRouter.Get("/goroutine", (*Context).Goroutine)
	pprofRouter.Get("/threadcreate", (*Context).Threadcreate)
	pprofRouter.Get("/block", (*Context).Threadcreate)
	pprofRouter.Get("/profile", (*Context).Profile)
	pprofRouter.Get("/symbol", (*Context).Symbol)
}

// Context is a debug context to profile information about the backend.
type Context struct {
	*controllers.Context // Required.
}

// Index responds with the pprof-formatted profile named by the request.
func (c *Context) Index(rw web.ResponseWriter, req *web.Request) {
	// PPROF will automatically make paths for you. Need to make sure that the index has a / at the end.
	if !strings.HasSuffix(req.URL.Path, "/") {
		http.Redirect(rw, req.Request, req.URL.Path+"/", http.StatusMovedPermanently)
		return
	}
	pprof.Index(rw, req.Request)
}

// Heap responds with the heap pprof-formatted profile. (Based off Index)
func (c *Context) Heap(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("heap").ServeHTTP(rw, req.Request)
}

// Goroutine responds with the goroutine pprof-formatted profile. (Based off Index)
func (c *Context) Goroutine(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("goroutine").ServeHTTP(rw, req.Request)
}

// Threadcreate responds with the threadcreate pprof-formatted profile. (Based off Index)
func (c *Context) Threadcreate(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("threadcreate").ServeHTTP(rw, req.Request)
}

// Block responds with the the block pprof-formatted profile. (Based off Index)
func (c *Context) Block(rw web.ResponseWriter, req *web.Request) {
	pprof.Handler("block").ServeHTTP(rw, req.Request)
}

// Profile responds with the cpu pprof-formatted profile.
func (c *Context) Profile(rw web.ResponseWriter, req *web.Request) {
	pprof.Profile(rw, req.Request)
}

// Symbol looks up the program counters listed in the request,
// responding with a table mapping program counters to function names.
func (c *Context) Symbol(rw web.ResponseWriter, req *web.Request) {
	pprof.Symbol(rw, req.Request)
}
