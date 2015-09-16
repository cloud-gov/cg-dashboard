package acceptance

// We need these imports in here until this is resolved: https://github.com/tools/godep/issues/271

// When adding new imports, make sure you put a comment after the blank import or else golint will complain
import (
	_ "github.com/onsi/ginkgo"     // Needed for acceptance package.
	_ "github.com/onsi/gomega"     // Needed for acceptance package.
	_ "github.com/sclevine/agouti" // Needed for acceptance package.
)
