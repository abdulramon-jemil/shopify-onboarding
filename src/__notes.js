/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/* eslint-disable */
// @ts-nocheck

/**
 * A Component has the following (that it can change dynamically)
 * - Data attributes it manipulates.
 * - Aria attributes it manipulates.
 * - Other attributes it manipulates.
 * - Events it reacts to.
 *
 * - Aria attributes the element requires
 * - Other attributes the element requires
 */

const popover = new Popover({
  elements: {
    trigger: 4,
    content: 2
  }
})

const menu = new Menu({
  elements: {
    trigger: 0,
    content: 1,
    items: [{ root: 8 }]
  }
})

const collapsible = new Collapsible({
  elements: {
    root: 4,
    trigger: 4,
    content: 83
  }
})

const checkbox = new Checkbox({
  elements: {
    root: 8,
    indicator: 9
  }
})

const progress = new Progress({
  elements: {
    root: 4,
    indicator: 8
  }
})

const acc = new Accordion({
  defaultItem: 4,
  elements: {
    items: [{ root: 0, header: 1, trigger: 2, content: 4 }]
  }
})

const html = String.raw
html`
  <div
    data-ui-store-button-menu-trigger
    data-ui-notification-popover-trigger
    class="js-ui-menu-trigger"
  ></div>
`

