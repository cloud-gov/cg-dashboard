// +build acceptance

package util

import (
	"github.com/18F/cf-deck/helpers"
	"time"
)

// DelayForRendering is to allow for test platforms to catch up and render.
func DelayForRendering() {
	time.Sleep(helpers.TimeoutConstant)
}
