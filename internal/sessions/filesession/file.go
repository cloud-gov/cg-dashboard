package filesession

import (
	"github.com/18F/cg-dashboard/internal/services"
	"github.com/18F/cg-dashboard/internal/services/fileservice"
	s "github.com/18F/cg-dashboard/internal/sessions"
	"github.com/gorilla/sessions"
)

type fileStore struct {
	sessions.Store
	service fileservice.FileSystemService
}

func (s *fileStore) GetBackendService() services.Service {
	return s.service
}

// Init creates a session store with a local file system backend.
func Init(service fileservice.FileSystemService,
	sessionKey string, secureCookies bool) s.Store {
	store := sessions.NewFilesystemStore("", []byte(sessionKey))
	store.MaxLength(4096 * 4)
	store.Options = &sessions.Options{
		HttpOnly: true,
		// TODO remove this; work-around for
		// https://github.com/gorilla/sessions/issues/96
		MaxAge: s.GetSessionExpiration(),
		Path:   "/",
		Secure: secureCookies,
	}
	return &fileStore{store, service}
}
