// +build acceptance

package util

import (
	"github.com/sclevine/agouti"
)

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
