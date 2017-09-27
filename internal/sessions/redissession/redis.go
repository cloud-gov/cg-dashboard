package redissession

import (
	"github.com/18F/cg-dashboard/internal/services"
	"github.com/18F/cg-dashboard/internal/services/redisservice"
	s "github.com/18F/cg-dashboard/internal/sessions"
	"github.com/boj/redistore"
	"github.com/gorilla/sessions"
)

type redisStore struct {
	sessions.Store
	service redisservice.RedisService
}

// GetBackendService returns the underlying redis service.
func (store *redisStore) GetBackendService() services.Service {
	return store.service
}

// Init creates a redis session store.
func Init(service redisservice.RedisService, sessionKey string, secureCookies bool) (s.Store, error) {
	store, err := redistore.NewRediStoreWithPool(service.GetPool(), []byte(sessionKey))
	if err != nil {
		return nil, err
	}
	store.SetMaxLength(4096 * 4)
	store.Options = &sessions.Options{
		HttpOnly: true,
		MaxAge:   s.GetSessionExpiration(),
		Path:     "/",
		Secure:   secureCookies,
	}
	return &redisStore{store, service}, nil
}
