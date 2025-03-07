import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect() {
    this.isSelecting = false
    this.#bindSelectionEvents()
  }

  visitRecord(event) {
    if (event.type !== 'click') {
      return
    }

    if (this.#isTextSelected()) {
      return
    }

    // We won't navigate if shift is pressed. That is usually used to select multiple rows.
    const isShiftPressed = event.shiftKey
    // We won't navigate if the user clicks on the item selector cell
    const isItemSelector = event.target.closest('.item-selector-cell')
    // We won't navigate if the user clicks on a link or button
    const isLinkOrButton = event.target.closest('a, button')
    // We won't navigate if the user clicks on a checkbox
    const isCheckbox = event.target.closest('input[type="checkbox"]')

    if (isShiftPressed || isLinkOrButton || isCheckbox || isItemSelector) {
      return // Don't navigate if a link or button is clicked
    }

    const row = event.target.closest('tr')
    const url = row.dataset.visitPath

    if (!row || !url) {
      return
    }

    if (event.metaKey || event.ctrlKey) {
      this.#visitInNewTab(url)
    } else {
      this.#visitInSameTab(url)
    }
  }

  #bindSelectionEvents() {
    this.element.addEventListener('mousedown', this.#handleMouseDown.bind(this))
    this.element.addEventListener('mousemove', this.#handleMouseMove.bind(this))
  }

  #handleMouseDown() {
    this.isSelecting = false
  }

  #handleMouseMove(event) {
    if (event.buttons === 1) { // Left mouse button is being held
      this.isSelecting = true
    }
  }

  #isTextSelected() {
    if (this.isSelecting || window.getSelection().toString().length > 0) {
      this.isSelecting = false

      return true
    }

    return false
  }

  #visitInSameTab(url) {
    window.Turbo.visit(url)
  }

  #visitInNewTab(url) {
    window.open(url, '_blank').focus()
  }
}
