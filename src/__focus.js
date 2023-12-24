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
 * FOCUS MOVERS.
 * - Tab.
 * - Shift Tab.
 * - Arrow keys.
 * - Enter.
 * - Space.
 * - Escape.
 * - Home.
 * - End.
 * - Left click.
 * - Right click.
 * - Middle click.
 * - DOM API => focus().
 */

/**
 * HANDLING FOCUS MOVE REASONS (FOR FOCUSOUT HANDLERS)
 *
 * keydown => blur => focusout => focus => focusin => keyup
 *
 * NORMAL APPROACH
 * - Set click type on document mousedown capture.
 * - Set key type on document keydown capture.
 * - set "dom-api" on `focus()` call when doc has focus.
 *
 * ON DOC WITHOUT FOCUS
 * - Doc focusout => docLostFocus = true
 * - Doc mousedown => handled the same way
 * - Doc keydown => handled the same way (document already has focus)
 * - Doc focusin => docLostFocus ?
 * - Doc key up => docLostFocus ?
 *
 * ON DOC WITHOUT FOCUS
 * - Clicks based on mousedown work normally.
 * - Keys are not detected at all (null is passed).
 * - focus() also doesn't set a reason when document doesn't have focus.
 *
 * ?? passing tab/shift tab to focusout handler (since keyup runs after focusin).
 * ?? passing null to say can't be determined.
 * ?? resetting docLostFocus
 * ?? keyup fires just once
 * ?? handle manual `.click()` function call.
 */

/**
 * EVENT GROUPS / FOCUS GROUPS
 * - Meant to prevent firing of multiple event handlers for different but
 *   related events.
 *
 * SAMPLES
 * - Content focusout => trigger click
 */

const contentFocusoutGC = createEventGroupControl({
  omissionTriggers: [{ element: trigger, event: "click", position: null }],
  eventHandler: normalizeFocusoutHandler((event) => {
    this._handleContentFocusoutOutsideTrigger()
  })
})

someElement.addEventListenter("focusout", contentFocusoutGC.handler)
someElement2.addEventListenter("click", handler)

eventHandler.call(null, ...[...handlerParams, {}])