const NOTIFICATION_POPOVER_CONFIG = {
  TRIGGER: {
    selector: "data-ui-store-button-menu-trigger",
    type: HTMLButtonElement
  }
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

/*--------------------------------------------*\
HELPER FUNCTIONS
\*--------------------------------------------*/

/**
 * ACTUAL EVENTING SYSTEM
 * - Component
 *   - Elements and outside
 *     - Events: pointer, keyboard, focus / blur -> default prevention.
 *       - States: focus and internal state.
 *         - Changes: focus, internal state, callback firing.
 */

/**
 * EVENTS LIST
 * - Click
 * - Focus
 * - Blur
 *
 * - Tab -> not default prevented
 * - Shift + tab -> not default prevented
 * - Space
 * - Enter.
 * - ESC.
 * - Arrow key.
 *
 * - Outside click.
 */

/**
 * POPOVER EVENTS / CHANGES.
 * - Click / Enter / Space on trigger.
 *   - State: not open, focus on trigger.
 *   - Change: set to open, focus dialog.
 * - Focus on trigger.
 *   - State: open, focus on trigger.
 *   - Change: set to closed, focus trigger.
 * - ESC on content.
 *   - State: focus within content, open.
 *   - Change: focus trigger, set to closed, fire callbacks.
 * - TAB / Shift + TAB on content.
 *   - State: focus within content, open.
 *   - Change: focus next focusable within content or wrap focus.
 * - Outside click on content.
 *   - State: focus outside content, open.
 *   - Change: leave default focus, set to closed, fire callbacks.
 */

/**
 * DROPDOWN STATE
 * - Open / Closed.
 * - Current Item.
 *
 * DROPDOWN ELEMENT PROPERTIES
 * - Trigger / static
 *   - aria-haspopup=true
 *   - aria-controls={{content.id}}
 * - Trigger / managed
 *   - data-state
 *   - aria-expanded
 *
 * - Content / static
 *   - role=menu
 *   - tabindex=-1
 *   - aria-orientation=vertical
 * - Content / managed
 *   - data-state
 *   - css => display
 *
 * - Item / static
 *   - role=menuitem
 * - Item / managed
 *   - tabindex
 *   - data-highlighted
 *
 * DROPDOWN EVENTS / CHANGES.
 * - Click / Enter / Space on Trigger.
 *   - State: focus on trigger, closed.
 *   - Change: focus first item, open menu, fire callbacks.
 * - ESC on content.
 *   - State: focus within content, open.
 *   - Change: close menu, focus trigger, fire callbacks
 * - TAB / Shift + TAB on content.
 *   - State: focus within content, open.
 *   - Change: Maintain focus wherever it is (prevent default).
 * - Arrow Up / Arrow Down on an item
 *   - State: open, focus within content
 *   - Change: Set focus to prev/next item or wrap, change current item state.
 * - Menu item Click / Enter / Focus
 *   - State: open, focus within content
 *   - Change: close menu, set focus on trigger.
 * - Menu item pointerenter / pointerleave
 *   - State: open, focus within item
 *   - Change: set current item to item, set focus to item.
 * - Home / End on content.
 *   - State: focus within content, open.
 *   - Change: Set current item to first / last, focus first / last.
 * - Letter within A-Z that begins item press on content.
 *   - State: focus within content, open.
 *   - Change: Set current item to first item with letter, focus the item.
 * - Outside focus on content.
 *   - State: open, focus outside content.
 *   - Change: focus trigger, set closed, set item to null.
 */

/**
 * HIDEABLE STATE
 * - Hidden
 * - Controller
 *
 * HIDEABLE ELEMENT PROPERTIES
 * - Root / managed
 *   - data-hidden
 *   - data-controller
 *   - css => display
 *
 * - Trigger / managed
 *   - data-hidden
 *   - data-controller
 *
 * HIDEABLE EVENTS / CHANGES
 * - Space / Enter / Click on hideable trigger.
 *   - State: Open.
 *   - Change: Toggle root hidden state, controller => event.
 */

/**
 * PROGRESS STATE
 * - Current value
 * - Controller (default / api)
 *
 * PROGRESS ELEMENT PROPERTIES
 * - Root / static
 *   - aria-valuemax
 *   - aria-valuemin
 *   - data-max
 * - Root / managed
 *   - aria-valuenow
 *   - aria-valuetext
 *   - data-controller
 *   - data-value (e.g 66)
 *   - css => --ui-progress-percent
 *
 * - Indicator / static
 *   - data-max
 * - Indicator / managed
 *  - data-controller
 *  - data-value
 *
 * PROGRESS EVENTS / CHANGES
 * ---- null ----
 *
 * PROGRESS METHODS
 * - `setValue` => passed an integer to set progress value
 */

/**
 * CHECKBOX STATE
 * - checked.
 * - controller (default/event).
 *
 * CHECKBOX ELEMENT PROPERTIES
 * - Root / static
 *   - role
 * - Root / managed
 *   - aria-checked
 *   - data-state
 *
 * - Indicator / managed
 *   - data-state
 *
 * CHECKBOX EVENTS / CHANGES
 * - Space / Enter / Click on root.
 *   - State: any state.
 *   - Change: Toggle checkox state, set controller to event.
 */

/**
 * COLLAPSIBLE STATE
 * - isCollapsed.
 * - controller.
 *
 * COLLAPSIBLE ELEMENT PROPERTIES
 * - Root / managed
 *   - data-state (open/closed)
 *   - data-controller
 *
 * - Trigger / static
 *   - aria-controls={{content.id}}
 * - Trigger / managed
 *   - aria-expanded
 *   - data-state (open/closed)
 *   - data-controller
 *
 * - Content / static
 *   - id=/non-empty-string/
 * - Content / managed
 *   - data-state (open/closed)
 *   - data-controller
 *   - css => display
 *   - css => --ui-collapsible-content-height
 *   - css => --ui-collapsible-content-width
 *
 * COLLAPSIBLE EVENTS / CHANGES
 * - Space / Enter / Click on Trigger
 *   - State: any state.
 *   - Change: Toggle collapsible, set controller to event.
 */

/**
 * ACCORDION STATE
 * - Current item index.
 * - Controller.
 *
 * ACCORDION ELEMENT PROPERTIES
 * - Item root / managed
 *   - data-state
 *   - data-controller
 *
 * - Item header / managed
 *   - data-state
 *   - data-controller
 *
 * - Item trigger / static
 *   - id=/non-empty-string/
 *   - aria-controls={{content.id}}
 * - Item trigger / managed
 *   - aria-expanded
 *   - data-state
 *   - data-controller
 *
 * - Item content / static
 *   - id=/non-empty-string/
 *   - aria-labelledby={{trigger.id}}
 * - Item content / managed
 *   - data-state
 *   - data-controller
 *   - css => display
 *   - css => --ui-accordion-item-content-height
 *   - css => --ui-accordion-item-content-width
 *
 * ACCORDION EVENTS / CHANGES
 * - Space / Enter / Click on Item Trigger.
 *   - State: Not current item.
 *   - Change: Open item, close other items.
 * - Arrow Down / Arrow Up on Item Trigger.
 *   - State: __
 *   - Change: Moves focus to prev / next trigger or wraps when needed.
 * - Home / End on Item Trigger.
 *   - State: __
 *   - Change: Moves focus to first / last trigger.
 * - Mutation on Item Content
 *   - State: __
 *   - Change: Set necessary CSS variables (prevent recursive firing of handler).
 * - Resize on Item Content
 *   - State: __
 *   - Change: Set necessary CSS variables (prevent recursive firing of handler).
 */

/**
 * SIMPLE STATE MANAGEMENT MACHINE
 *
 */

const setupGuideState = new State()

// Add callback to call on change
setupGuideState.onChange((newValue, oldValue) => {
  console.log(oldValue)
})

// Set state value
setupGuideState.setValue({
  completed: 3
})

checkbox.onCheckedChange((checked) => {
  const markedBoxes = checkboxes.filter((checkbox) => checkbox.isChecked())
  setupGuideState.setValue({ completed: markedBoxes.length })

  /**
   * CHECKBOX CHECKED
   * - If there's a next unchecked one, open the item.
   * - Else if there's a prev unchecked one, open the item.
   * - Else, leave it as is.
   *
   * CHECKBOX UNCHECKED
   * - Do nothing.
   */
  accordion.setActiveItem()
})
