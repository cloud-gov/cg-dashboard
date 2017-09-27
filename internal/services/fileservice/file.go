package fileservice

type FileSystemService struct{}

func (s FileSystemService) HealthCheck() bool { return true }

func (s FileSystemService) Type() string { return "file" }
