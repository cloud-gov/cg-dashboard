package services

// Service describes what external services look like
type Service interface {
	HealthCheck() bool
	Type() string
}
