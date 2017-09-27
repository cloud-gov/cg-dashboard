package sessions

import (
	"github.com/18F/cg-dashboard/internal/services"
	"github.com/gorilla/sessions"
)

// Store embeds the gorilla sessions and adds the
// GetBackendService so that we access the underlying service
// that the store depends on.
type Store interface {
	GetBackendService() services.Service
	sessions.Store
}
