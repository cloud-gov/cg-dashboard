package redisservice

import (
	"log"
	"time"

	"github.com/18F/cg-dashboard/internal/services"
	"github.com/garyburd/redigo/redis"
)

// RedisService represents the necessary methods for a redis service.
// We include GetPool because we want to be able to get the connection pool
// which will give us access to the raw redis instance.
type RedisService interface {
	services.Service
	GetPool() *redis.Pool
}

type redisService struct {
	pool *redis.Pool
}

// HealthCheck will run a PING command to the redis instance.
// If it works, we return true. Otherwise, we return false.
func (s redisService) HealthCheck() bool {
	c := s.pool.Get()
	defer c.Close()
	_, err := c.Do("PING")
	if err != nil {
		log.Printf("health check error: %s", err)
		return false
	}
	return true
}

// Type returns that this is a redis service.
func (s redisService) Type() string {
	return "redis"
}

// GetPool returns the raw redis connection pool.
func (s redisService) GetPool() *redis.Pool {
	return s.pool
}

// Init will create a RedisService with the correct settings.
func Init(address, password string) RedisService {
	// Create a common redis pool of connections.
	redisPool := &redis.Pool{
		MaxIdle:     10,
		IdleTimeout: 240 * time.Second,
		TestOnBorrow: func(c redis.Conn, t time.Time) error {
			_, pingErr := c.Do("PING")
			return pingErr
		},
		Dial: func() (redis.Conn, error) {
			// We need to control how long connections are attempted.
			// Currently will limit how long redis should respond back to
			// 10 seconds. Any time less than the overall connection timeout of 60
			// seconds is good.
			c, dialErr := redis.Dial("tcp", address,
				redis.DialConnectTimeout(10*time.Second),
				redis.DialWriteTimeout(10*time.Second),
				redis.DialReadTimeout(10*time.Second))
			if dialErr != nil {
				return nil, dialErr
			}
			if password != "" {
				if _, authErr := c.Do("AUTH", password); authErr != nil {
					c.Close()
					return nil, authErr
				}
			}
			return c, nil
		},
	}
	return redisService{pool: redisPool}
}
