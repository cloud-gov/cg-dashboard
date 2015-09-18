// +build acceptance

package util

import (
	"github.com/18F/cf-deck/helpers"
	"github.com/sclevine/agouti"
	"time"
)

// DelayForRendering is to allow for test platforms to catch up and render.
func DelayForRendering() {
	time.Sleep(helpers.TimeoutConstant)
}

func FindFirstVisibleOverlayButtonByText(text string, page *agouti.Page) *agouti.Selection {
	allSelections := page.AllByButton(text)
	allSelectionsCount, _ := allSelections.Count()
	for i := 0; i< allSelectionsCount; i++ {
		if visible, _ := allSelections.At(i).Visible(); visible {
			return allSelections.At(i)
		}
	}
	return nil
}
