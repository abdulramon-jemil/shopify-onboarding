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
 */

/*--------------------------------------------*\
HELPER FUNCTIONS
\*--------------------------------------------*/

/** @type {(value: unknown) => value is Element} */
const isElement = (value) => value instanceof Element

/** @type {(value: unknown) => value is HTMLElement} */
const isHTMLElement = (value) => value instanceof HTMLElement

/** @type {<T>(value: T, desc: string) => asserts value is Exclude<T, undefined | null>} */
const assertIsDefined = (value, desc) => {
  if (value === undefined || value === null)
    throw new Error(`Expected '${desc}' to be defined, got '${String(value)}'`)
}

/** @type {(value: unknown, desc: string) => asserts value is Element} */
const assertIsElement = (value, desc) => {
  if (!isElement(value)) throw new Error(`Expected '${desc}' to be an Element`)
}

/** @type {(value: unknown, desc: string) => asserts value is HTMLElement} */
const assertIsHTMLElement = (value, desc) => {
  if (!isHTMLElement(value))
    throw new Error(`Expected '${desc}' to be an HTML element`)
}

/** @type {(value: number, max: number, min?: number) => number} */
const toPercent = (value, max, min = 0) => {
  const percentValue = ((value - min) / (max - min)) * 100
  return Number.isInteger(percentValue)
    ? percentValue
    : Number(percentValue.toFixed(2))
}

/**
 * Returns the opening tag of an element as a string
 *
 * @type {(element: Element) => string}
 */
const getElementString = (element) => {
  const { outerHTML, innerHTML, tagName } = element
  const sampleEndingTag = `</${tagName.toLowerCase()}>`

  const hasEndingTag = outerHTML.toLowerCase().endsWith(sampleEndingTag)
  if (!hasEndingTag) return outerHTML

  const openingTagWithInnerHTML = outerHTML
    .substring(0, outerHTML.length - sampleEndingTag.length)
    .trim()

  return outerHTML
    .substring(0, openingTagWithInnerHTML.length - innerHTML.trim().length)
    .trim()
}

/**
 * Sets HTML attribute on element preventing resetting of already set values.
 *
 * @type {(
 *   element: HTMLElement,
 *   attributeName: string,
 *   attributeValue: string | boolean
 * ) => void}
 */
const setElementHTMLAttribute = (element, attributeName, attributeValue) => {
  if (typeof attributeValue === "string") {
    if (element.getAttribute(attributeName) === attributeValue) return
    element.setAttribute(attributeName, attributeValue)
  } else if (typeof attributeValue === "boolean") {
    if (element.hasAttribute(attributeName) === attributeValue) return
    if (attributeValue === true) element.setAttribute(attributeName, "")
    else element.removeAttribute(attributeName)
  }
}

/**
 * Sets inline css property on element preventing resetting already set values
 *
 * @type {(
 *   element: HTMLElement,
 *   propertyName: string,
 *   propertyValue: string | null
 * ) => void}
 */
const setElementInlineCSSProperty = (element, propertyName, propertyValue) => {
  const currentPropertyValue = element.style.getPropertyValue(propertyName)
  if (typeof propertyValue === "string") {
    if (currentPropertyValue === propertyValue) return
    element.style.setProperty(propertyName, propertyValue)
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (propertyValue === null) {
    if (currentPropertyValue === "") return
    element.style.removeProperty(propertyName)
  }
}

/** @type {(element: Element, attribute: string) => string} */
const forceGetElementNonEmptyAttribute = (element, attribute) => {
  const attributeValue = element.getAttribute(attribute)

  if (attributeValue === null || attributeValue === "") {
    throw new Error(
      `Expected element '${getElementString(
        element
      )}' to have non empty attribute '${attribute}'`
    )
  }

  return attributeValue
}

/**
 * @type {(
 *   element: Element,
 *   attribute: string,
 *   type: "positive" | "non-negative" | "any"
 * ) => number}
 */
const forceGetElementIntegerAttribute = (element, attribute, type) => {
  const attributeValue = String(element.getAttribute(attribute))
  const attributeIntegerValue = parseInt(attributeValue, 10)

  const typeInErrorString = type === "any" ? "an" : type
  let hasError = false

  if (
    !Number.isInteger(attributeIntegerValue) ||
    String(attributeIntegerValue) !== attributeValue
  ) {
    hasError = true
  } else if (type === "positive" && attributeIntegerValue <= 0) hasError = true
  else if (type === "non-negative" && attributeIntegerValue < 0) hasError = true

  if (hasError) {
    throw new Error(
      `Expected element '${getElementString(
        element
      )}' to have ${typeInErrorString} integer attribute '${attribute}'`
    )
  }

  return attributeIntegerValue
}

const A11y = /** @type {const} */ ({
  AriaKeys: {
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowUp: "ArrowUp",
    Enter: "Enter",
    Space: " ",
    Escape: "Escape",
    Home: "Home",
    End: "End",
    Tab: "Tab"
  }
})

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
 */

/*--------------------------------------------*\
SELECTION HELPERS
\*--------------------------------------------*/

/**
 * Selects an elements matching the given CSS selector.
 *
 * @template {new (...args: unknown[]) => HTMLElement} T
 * @param {string} cssSelector - The CSS selector to query.
 * @param {T} elementType - The constructor of the element type.
 * @param {Document | HTMLElement} [root=document] - The root element to search within.
 * @returns {InstanceType<T>} - An array of instances of the specified element type.
 */
const selectElement = (cssSelector, elementType, root = document) => {
  const selectedElement = root.querySelector(cssSelector)

  /** @type {(element: Element | null) => element is InstanceType<T>} */
  const isInstance = (element) => element instanceof elementType

  if (!isInstance(selectedElement)) {
    throw new Error(
      `Expected element selected by '${cssSelector}' to be an instance of '${elementType.name}'`
    )
  }

  return selectedElement
}

/**
 * Selects all elements matching the given CSS selector.
 *
 * @template {new (...args: unknown[]) => HTMLElement} T
 * @param {string} cssSelector - The CSS selector to query.
 * @param {T} elementType - The constructor of the element type.
 * @param {Document | HTMLElement} [root=document] - The root element to search within.
 * @returns {InstanceType<T>[]} - An array of instances of the specified element type.
 */
const selectAllElements = (cssSelector, elementType, root = document) => {
  const selectedElements = Array.from(root.querySelectorAll(cssSelector))

  /** @type {(element: Element) => element is InstanceType<T>} */
  const isInstance = (element) => element instanceof elementType

  if (!selectedElements.every(isInstance)) {
    throw new Error(
      `Expected all elements selected by '${cssSelector}' to be instances of '${elementType.name}'`
    )
  }

  return selectedElements
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
 */

/*--------------------------------------------*\
EVENT RELATED HELPERS
\*--------------------------------------------*/

/** @param {MouseEvent} event */
const isClickEvent = (event) => event.button === 0

/**
 * This uses mousedown and keydown instead of the built in click event handler
 * to bind click events to elements.
 *
 *
 * @type {(options: {
 *   element: HTMLElement,
 *   capture?: boolean,
 *   handler: (event: KeyboardEvent | MouseEvent) => any
 * }) => void}
 */
const bindRedefinedClickEvent = ({ element, handler, capture }) => {
  const captureEvent = capture ?? false

  element.addEventListener(
    "mousedown",
    (ev) => {
      if (isClickEvent(ev)) handler.call(null, ev)
    },
    { capture: captureEvent }
  )

  element.addEventListener(
    "keydown",
    (ev) => {
      if (ev.key === A11y.AriaKeys.Enter || ev.key === A11y.AriaKeys.Space) {
        handler.call(null, ev)
      }
    },
    { capture: captureEvent }
  )
}

/**
 * @type {(
 *   element: HTMLElement,
 *   onlyIfTabbable: boolean,
 *   options?: FocusOptions | undefined
 * ) => boolean}
 */
const attemptFocus = (element, onlyIfTabbable, options) => {
  if (document.activeElement === element) return true
  if (onlyIfTabbable && element.tabIndex < 0) return false

  try {
    element.focus(options)
  } catch {
    return false
  }

  return document.activeElement === element
}

/**
 * @type {(
 *   element: HTMLElement,
 *   options?: FocusOptions | undefined
 * ) => boolean}
 */
const attemptElementFocus = (element, options) =>
  attemptFocus(element, false, options)

/**
 * @type {(
 *   element: HTMLElement,
 *   options?: FocusOptions | undefined
 * ) => boolean}
 */
const attemptTabbableFocus = (element, options) =>
  attemptFocus(element, true, options)

/**
 * Focus the next or previous focusable element that occurs after the given
 * element, within the parent, in the DOM order.
 *
 * @type {(params: {
 *   startingElement: HTMLElement,
 *   parent: HTMLElement,
 *   position: "before" | "after",
 *   focusOptions?: FocusOptions | undefined
 * }) => HTMLElement | null}
 */
const focusTabbableAround = ({
  startingElement,
  parent,
  position,
  focusOptions
}) => {
  if (!parent.contains(startingElement)) {
    throw new Error("Element is not within parent")
  }

  const descendants = Array.from(parent.querySelectorAll("*"))
  const elementIndex = descendants.indexOf(startingElement)

  // Exclude the `startingElement` element
  const potentialFocusables =
    position === "before"
      ? descendants.slice(0, elementIndex)
      : descendants.slice(elementIndex + 1)

  if (position === "before") potentialFocusables.reverse()

  for (const element of potentialFocusables) {
    // eslint-disable-next-line no-continue
    if (!isHTMLElement(element)) continue
    const focused = attemptTabbableFocus(element, focusOptions)
    if (focused) return element
  }

  return null
}

/**
 * @type {(
 *   element: HTMLElement,
 *   withinParent: HTMLElement,
 *   focusOptions?: FocusOptions | undefined
 * ) => HTMLElement | null }
 */
const focusPrevTabbableBefore = (element, withinParent, focusOptions) => {
  const focused = focusTabbableAround({
    startingElement: element,
    parent: withinParent,
    position: "before",
    focusOptions
  })
  return focused
}

/**
 * @type {(
 *   element: HTMLElement,
 *   withinParent: HTMLElement,
 *   focusOptions?: FocusOptions | undefined
 * ) => HTMLElement | null }
 */
const focusNextTabbableAfter = (element, withinParent, focusOptions) => {
  const focused = focusTabbableAround({
    startingElement: element,
    parent: withinParent,
    position: "after",
    focusOptions
  })
  return focused
}

/**
 * @type {(
 *   element: HTMLElement,
 *   which: "first" | "last",
 *   focusOptions?: FocusOptions | undefined
 * ) => HTMLElement | null}
 */
const focusFirstOrLastTabbableIn = (element, which, focusOptions) => {
  const descendants = Array.from(element.querySelectorAll("*"))
  if (which === "last") descendants.reverse()

  for (const descendant of descendants) {
    // eslint-disable-next-line no-continue
    if (!isHTMLElement(descendant)) continue
    const focused = attemptTabbableFocus(descendant, focusOptions)
    if (focused) return descendant
  }

  return null
}

/**
 * @type {(
 *   element: HTMLElement,
 *   focusOptions?: FocusOptions | undefined
 * ) => HTMLElement | null}
 */
const focusFirstTabbableIn = (element, focusOptions) =>
  focusFirstOrLastTabbableIn(element, "first", focusOptions)

/**
 * @type {(
 *   element: HTMLElement,
 *   focusOptions?: FocusOptions | undefined
 * ) => HTMLElement | null}
 */
const focusLastTabbableIn = (element, focusOptions) =>
  focusFirstOrLastTabbableIn(element, "last", focusOptions)

/**
 * This normalizes a focus out handler by not calling the handler if the
 * document only lost focus. It uses the current target of the focus out as the
 * element to target outside focus on.
 */
const createdNormalizedFocusOutHandler = (() => {
  /**
   * @typedef {(
   *   focusOut: FocusEvent,
   *   details: {
   *     currentTarget: EventTarget,
   *     docFocusIn: FocusEvent | null
   *   }
   * ) => void} FocusOutHandler
   */

  /**
   * @type {{
   *   focusOut: FocusEvent,
   *   currentTarget: EventTarget,
   *   handler: FocusOutHandler
   * }[]}
   */
  let deferredCallbacks = []

  document.addEventListener(
    "focusin",
    (docFocusInEvent) => {
      if (deferredCallbacks.length === 0) return

      deferredCallbacks.forEach((cb) => {
        const listenerForFocusOut = cb.currentTarget
        assertIsElement(listenerForFocusOut, "focusout current target")

        if (
          !isElement(docFocusInEvent.target) ||
          !listenerForFocusOut.contains(docFocusInEvent.target)
        ) {
          cb.handler.call(null, cb.focusOut, {
            currentTarget: listenerForFocusOut,
            docFocusIn: docFocusInEvent
          })
        }
      })

      deferredCallbacks = []
    },
    { capture: true }
  )

  /** @param {{ handler: FocusOutHandler, currentTarget?: EventTarget }} config */
  const normalizeFocusOutHandlerDef =
    ({ handler, currentTarget: cTarget }) =>
    /** @param {FocusEvent} focusOutEvent */
    (focusOutEvent) => {
      const currentTarget = cTarget ?? focusOutEvent.currentTarget
      assertIsDefined(currentTarget, "normalized focusout current target")

      if (!document.hasFocus()) {
        deferredCallbacks.push({
          focusOut: focusOutEvent,
          currentTarget,
          handler
        })
        return
      }

      const listenerForFocusOut = currentTarget
      assertIsElement(listenerForFocusOut, "focusout current target")

      // Only call handler if the element gaining focus is not within currentTarget
      if (
        !isElement(focusOutEvent.relatedTarget) ||
        !listenerForFocusOut.contains(focusOutEvent.relatedTarget)
      ) {
        handler.call(null, focusOutEvent, {
          currentTarget,
          docFocusIn: null
        })
      }
    }

  return normalizeFocusOutHandlerDef
})()

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
 */

/*--------------------------------------------*\
EVENT GROUP CONTROL UTILITIES
\*--------------------------------------------*/

/**
 * @typedef {keyof HTMLElementEventMap} HTMLElementEventName
 * @typedef {HTMLElementEventMap[keyof HTMLElementEventMap]} HTMLElementEvent
 */

/**
 * @template {HTMLElementEventName} [Ev=HTMLElementEventName]
 * @typedef {{
 *   element: HTMLElement,
 *   event: Ev,
 *   isTargetEvent?: (event: HTMLElementEventMap[Ev]) => boolean
 *   capture?: boolean,
 *   position?: "before" | "after" | null
 * }} EventGroupMemberRelation
 */

/**
 * @template {HTMLElementEventName} [Ev=HTMLElementEventName]
 * @typedef {{
 *   element: HTMLElement,
 *   event: HTMLElementEventMap[Ev],
 *   captured: boolean,
 *   eventIndex: number
 * }} EventDetail
 */

/**
 * @template {HTMLElementEventName} [Ev=HTMLElementEventName]
 * @typedef {Map<Ev, EventDetail<Ev>[]>} EventGroupMap
 */

/**
 * @template {HTMLElementEventName} [Ev=HTMLElementEventName]
 * @typedef {{
 *   elements: HTMLElement[],
 *   event: Ev,
 *   isTargetEvent?: (event: HTMLElementEventMap[Ev]) => boolean
 *   capture?: boolean,
 *   onDetection?: { skipEventHandler?: boolean },
 *   position?: "before" | "after" | null
 * }} EventGroupMember
 */

/**
 * Controls an event based on other events fired alongside it. For example, a
 * blur event is always accompanied by a focusout event, and optionally by a
 * focusin and focus events. Other events like click could also be fired in the
 * same group if a click on a focusable element triggered the blur. This
 * function allows for controlling an event based on other associated events.
 *
 * @typedef {{
 *   <
 *     TargetEvent extends HTMLElementEvent,
 *     ExtraParams extends any[],
 *     Ev extends HTMLElementEventName
 *   >(config: {
 *     eventHandler: (
 *       event: TargetEvent,
 *       groupMap: EventGroupMap,
 *       ...extras: ExtraParams
 *     ) => any,
 *     currentTarget?: HTMLElement,
 *     members?: [EventGroupMember<Ev>]
 *   }): (event: TargetEvent, ...extras: ExtraParams) => void,
 *   <
 *     TargetEvent extends HTMLElementEvent,
 *     ExtraParams extends any[],
 *     Ev1 extends HTMLElementEventName,
 *     Ev2 extends HTMLElementEventName
 *   >(config: {
 *     eventHandler: (
 *       event: TargetEvent,
 *       groupMap: EventGroupMap,
 *       ...extras: ExtraParams
 *     ) => any,
 *     currentTarget?: HTMLElement,
 *     members?: [EventGroupMember<Ev1>, EventGroupMember<Ev2>]
 *   }): (event: TargetEvent, ...extras: ExtraParams) => void,
 * }} CreateEventGroupcontrol
 */

/**
 * @type {CreateEventGroupcontrol}
 * @template {HTMLElementEvent} TargetEvent
 * @template {any[]} ExtraParams
 * @param {{
 *   eventHandler: (
 *     event: TargetEvent,
 *     groupMap: EventGroupMap,
 *     ...extras: ExtraParams
 *   ) => any,
 *   currentTarget?: HTMLElement,
 *   members?: EventGroupMember[]
 * }} config
 */
const createGroupControlledEventHandler = (config) => {
  /**
   * @typedef {{
   *   isDetected: false,
   *   index: null
   * } | {
   *   isDetected: true,
   *   index: number,
   *   event: TargetEvent,
   *   extraParams: ExtraParams,
   * }} TargetEventInfo
   */

  const eventGroup = {
    isOngoing: false,
    targetEvent: /** @type {TargetEventInfo} */ ({
      isDetected: false,
      index: null,
      event: null
    }),
    nextEventIndex: 0,
    map: /** @type {EventGroupMap} */ (new Map())
  }

  const resetEventGroup = () => {
    eventGroup.isOngoing = false
    eventGroup.targetEvent = { isDetected: false, index: null }
    eventGroup.nextEventIndex = 0
    eventGroup.map.clear()
  }

  const handleGroupCallbackEnd = () => {
    const { targetEvent } = eventGroup
    if (!targetEvent.isDetected) {
      resetEventGroup()
      return
    }

    if (config.members) {
      const shouldOmitHandlerCall = config.members.some((member) => {
        const eventDetails = eventGroup.map.get(member.event)
        const memberTriggersOmission =
          member.onDetection?.skipEventHandler ?? false

        const memberIsDetected =
          eventDetails &&
          eventDetails.some((evDetail) => {
            const captureIsSame = evDetail.captured === member.capture
            const elemIsMemberElem = member.elements.includes(evDetail.element)

            const positionConstraintIsMet =
              !member.position ||
              (member.position === "after" &&
                evDetail.eventIndex > targetEvent.index) ||
              (member.position === "before" &&
                evDetail.eventIndex < targetEvent.index)

            const isTargetEvent =
              !member.isTargetEvent || member.isTargetEvent(evDetail.event)

            return (
              captureIsSame &&
              elemIsMemberElem &&
              positionConstraintIsMet &&
              isTargetEvent
            )
          })

        return memberTriggersOmission && (memberIsDetected ?? false)
      })

      if (shouldOmitHandlerCall) {
        resetEventGroup()
        return
      }
    }

    config.eventHandler.call(
      null,
      targetEvent.event,
      eventGroup.map,
      ...targetEvent.extraParams
    )
    resetEventGroup()
  }

  /**
   * @type {(member: {
   *   eventName: HTMLElementEventName,
   *   event: Event,
   *   element: HTMLElement,
   *   captured: boolean
   * }) => number}
   */
  const addEventGroupMember = ({ element, eventName, event, captured }) => {
    if (!eventGroup.isOngoing) {
      eventGroup.isOngoing = true
      setTimeout(handleGroupCallbackEnd)
    }

    /** @type {EventDetail[]} */
    let eventList

    if (!eventGroup.map.has(eventName)) {
      eventList = []
      eventGroup.map.set(eventName, eventList)
    } else {
      const existing = eventGroup.map.get(eventName)

      assertIsDefined(
        existing,
        `existing events config for event: '${eventName}' in event group`
      )

      eventList = existing
    }

    const similarEventDetail = eventList.find(
      (existingDetail) =>
        existingDetail.element === element &&
        existingDetail.captured === captured
    )

    if (similarEventDetail) return similarEventDetail.eventIndex

    const eventIndex = eventGroup.nextEventIndex

    eventList.push({
      element,
      event,
      captured,
      eventIndex
    })

    eventGroup.nextEventIndex += 1
    return eventIndex
  }

  config.members?.forEach(({ capture, elements, event }) => {
    const eventName = event
    const captureEvent = capture ?? false

    elements.forEach((element) => {
      element.addEventListener(
        eventName,
        (ev) => {
          addEventGroupMember({
            eventName,
            event: ev,
            element,
            captured: captureEvent
          })
        },
        { capture: captureEvent }
      )
    })
  })

  /** @type {(event: TargetEvent, ...extras: ExtraParams) => void} */
  return (event, ...extras) => {
    const element = config.currentTarget ?? event.currentTarget
    const eventType = /** @type {HTMLElementEventName} */ (event.type)

    assertIsDefined(element, "current target of group-controlled event")
    assertIsHTMLElement(element, "current target of group-controlled event")

    const index = addEventGroupMember({
      eventName: eventType,
      event,
      element,
      captured: event.eventPhase === Event.CAPTURING_PHASE
    })

    eventGroup.targetEvent = {
      isDetected: true,
      index,
      event,
      extraParams: extras
    }
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
 */

/*--------------------------------------------*\
BASE COMPONENT
\*--------------------------------------------*/

/**
 * This type defines properties that an element can be checked against.
 * CSS properties are checked in inline styles, to make sure the style is applied.
 *
 * For CSS properties:
 * - A string value means the property must be that exact string.
 * - A null value means the property should not exist.
 *
 * @typedef {{
 *   cssProperties?: { name: string, value: string | null }[]
 *   htmlAttributes?: { name: string, value: string | boolean }[]
 * }} UIElementManagedPropertySet
 *
 * @typedef {UIElementManagedPropertySet & {
 *   variableHTMLAttributes?: {
 *     name: string,
 *     type: "non-empty-string" | "integer" | "positive-integer" | "non-negative-integer"
 *   }[]
 * }} UIElementStaticPropertySet
 *
 * @typedef {Record<
 *   string,
 *   UIElementManagedPropertySet | Record<string, UIElementManagedPropertySet>[]
 * >} UIComponentManagedElementPropertySets
 *
 * @typedef {Record<
 *   string,
 *   UIElementStaticPropertySet | Record<string, UIElementStaticPropertySet>[]
 * >} UIComponentStaticElementPropertySets
 */

/**
 * @type {(
 *   propertySet: UIElementManagedPropertySet | UIElementStaticPropertySet
 * ) => propertySet is UIElementStaticPropertySet}
 */
const isUIElementStaticPropertySet = (propertySet) => {
  const isStatic =
    typeof (
      /** @type {UIElementStaticPropertySet} */ (propertySet)
        .variableHTMLAttributes
    ) !== "object"
  return isStatic
}

/**
 * @typedef {{ __refs: Record<string, HTMLElement>, [key: string]: unknown }} ElementSetArrayItem
 * @typedef {Record<string, HTMLElement | ElementSetArrayItem[]>} ElementSet
 * @typedef {{elements: ElementSet}} UIComponentConfig
 * @typedef {Record<string, unknown>} UIComponentState
 *
 * @typedef {{
 *   constructionStage: (typeof UIComponent.ConstructionStages)[
 *     keyof typeof UIComponent.ConstructionStages
 *   ]
 * }} UIComponentMeta
 */

/**
 * This class is used as an abstract class that actual
 * UI components extend.
 *
 * @template {UIComponentConfig} [Config=UIComponentConfig]
 * @template {UIComponentState} [State=UIComponentState]
 */
class UIComponent {
  /** @readonly */
  static ConstructionStages = /** @type {const} */ ({
    SettingConfig: 0,
    SettingState: 1,
    ValidatingStaticMarkup: 2,
    SettingUpEventHandlers: 3,
    Rendering: 4,
    Completed: 5
  })

  /**
   * @readonly
   * @type {Record<string, `--${string}`>}
   */
  static CSSVariables = {}

  /**
   * This verifies that the set of attributes (HTML attributes
   * and inline CSS properties) on an element are of the required shape.
   * It is used to make sure that initial HTML is what it should be.
   *
   * @type {(
   *   element: HTMLElement,
   *   propertySet: UIElementManagedPropertySet | UIElementStaticPropertySet
   * ) => void}
   */
  static assertValidElementProperties(element, propertySet) {
    const { cssProperties, htmlAttributes } = propertySet

    cssProperties?.forEach((property) => {
      const elementPropertyValue = element.style.getPropertyValue(property.name)
      if (
        typeof property.value === "string" &&
        elementPropertyValue !== property.value
      ) {
        throw new Error(
          `Expected element: '${getElementString(
            element
          )}' to have inline CSS property '${property.name}: ${property.value}'`
        )
      } else if (property.value === null && elementPropertyValue !== "") {
        // Property value should be the empty string to signify that inline property
        // doesn't exist
        throw new Error(
          `Expected element: '${getElementString(
            element
          )}' not to have inline CSS property '${property.name}'`
        )
      }
    })

    htmlAttributes?.forEach((attribute) => {
      const elementAttributeValue = element.getAttribute(attribute.name)

      if (
        typeof attribute.value === "string" &&
        elementAttributeValue !== attribute.value
      ) {
        throw new Error(
          `Expected element: '${getElementString(
            element
          )}' to have attribute '${attribute.name}' = '${attribute.value}'`
        )
      } else if (typeof attribute.value === "boolean") {
        const elementHasAttribute = element.hasAttribute(attribute.name)

        if (attribute.value === true && !elementHasAttribute) {
          throw new Error(
            `Expected element: '${getElementString(
              element
            )}' to have attribute '${attribute.name}'`
          )
        } else if (attribute.value === false && elementHasAttribute) {
          throw new Error(
            `Expected element: '${getElementString(
              element
            )}' not to have attribute '${attribute.name}'`
          )
        }
      }
    })

    if (!isUIElementStaticPropertySet(propertySet)) return

    propertySet.variableHTMLAttributes?.forEach((attribute) => {
      /**
       * Trigger error throwing attribute getting functions
       */

      if (attribute.type === "non-empty-string")
        forceGetElementNonEmptyAttribute(element, attribute.name)
      else if (attribute.type === "integer")
        forceGetElementIntegerAttribute(element, attribute.name, "any")
      else if (attribute.type === "non-negative-integer")
        forceGetElementIntegerAttribute(element, attribute.name, "non-negative")
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      else if (attribute.type === "positive-integer")
        forceGetElementIntegerAttribute(element, attribute.name, "positive")
    })
  }

  /**
   * This creates an instance of a component without having to use `new`.
   *
   * @type {<T1 extends UIComponent, T2 extends new (...args: any[]) => T1>(
   *   this: T2,
   *   ...args: ConstructorParameters<T2>
   * ) => T1}
   */
  static create(...params) {
    return new this(...params)
  }

  /**
   * This is used to verify that the set of attributes (HTML attributes
   * and inline CSS properties) on an element are of the required shape.
   *
   * @type {(element: HTMLElement, properties: UIElementManagedPropertySet) => void}
   */
  static setElementProperties(element, properties) {
    const { cssProperties, htmlAttributes } = properties

    /**
     * Allow deferring element hiding for animations.
     * Other properties are first set in case they trigger animations.
     *
     * @type {("CSS_DISPLAY_NONE"|"HTML_HIDDEN")[]}
     */
    const deferredHidingProperties = []

    htmlAttributes?.forEach((attribute) => {
      if (attribute.name === "hidden" && attribute.value === true) {
        deferredHidingProperties.push("HTML_HIDDEN")
        return
      }

      setElementHTMLAttribute(element, attribute.name, attribute.value)
    })

    cssProperties?.forEach((property) => {
      if (property.name === "display" && property.value === "none") {
        deferredHidingProperties.push("CSS_DISPLAY_NONE")
        return
      }

      setElementInlineCSSProperty(element, property.name, property.value)
    })

    const setDeferredHidingProperties = () => {
      deferredHidingProperties.forEach((property) => {
        if (property === "HTML_HIDDEN") element.setAttribute("hidden", "")
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        else if (property === "CSS_DISPLAY_NONE") {
          element.style.setProperty("display", "none")
        }
      })
    }

    if (deferredHidingProperties.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.all(
        element.getAnimations().map((animation) => animation.finished)
      ).then(setDeferredHidingProperties)
    }
  }

  /** @type {(extender: new (...args: any[]) => UIComponent ) => void} */
  static validateExtender(extender) {
    const constructor = /** @type {typeof UIComponent} */ (extender)

    // The type below causes an error because `keyof` only works with public properties
    // /** @type {(keyof UIComponent)[]} */
    const REQUIRED_METHODS = /** @type {const} */ ([
      "getStaticElementPropertySets",
      "getManagedElementPropertySets",
      "_doElementsStaticMarkupValidation",
      "_doEventHandlerSetup",
      "render"
    ])

    REQUIRED_METHODS.forEach((method) => {
      if (constructor.prototype[method] === UIComponent.prototype[method]) {
        throw new Error(
          `Expected '${constructor.name}' to implement '${method}()'`
        )
      }
    })
  }

  /**
   * @param {Config} config
   * @param {State} state
   */
  constructor(config, state) {
    if (new.target === UIComponent) {
      throw new Error("'UIComponent' must be extended")
    }

    /**
     * @protected
     * @type {UIComponentMeta}
     */
    this._meta = {
      constructionStage: UIComponent.ConstructionStages.SettingConfig
    }

    /**
     * @readonly
     * @protected
     * @type {Config}
     */
    this._config = config

    this._meta = {
      constructionStage: UIComponent.ConstructionStages.SettingState
    }

    /**
     * @protected
     * @type {State}
     */
    this._state = state

    this._meta = {
      constructionStage: UIComponent.ConstructionStages.ValidatingStaticMarkup
    }
    // Validate Static HTML markup
    this._doElementsStaticMarkupValidation()

    this._meta = {
      constructionStage: UIComponent.ConstructionStages.SettingUpEventHandlers
    }
    // Setup event handlers
    this._doEventHandlerSetup()

    this._meta = { constructionStage: UIComponent.ConstructionStages.Rendering }
    this.render()

    this._meta = { constructionStage: UIComponent.ConstructionStages.Completed }
  }

  /**
   * Verifies that default element properties (managed and static) are correct.
   *
   * @protected
   * @returns {void}
   */
  _doElementsStaticMarkupValidation() {
    throw new Error(
      `Expected '${this.constructor.name}' to implement '_doElementsStaticMarkupValidation()'`
    )
  }

  /**
   * @protected
   * @returns {void}
   */
  _doEventHandlerSetup() {
    throw new Error(
      `Expected '${this.constructor.name}' to implement '_doEventHandlerSetup()'`
    )
  }

  /**
   * Meant to calculate properties to be set on element based on component state.
   * Only properties (HTML attributes and CSS properties) affected by state go here.
   *
   * @type {() => UIComponentManagedElementPropertySets}
   */
  getManagedElementPropertySets() {
    throw new Error(
      `Expected '${this.constructor.name}' to implement 'getElementProperties()'`
    )
  }

  /**
   * This method is meant to be used to validate static HTML markup for necessary
   * accessibility related attributes. It should be used to verify only absolutely
   * mandatory properties for the component. Usually WAI-ARIA HTML attributes.
   *
   * @type {() => UIComponentStaticElementPropertySets}
   */
  getStaticElementPropertySets() {
    throw new Error(
      `Expected '${this.constructor.name}' to implement 'getElementProperties()'`
    )
  }

  /**
   * This method sets appropriate managed element properties (HTML attributes
   * and inline CSS properties on elements of a UI component based on the
   * current state).
   *
   * @returns {void}
   */
  render() {
    throw new Error(
      `Expected '${this.constructor.name}' to implement 'render()'`
    )
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
 */

/*--------------------------------------------*\
POPOVER
\*--------------------------------------------*/

/** @typedef {{isOpen: boolean, controller: "default" | "event"}} PopoverState */

/**
 * @template {{elements: { trigger: HTMLElement; content: HTMLElement }}} Config
 * @extends {UIComponent<Config, PopoverState>}
 */
class Popover extends UIComponent {
  /** @param {Config} config */
  constructor(config) {
    /** @type {PopoverState} */
    const DEFAULT_STATE = { isOpen: false, controller: "default" }
    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const mp = this.getManagedElementPropertySets()
    const sp = this.getStaticElementPropertySets()

    const { elements } = this._config

    /**
     * Enforce correct static HTML markup
     */
    UIComponent.assertValidElementProperties(elements.trigger, mp.trigger)
    UIComponent.assertValidElementProperties(elements.trigger, sp.trigger)
    UIComponent.assertValidElementProperties(elements.content, mp.content)
    UIComponent.assertValidElementProperties(elements.content, sp.content)
  }

  /** @protected */
  _doEventHandlerSetup() {
    const { elements } = this._config

    bindRedefinedClickEvent({
      element: elements.trigger,
      handler: () => {
        this._handleTriggerRedefinedClick()
      }
    })

    elements.content.addEventListener("keydown", (event) => {
      if (event.key === A11y.AriaKeys.Escape) this._handleContentEscape()
      else if (event.key === A11y.AriaKeys.Tab) {
        this._handleContentTabKeyPress(event)
      }
    })

    const normalizedContentFocusOutHandler = createdNormalizedFocusOutHandler({
      currentTarget: elements.content,
      handler: () => {
        this._handleContentNormalizedFocusOutNonTriggerClick()
      }
    })

    elements.content.addEventListener(
      "focusout",
      createGroupControlledEventHandler({
        currentTarget: elements.content,
        members: [
          {
            elements: [elements.trigger],
            event: "mousedown",
            capture: true,
            onDetection: { skipEventHandler: true },
            position: "before",
            isTargetEvent: (ev) => isClickEvent(ev)
          }
        ],

        eventHandler: (ev) => {
          normalizedContentFocusOutHandler.call(null, ev)
        }
      })
    )
  }

  /** @protected */
  _handleContentEscape() {
    const { _config: config, _state: state } = this
    if (!state.isOpen) return

    this._state = /** @satisfies {PopoverState} */ ({
      isOpen: false,
      controller: "event"
    })

    this.render()
    attemptElementFocus(config.elements.trigger)
  }

  /** @protected */
  _handleContentNormalizedFocusOutNonTriggerClick() {
    const { _state: state } = this
    if (!state.isOpen) return

    this._state = /** @satisfies {PopoverState} */ ({
      isOpen: false,
      controller: "event"
    })
    this.render()
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   */
  _handleContentTabKeyPress(event) {
    const { _config: config, _state: state } = this
    if (!state.isOpen) return

    event.preventDefault()
    const { content } = config.elements
    assertIsHTMLElement(document.activeElement, "document active element")

    const focused = event.shiftKey
      ? focusPrevTabbableBefore(document.activeElement, content)
      : focusNextTabbableAfter(document.activeElement, content)

    /** Wrap focus within content */
    if (!focused) {
      const focusWrapped = event.shiftKey
        ? focusLastTabbableIn(content)
        : focusFirstTabbableIn(content)

      if (!focusWrapped) attemptElementFocus(content)
    }
  }

  /**
   * @protected
   */
  _handleTriggerRedefinedClick() {
    const { _config: config, _state: state } = this
    if (state.isOpen) {
      this._state = /** @satisfies {PopoverState} */ ({
        isOpen: false,
        controller: "event"
      })

      this.render()
      return
    }

    this._state = /** @satisfies {PopoverState} */ ({
      isOpen: true,
      controller: "event"
    })

    this.render()

    setTimeout(() => {
      // Necessary since redefined click uses mousedown and keydown and those fire
      // very early so setting focus synchronously may not work
      if (
        document.activeElement &&
        document.activeElement.contains(config.elements.trigger) &&
        this._state.isOpen
      ) {
        focusFirstTabbableIn(config.elements.content)
      }
    })
  }

  getManagedElementPropertySets() {
    const {
      _state: { isOpen, controller }
    } = this

    const ariaExpanded = isOpen ? "true" : "false"
    const dataState = isOpen ? "open" : "closed"
    const display = isOpen ? null : "none"

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      trigger: {
        htmlAttributes: [
          { name: "aria-expanded", value: ariaExpanded },
          { name: "data-state", value: dataState },
          { name: "data-controller", value: controller }
        ]
      },

      content: {
        cssProperties: [{ name: "display", value: display }],
        htmlAttributes: [
          { name: "data-state", value: dataState },
          { name: "data-controller", value: controller }
        ]
      }
    }

    return properties
  }

  getStaticElementPropertySets() {
    const { elements } = this._config

    /** @satisfies {UIComponentStaticElementPropertySets} */
    const properties = {
      trigger: {
        htmlAttributes: [
          { name: "aria-haspopup", value: "dialog" },
          {
            name: "aria-controls",
            // Aria-controls should be the id of content
            value: forceGetElementNonEmptyAttribute(elements.content, "id")
          }
        ]
      },

      content: {
        variableHTMLAttributes: [{ name: "id", type: "non-empty-string" }],
        htmlAttributes: [
          { name: "tabindex", value: "-1" },
          { name: "role", value: "dialog" }
        ]
      }
    }

    return properties
  }

  render() {
    const properties = this.getManagedElementPropertySets()
    const { elements } = this._config

    UIComponent.setElementProperties(elements.trigger, properties.trigger)
    UIComponent.setElementProperties(elements.content, properties.content)
  }
}

UIComponent.validateExtender(Popover)

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
 */

/*--------------------------------------------*\
DROPDOWN MENU
\*--------------------------------------------*/

/**
 * @typedef {{
 *   isOpen: boolean,
 *   currentItemIndex: number | null,
 *   controller: "default" | "event"
 * }} DropdownMenuState
 */

/**
 * @template {{elements: {
 *   trigger: HTMLElement,
 *   content: HTMLElement,
 *   items: { __refs: { root: HTMLElement } }[]
 * }}} Config
 *
 * @extends {UIComponent<Config, DropdownMenuState>}
 */
class DropdownMenu extends UIComponent {
  /** @param {Config} config */
  constructor(config) {
    if (config.elements.items.length < 1) {
      throw new Error("Expected one or more menu items")
    }

    /** @type {DropdownMenuState} */
    const DEFAULT_STATE = {
      isOpen: false,
      currentItemIndex: null,
      controller: "default"
    }
    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const {
      _config: { elements }
    } = this

    const sp = this.getStaticElementPropertySets()
    const mp = this.getManagedElementPropertySets()

    UIComponent.assertValidElementProperties(elements.trigger, sp.trigger)
    UIComponent.assertValidElementProperties(elements.trigger, mp.trigger)
    UIComponent.assertValidElementProperties(elements.content, sp.content)
    UIComponent.assertValidElementProperties(elements.content, mp.content)

    elements.items.forEach(({ __refs: item }, index) => {
      const staticProps = sp.items[index]
      const managedProps = mp.items[index]
      if (!staticProps || !managedProps) return

      UIComponent.assertValidElementProperties(item.root, staticProps.root)
      UIComponent.assertValidElementProperties(item.root, managedProps.root)
    })
  }

  /** @protected */
  _doEventHandlerSetup() {
    const {
      _config: { elements }
    } = this

    bindRedefinedClickEvent({
      element: elements.trigger,
      handler: () => {
        this._handleTriggerRedefinedClick()
      }
    })

    const normalizedContentFocusOutHandler = createdNormalizedFocusOutHandler({
      currentTarget: elements.content,
      handler: (ev) => {
        this._handleContentNormalizedFocusOutNonTriggerClick(ev)
      }
    })

    elements.content.addEventListener(
      "focusout",
      createGroupControlledEventHandler({
        currentTarget: elements.content,
        members: [
          {
            elements: [elements.trigger],
            event: "mousedown",
            capture: true,
            onDetection: { skipEventHandler: true },
            position: "before",
            isTargetEvent: (ev) => ev.button === 0
          }
        ],

        eventHandler: (ev) => {
          normalizedContentFocusOutHandler.call(null, ev)
        }
      })
    )

    elements.content.addEventListener("keydown", (event) => {
      if (event.key === A11y.AriaKeys.Escape) this._handleContentEscape()
      else if (event.key === A11y.AriaKeys.Tab) {
        this._handleContentTabKeyPress(event)
      } else if (
        event.key === A11y.AriaKeys.ArrowUp ||
        event.key === A11y.AriaKeys.ArrowDown
      ) {
        const key =
          event.key === A11y.AriaKeys.ArrowUp ? "arrow-up" : "arrow-down"
        this._handleContentArrowKeyPress(event, key)
      } else if (
        event.key === A11y.AriaKeys.Home ||
        event.key === A11y.AriaKeys.End
      ) {
        const key = event.key === A11y.AriaKeys.Home ? "home" : "end"
        this._handleContentHomeEndKeyPress(event, key)
      }
      // When a letter is pressed while in menu
      else if (/[a-z]/.test(event.key)) {
        this._handleContentLetterPress(event.key)
      }
    })

    elements.items.forEach(({ __refs: { root: item } }) => {
      item.addEventListener("click", () => {
        this._handleItemClick()
      })

      item.addEventListener("pointerenter", (event) => {
        this._handleItemPointerEnter(event)
      })

      item.addEventListener("pointerleave", (event) => {
        this._handleItemPointerLeave(event)
      })
    })
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   * @param {"arrow-up" | "arrow-down"} key
   */
  _handleContentArrowKeyPress(event, key) {
    const { _state: state, _config: config } = this
    if (!state.isOpen) return

    event.preventDefault()
    const { currentItemIndex } = state
    const { elements } = config

    /** @type {number} */
    let indexToFocus

    if (key === "arrow-up") {
      if (currentItemIndex === null) {
        indexToFocus = elements.items.length - 1
      } else {
        indexToFocus =
          currentItemIndex <= 0
            ? elements.items.length - 1
            : currentItemIndex - 1
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (currentItemIndex === null) {
        indexToFocus = 0
      } else {
        indexToFocus =
          currentItemIndex >= elements.items.length - 1
            ? 0
            : currentItemIndex + 1
      }
    }

    this._state = /** @type {const} */ {
      ...state,
      currentItemIndex: indexToFocus
    }
    this.render()

    const itemToFocus = elements.items[indexToFocus]?.__refs.root
    assertIsDefined(itemToFocus, `menu item at index: ${indexToFocus}`)
    attemptElementFocus(itemToFocus)
  }

  /** @protected */
  _handleContentEscape() {
    const { _config: config, _state: state } = this
    if (!state.isOpen) return

    this._state = /** @type {const} */ ({
      isOpen: false,
      currentItemIndex: null,
      controller: "event"
    })

    this.render()
    attemptElementFocus(config.elements.trigger)
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   * @param {"home" | "end"} key
   */
  _handleContentHomeEndKeyPress(event, key) {
    const { _config: config, _state: state } = this
    if (!state.isOpen) return

    event.preventDefault()
    const indexToFocus = key === "home" ? 0 : config.elements.items.length - 1
    this._state.currentItemIndex = indexToFocus
    this.render()

    const itemToFocus = config.elements.items[indexToFocus]?.__refs.root
    assertIsDefined(itemToFocus, `menu item at index: ${indexToFocus}`)
    attemptElementFocus(itemToFocus)
  }

  /**
   * @protected
   * @param {string} letter
   */
  _handleContentLetterPress(letter) {
    const { _state: state, _config: config } = this
    if (!state.isOpen) return

    const indexToFocus = config.elements.items.findIndex(
      ({ __refs: { root: item } }) => {
        const itemTextStartsWithLetter = item.innerText
          .toLowerCase()
          .startsWith(letter.toLowerCase())
        return itemTextStartsWithLetter
      }
    )

    if (indexToFocus < 0) return
    this._state.currentItemIndex = indexToFocus
    this.render()

    const itemToFocus = config.elements.items[indexToFocus]?.__refs.root
    assertIsDefined(itemToFocus, `menu item at index: ${indexToFocus}`)
    attemptElementFocus(itemToFocus)
  }

  /**
   * @protected
   * @param {FocusEvent} event
   */
  _handleContentNormalizedFocusOutNonTriggerClick(event) {
    const { _state: state, _config: config } = this
    if (!state.isOpen) return

    this._state = /** @type {const} */ ({
      isOpen: false,
      currentItemIndex: null,
      controller: "event"
    })
    this.render()

    const nextFocus = event.relatedTarget

    /**
     * Focus trigger is focused element is only focusable programmatically (e.g. body).
     */
    if (!isHTMLElement(nextFocus) || nextFocus.tabIndex < 0) {
      attemptElementFocus(config.elements.trigger)
    }
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   */
  _handleContentTabKeyPress(event) {
    const { _state: state } = this
    if (!state.isOpen) return
    event.preventDefault()
  }

  /** @protected */
  _handleItemClick() {
    const { _config: config, _state: state } = this
    if (!state.isOpen) return

    this._state = /** @satisfies {DropdownMenuState} */ ({
      isOpen: false,
      currentItemIndex: null,
      controller: "event"
    })

    this.render()
    attemptElementFocus(config.elements.trigger)
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _handleItemPointerEnter(event) {
    const { _state: state, _config: config } = this
    if (!state.isOpen) return

    const itemIndex = config.elements.items.findIndex(
      ({ __refs: { root: item } }) => event.currentTarget === item
    )

    this._state = /** @type {const} */ ({
      ...state,
      currentItemIndex: itemIndex
    })

    this.render()
    assertIsHTMLElement(
      event.currentTarget,
      "dropdown item pointer enter event current target"
    )

    attemptElementFocus(event.currentTarget)
  }

  /**
   * @protected
   * @param {PointerEvent} event
   */
  _handleItemPointerLeave(event) {
    const { _state: state, _config: config } = this
    if (!state.isOpen) return

    /**
     * If the pointer entered another item, we shouldn't bother
     * because that event will do the appropriate state changes
     */
    const shouldReturn = config.elements.items.some(
      ({ __refs: { root: item } }) => {
        const willHandleEnterEvent =
          event.relatedTarget instanceof Node &&
          item.contains(event.relatedTarget)
        return willHandleEnterEvent
      }
    )

    if (shouldReturn) return

    this._state = /** @type {const} */ ({ ...state, currentItemIndex: null })
    this.render()
    attemptElementFocus(config.elements.content)
  }

  /**
   * @protected
   */
  _handleTriggerRedefinedClick() {
    const { _config: config, _state: state } = this

    if (state.isOpen) {
      this._state = /** @satisfies {DropdownMenuState} */ ({
        isOpen: false,
        currentItemIndex: null,
        controller: "event"
      })

      this.render()
      return
    }

    const DEFAULT_ITEM_INDEX = 0

    this._state = /** @satisfies {DropdownMenuState} */ ({
      isOpen: true,
      currentItemIndex: DEFAULT_ITEM_INDEX,
      controller: "event"
    })

    this.render()

    const defaultItem = config.elements.items[DEFAULT_ITEM_INDEX]?.__refs.root
    assertIsDefined(defaultItem, "first menu item")

    setTimeout(() => {
      // Necessary since redefined click uses mousedown and keydown and those fire
      // very early so setting focus synchronously may not work
      if (
        document.activeElement &&
        document.activeElement.contains(config.elements.trigger) &&
        this._state.isOpen
      ) {
        attemptElementFocus(defaultItem)
      }
    })
  }

  getManagedElementPropertySets() {
    const { _state: state, _config: config } = this

    const ariaExpanded = state.isOpen ? "true" : "false"
    const dataState = state.isOpen ? "open" : "closed"
    const display = state.isOpen ? null : "none"

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      trigger: {
        htmlAttributes: [
          { name: "aria-expanded", value: ariaExpanded },
          { name: "data-state", value: dataState },
          { name: "data-controller", value: state.controller }
        ]
      },

      content: {
        cssProperties: [{ name: "display", value: display }],
        htmlAttributes: [
          { name: "data-state", value: dataState },
          { name: "data-controller", value: state.controller }
        ]
      },

      items: config.elements.items.map((item, index) => {
        const tabIndex = state.currentItemIndex === index ? "0" : "-1"
        const highlighted = state.currentItemIndex === index ? "true" : "false"

        return {
          root: {
            htmlAttributes: [
              { name: "tabindex", value: tabIndex },
              { name: "data-highlighted", value: highlighted }
            ]
          }
        }
      })
    }

    return properties
  }

  getStaticElementPropertySets() {
    const { elements } = this._config

    /** @satisfies {UIComponentStaticElementPropertySets} */
    const staticProperties = {
      trigger: {
        htmlAttributes: [
          { name: "aria-haspopup", value: "true" },
          {
            name: "aria-controls",
            value: forceGetElementNonEmptyAttribute(elements.content, "id")
          }
        ]
      },

      content: {
        variableHTMLAttributes: [{ name: "id", type: "non-empty-string" }],
        htmlAttributes: [
          { name: "role", value: "menu" },
          { name: "tabindex", value: "-1" },
          { name: "aria-orientation", value: "vertical" }
        ]
      },

      items: elements.items.map(() => ({
        root: {
          htmlAttributes: [{ name: "role", value: "menuitem" }]
        }
      }))
    }

    return staticProperties
  }

  render() {
    const props = this.getManagedElementPropertySets()
    const { elements } = this._config

    UIComponent.setElementProperties(elements.trigger, props.trigger)
    UIComponent.setElementProperties(elements.content, props.content)

    elements.items.forEach(({ __refs: item }, index) => {
      const itemProps = props.items[index]
      if (!itemProps) return
      UIComponent.setElementProperties(item.root, itemProps.root)
    })
  }
}

UIComponent.validateExtender(DropdownMenu)

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
 */

/*--------------------------------------------*\
HIDEABLE
\*--------------------------------------------*/

/** @typedef {{ isHidden: boolean, controller: "default" | "event" }} HideableState */

/**
 * @template {{ elements: { trigger: HTMLElement, root: HTMLElement } }} Config
 * @extends {UIComponent<Config, HideableState>}
 */
class Hideable extends UIComponent {
  /** @param {Config} config */
  constructor(config) {
    const DEFAULT_STATE = /** @satisfies {HideableState} */ ({
      isHidden: false,
      controller: "default"
    })

    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const {
      _config: { elements }
    } = this

    const properties = this.getManagedElementPropertySets()
    UIComponent.assertValidElementProperties(elements.root, properties.root)
    UIComponent.assertValidElementProperties(
      elements.trigger,
      properties.trigger
    )
  }

  /** @protected */
  _doEventHandlerSetup() {
    const {
      _config: { elements }
    } = this

    elements.trigger.addEventListener("click", () => {
      this._handleTriggerClick()
    })
  }

  /** @protected */
  _handleTriggerClick() {
    const {
      _state: { isHidden }
    } = this

    this._state = /** @satisfies {HideableState} */ ({
      isHidden: !isHidden,
      controller: "event"
    })

    this.render()
  }

  getManagedElementPropertySets() {
    const {
      _state: { isHidden, controller }
    } = this

    const dataHidden = String(isHidden)
    const display = isHidden ? "none" : null

    const elementsHTMLAttributes = [
      { name: "data-hidden", value: dataHidden },
      { name: "data-controller", value: controller }
    ]

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      root: {
        cssProperties: [{ name: "display", value: display }],
        htmlAttributes: elementsHTMLAttributes
      },
      trigger: { htmlAttributes: elementsHTMLAttributes }
    }

    return properties
  }

  // eslint-disable-next-line class-methods-use-this
  getStaticElementPropertySets() {
    return {}
  }

  render() {
    const {
      _config: { elements }
    } = this

    const properties = this.getManagedElementPropertySets()
    UIComponent.setElementProperties(elements.trigger, properties.trigger)
    UIComponent.setElementProperties(elements.root, properties.root)
  }
}

UIComponent.validateExtender(Hideable)

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
 */

/*--------------------------------------------*\
PROGRESS
\*--------------------------------------------*/

/** @typedef {{ currentValue: number, controller: "default" | "api" }} ProgressState */

/**
 * @template {{
 *   max: number,
 *   value: number,
 *   getValueText?: (currentValue: number, max: number, min: number) => string,
 *   elements: {
 *     root: HTMLElement,
 *     indicator: HTMLElement
 *   }
 * }} Config
 *
 * @extends {UIComponent<Config & { min: 0 }, ProgressState>}
 */
class Progress extends UIComponent {
  static CSSVariables = /** @type {const} */ ({
    RootProgressPercent: "--ui-progress-percent"
  })

  /**
   * @type {(value: number, max: number, min: number) => void}
   */
  static assertProgressValueValidity(value, max, min) {
    if (!Number.isInteger(value)) {
      throw new Error(`Progress value must be an integer, got ${value}`)
    } else if (value < min || value > max) {
      throw new Error(
        `Expected value to be between min: ${min} and max: ${max}, got ${value}`
      )
    }
  }

  /** @param {Config} config */
  constructor(config) {
    const FIXED_PROGRESS_MIN = 0

    Progress.assertProgressValueValidity(
      config.value,
      config.max,
      FIXED_PROGRESS_MIN
    )

    const DEFAULT_STATE = /** @satisfies {ProgressState} */ ({
      controller: "default",
      currentValue: config.value
    })

    if (!Number.isInteger(config.max)) {
      throw new Error(
        `Expected progress max to be an integer, got ${String(config.max)}`
      )
    } else if (config.max <= FIXED_PROGRESS_MIN) {
      throw new Error(
        `Expected progress max to be greater than min value: ${FIXED_PROGRESS_MIN}, got ${String(
          config.max
        )}`
      )
    }

    super({ ...config, min: FIXED_PROGRESS_MIN }, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const {
      _config: { elements }
    } = this

    const sp = this.getStaticElementPropertySets()
    const mp = this.getManagedElementPropertySets()

    UIComponent.assertValidElementProperties(elements.root, sp.root)
    UIComponent.assertValidElementProperties(elements.root, mp.root)

    UIComponent.assertValidElementProperties(elements.indicator, sp.indicator)
    UIComponent.assertValidElementProperties(elements.indicator, mp.indicator)
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  _doEventHandlerSetup() {}

  getManagedElementPropertySets() {
    const {
      _config: { getValueText, max, min },
      _state: { currentValue, controller }
    } = this

    const sharedHTMLAttributes = [
      { name: "data-value", value: String(currentValue) },
      { name: "data-controller", value: controller }
    ]

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      root: {
        cssProperties: [
          {
            name: Progress.CSSVariables.RootProgressPercent,
            value: `${toPercent(currentValue, max, min)}`
          }
        ],
        htmlAttributes: [
          ...sharedHTMLAttributes,
          { name: "aria-valuenow", value: String(currentValue) },
          {
            name: "aria-valuetext",
            value: getValueText
              ? getValueText(currentValue, max, min)
              : `${toPercent(currentValue, max, min)}%`
          }
        ]
      },

      indicator: { htmlAttributes: [...sharedHTMLAttributes] }
    }

    return properties
  }

  getStaticElementPropertySets() {
    const {
      _config: { min, max }
    } = this

    const minAsString = String(min)
    const maxAsString = String(max)

    /** @satisfies {UIComponentStaticElementPropertySets} */
    const properties = {
      root: {
        htmlAttributes: [
          { name: "aria-valuemin", value: minAsString },
          { name: "aria-valuemax", value: maxAsString },
          { name: "role", value: "progressbar" },
          { name: "data-max", value: maxAsString }
        ]
      },

      indicator: {
        htmlAttributes: [{ name: "data-max", value: maxAsString }]
      }
    }

    return properties
  }

  render() {
    const {
      _config: { elements }
    } = this

    const properties = this.getManagedElementPropertySets()
    UIComponent.setElementProperties(elements.root, properties.root)
    UIComponent.setElementProperties(elements.indicator, properties.indicator)
  }

  /** @param {number} value */
  setCurrentValue(value) {
    const {
      _config: { max, min }
    } = this

    Progress.assertProgressValueValidity(value, max, min)

    this._state = /** @satisfies {ProgressState} */ ({
      currentValue: value,
      controller: "api"
    })

    this.render()
  }
}

UIComponent.validateExtender(Progress)

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
 */

/*--------------------------------------------*\
COLLAPSIBLE
\*--------------------------------------------*/

/** @typedef {{ isCollapsed: boolean, controller: "default" | "event" }} CollapsibleState */

/**
 * @template {{
 *   elements: {
 *     root: HTMLElement,
 *     trigger: HTMLButtonElement,
 *     content: HTMLElement,
 *     contentArea: HTMLElement
 *   }
 * }} Config
 *
 * @extends {UIComponent<Config, CollapsibleState>}
 */
class Collapsible extends UIComponent {
  static CSSVariables = /** @type {const} */ ({
    ContentHeight: "--ui-collapsible-content-height",
    ContentWidth: "--ui-collapsible-content-width"
  })

  /** @param {Config} config */
  constructor(config) {
    const DEFAULT_STATE = /** @satisfies {CollapsibleState} */ ({
      isCollapsed: false,
      controller: "default"
    })

    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const {
      _config: { elements }
    } = this

    const sp = this.getStaticElementPropertySets()
    const mp = this.getManagedElementPropertySets()

    UIComponent.assertValidElementProperties(elements.root, mp.root)

    UIComponent.assertValidElementProperties(elements.trigger, sp.trigger)
    UIComponent.assertValidElementProperties(elements.trigger, mp.trigger)

    UIComponent.assertValidElementProperties(elements.content, sp.content)
    UIComponent.assertValidElementProperties(elements.content, mp.content)
  }

  /** @protected */
  _doEventHandlerSetup() {
    const {
      _config: { elements }
    } = this

    elements.trigger.addEventListener("click", () => {
      this._handleTriggerClick()
    })

    const contentAreaResizeObserver = new ResizeObserver(() => {
      this._handleContentAreaResize()
    })

    contentAreaResizeObserver.observe(elements.contentArea, {
      box: "border-box"
    })
  }

  /** @protected */
  _handleContentAreaResize() {
    this.render()
  }

  /** @protected */
  _handleTriggerClick() {
    const {
      _state: { isCollapsed }
    } = this

    this._state = /** @satisfies {CollapsibleState} */ ({
      isCollapsed: !isCollapsed,
      controller: "event"
    })

    this.render()
  }

  getManagedElementPropertySets() {
    const {
      _config: { elements },
      _meta: { constructionStage },
      _state: { isCollapsed, controller }
    } = this

    const dataState = isCollapsed ? "closed" : "open"
    const ariaExpanded = `${!isCollapsed}`
    const display = isCollapsed ? "none" : null

    const sharedHTMLAttributes = [
      { name: "data-state", value: dataState },
      { name: "data-controller", value: controller }
    ]

    const shouldIncludeVars =
      constructionStage > UIComponent.ConstructionStages.ValidatingStaticMarkup

    const contentHeightCSSVar = shouldIncludeVars
      ? `${elements.contentArea.scrollHeight}px`
      : null

    const contentWidthCSSVar = shouldIncludeVars
      ? `${elements.contentArea.scrollWidth}px`
      : null

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      root: { htmlAttributes: [...sharedHTMLAttributes] },
      trigger: {
        htmlAttributes: [
          ...sharedHTMLAttributes,
          { name: "aria-expanded", value: ariaExpanded }
        ]
      },

      content: {
        htmlAttributes: [...sharedHTMLAttributes],
        cssProperties: [
          { name: "display", value: display },
          {
            name: Collapsible.CSSVariables.ContentHeight,
            value: contentHeightCSSVar
          },
          {
            name: Collapsible.CSSVariables.ContentWidth,
            value: contentWidthCSSVar
          }
        ]
      }
    }

    return properties
  }

  getStaticElementPropertySets() {
    const {
      _config: { elements }
    } = this

    /** @satisfies {UIComponentStaticElementPropertySets} */
    const properties = {
      content: {
        variableHTMLAttributes: [{ name: "id", type: "non-empty-string" }]
      },

      trigger: {
        htmlAttributes: [
          {
            name: "aria-controls",
            value: forceGetElementNonEmptyAttribute(elements.content, "id")
          }
        ]
      }
    }

    return properties
  }

  render() {
    const {
      _config: { elements }
    } = this

    const properties = this.getManagedElementPropertySets()

    UIComponent.setElementProperties(elements.root, properties.root)
    UIComponent.setElementProperties(elements.trigger, properties.trigger)
    UIComponent.setElementProperties(elements.content, properties.content)
  }
}

UIComponent.validateExtender(Collapsible)

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
 */

/*--------------------------------------------*\
CHECKBOX
\*--------------------------------------------*/

/**
 * @typedef {{
 *   isChecked: boolean,
 *   controller: "default" | "event"
 * }} CheckboxState
 */

/**
 * @typedef {{
 *   onCheckedChange?: (checked: boolean) => void,
 *     elements: {
 *       root: HTMLButtonElement,
 *       indicator: HTMLElement
 *     }
 * }} CheckboxConfig
 */

/**
 * @template {CheckboxConfig} Config
 * @extends {UIComponent<Config, CheckboxState>}
 */
class Checkbox extends UIComponent {
  /** @param {Config} config */
  constructor(config) {
    const DEFAULT_STATE = /** @satisfies {CheckboxState} */ ({
      isChecked: false,
      controller: "default"
    })

    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const {
      _config: { elements }
    } = this

    const sp = this.getStaticElementPropertySets()
    const mp = this.getManagedElementPropertySets()

    UIComponent.assertValidElementProperties(elements.root, sp.root)
    UIComponent.assertValidElementProperties(elements.root, mp.root)
    UIComponent.assertValidElementProperties(elements.indicator, mp.indicator)
  }

  /** @protected */
  _doEventHandlerSetup() {
    const {
      _config: { elements }
    } = this

    elements.root.addEventListener("click", () => {
      this._handleRootClick()
    })
  }

  /** @protected */
  _handleRootClick() {
    const {
      _config: { onCheckedChange },
      _state: { isChecked }
    } = this

    this._state = /** @satisfies {CheckboxState} */ ({
      controller: "event",
      isChecked: !isChecked
    })

    this.render()
    if (onCheckedChange) onCheckedChange.call(null, this._state.isChecked)
  }

  // eslint-disable-next-line class-methods-use-this
  getStaticElementPropertySets() {
    /** @satisfies {UIComponentStaticElementPropertySets} */
    const properties = {
      root: {
        htmlAttributes: [{ name: "role", value: "checkbox" }]
      }
    }

    return properties
  }

  getManagedElementPropertySets() {
    const {
      _state: { isChecked }
    } = this

    const dataState = isChecked ? "checked" : "unchecked"

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      root: {
        htmlAttributes: [
          { name: "aria-checked", value: `${isChecked}` },
          { name: "data-state", value: dataState }
        ]
      },

      indicator: {
        htmlAttributes: [{ name: "data-state", value: dataState }]
      }
    }

    return properties
  }

  isChecked() {
    return this._state.isChecked
  }

  render() {
    const {
      _config: { elements }
    } = this

    const properties = this.getManagedElementPropertySets()
    UIComponent.setElementProperties(elements.root, properties.root)
    UIComponent.setElementProperties(elements.indicator, properties.indicator)
  }
}

UIComponent.validateExtender(Checkbox)

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
 */

/*--------------------------------------------*\
ACCORDION
\*--------------------------------------------*/

/**
 * @typedef {{
 *   currentItemIndex: number,
 *   controller: "default" | "event" | "api"
 * }} AccordionState
 */

/**
 * The accordion item content is mainly used to contain the content so the
 * dimensions are measurable. Therefore, it probably should be the only child of
 * the content element.
 *
 * @template {{
 *   defaultItem: string,
 *   elements: {
 *     items: {
 *       name: string,
 *       __refs: {
 *         root: HTMLElement,
 *         header: HTMLHeadingElement,
 *         trigger: HTMLButtonElement,
 *         content: HTMLElement,
 *         contentArea: HTMLElement
 *       }
 *     }[]
 *   }
 * }} Config
 *
 * @extends {UIComponent<Config, AccordionState>}
 */
class Accordion extends UIComponent {
  static CSSVariables = /** @type {const} */ ({
    ItemContentHeight: "--ui-accordion-item-content-height",
    ItemContentWidth: "--ui-accordion-item-content-width"
  })

  /** @param {Config} config */
  constructor(config) {
    if (config.elements.items.length < 1)
      throw new Error("Expected one or more accordion items")

    const currentItemIndex = config.elements.items.findIndex(
      ({ name }) => name === config.defaultItem
    )

    if (currentItemIndex === -1) {
      throw new Error(`No item with name: '${config.defaultItem}'`)
    }

    /** @type {AccordionState} */
    const DEFAULT_STATE = { currentItemIndex, controller: "default" }
    super(config, DEFAULT_STATE)
  }

  /** @protected */
  _doElementsStaticMarkupValidation() {
    const { elements } = this._config
    const staticProps = this.getStaticElementPropertySets()
    const managedProps = this.getManagedElementPropertySets()

    elements.items.forEach(({ __refs: item }, index) => {
      const sp = staticProps.items[index]
      const mp = managedProps.items[index]
      if (!sp || !mp) return

      UIComponent.assertValidElementProperties(item.root, mp.root)
      UIComponent.assertValidElementProperties(item.header, mp.header)

      UIComponent.assertValidElementProperties(item.trigger, sp.trigger)
      UIComponent.assertValidElementProperties(item.trigger, mp.trigger)

      UIComponent.assertValidElementProperties(item.content, sp.content)
      UIComponent.assertValidElementProperties(item.content, mp.content)
    })
  }

  /** @protected */
  _doEventHandlerSetup() {
    const { items } = this._config.elements
    items.forEach(({ __refs: item }, index) => {
      item.trigger.addEventListener("click", () => {
        this._handleItemTriggerClick(index)
      })

      item.trigger.addEventListener("keydown", (event) => {
        if (
          event.key === A11y.AriaKeys.ArrowUp ||
          event.key === A11y.AriaKeys.ArrowDown
        ) {
          const key =
            event.key === A11y.AriaKeys.ArrowUp ? "arrow-up" : "arrow-down"
          this._handleItemTriggerArrowKeyPress(event, index, key)
        } else if (
          event.key === A11y.AriaKeys.Home ||
          event.key === A11y.AriaKeys.End
        ) {
          const key = event.key === A11y.AriaKeys.Home ? "home" : "end"
          this._handleItemTriggerHomeEndKeyPress(event, index, key)
        }
      })

      const contentAreaResizeObserver = new ResizeObserver(() => {
        this._handleItemContentAreaResize()
      })

      contentAreaResizeObserver.observe(item.contentArea, { box: "border-box" })
    })
  }

  /** @protected */
  _handleItemContentAreaResize() {
    this.render()
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   * @param {number} itemIndex
   * @param {"arrow-up" | "arrow-down"} key
   */
  _handleItemTriggerArrowKeyPress(event, itemIndex, key) {
    event.preventDefault()

    const { items } = this._config.elements
    /** @type {number} */
    let triggerIndexToFocus

    if (key === "arrow-up") {
      if (itemIndex > 0) triggerIndexToFocus = itemIndex - 1
      else triggerIndexToFocus = items.length - 1
    } else {
      // eslint-disable-next-line no-lonely-if
      if (itemIndex < items.length - 1) triggerIndexToFocus = itemIndex + 1
      else triggerIndexToFocus = 0
    }

    const triggerToFocus = items[triggerIndexToFocus]?.__refs.trigger
    if (!isHTMLElement(triggerToFocus)) return
    attemptElementFocus(triggerToFocus)
  }

  /**
   * @protected
   * @param {number} itemIndex
   */
  _handleItemTriggerClick(itemIndex) {
    const { _state: state } = this
    if (state.currentItemIndex === itemIndex) return

    this._state = /** @satisfies {AccordionState} */ ({
      controller: "event",
      currentItemIndex: itemIndex
    })
    this.render()
  }

  /**
   * @protected
   * @param {KeyboardEvent} event
   * @param {number} itemIndex
   * @param {"home" | "end"} key
   */
  _handleItemTriggerHomeEndKeyPress(event, itemIndex, key) {
    event.preventDefault()

    const { items } = this._config.elements
    const triggerIndexToFocus = key === "home" ? 0 : items.length - 1
    const triggerToFocus = items[triggerIndexToFocus]?.__refs.trigger
    if (!isHTMLElement(triggerToFocus)) return
    attemptElementFocus(triggerToFocus)
  }

  getManagedElementPropertySets() {
    const {
      _meta: { constructionStage },
      _state: { currentItemIndex, controller },
      _config: { elements }
    } = this

    /** @satisfies {UIComponentManagedElementPropertySets} */
    const properties = {
      items: elements.items.map(({ __refs: item }, index) => {
        const dataState = currentItemIndex === index ? "open" : "closed"
        const ariaExpanded = currentItemIndex === index ? "true" : "false"
        const contentDisplay = currentItemIndex === index ? null : "none"

        const shouldIncludeVars =
          constructionStage >
          UIComponent.ConstructionStages.ValidatingStaticMarkup

        const itemContentHeightCSSVar = shouldIncludeVars
          ? `${item.contentArea.scrollHeight}px`
          : null

        const itemContentWidthCSSVar = shouldIncludeVars
          ? `${item.contentArea.scrollWidth}px`
          : null

        const itemStateAndController = [
          { name: "data-state", value: dataState },
          { name: "data-controller", value: controller }
        ]

        return {
          root: {
            htmlAttributes: itemStateAndController
          },

          header: {
            htmlAttributes: itemStateAndController
          },

          trigger: {
            htmlAttributes: [
              ...itemStateAndController,
              { name: "aria-expanded", value: ariaExpanded }
            ]
          },

          content: {
            cssProperties: [
              { name: "display", value: contentDisplay },
              {
                name: Accordion.CSSVariables.ItemContentHeight,
                value: itemContentHeightCSSVar
              },
              {
                name: Accordion.CSSVariables.ItemContentWidth,
                value: itemContentWidthCSSVar
              }
            ],
            htmlAttributes: itemStateAndController
          }
        }
      })
    }

    return properties
  }

  getOpenItem() {
    const {
      _config: { elements },
      _state: { currentItemIndex }
    } = this

    const item = elements.items.find((_, index) => index === currentItemIndex)
    assertIsDefined(item, `accordion item at index ${currentItemIndex}`)
    return item.name
  }

  getStaticElementPropertySets() {
    const { elements } = this._config

    /** @satisfies {UIComponentStaticElementPropertySets} */
    const properties = {
      items: elements.items.map(({ __refs: item }) => ({
        trigger: {
          variableHTMLAttributes: [{ name: "id", type: "non-empty-string" }],
          htmlAttributes: [
            {
              name: "aria-controls",
              value: forceGetElementNonEmptyAttribute(item.content, "id")
            }
          ]
        },

        content: {
          variableHTMLAttributes: [{ name: "id", type: "non-empty-string" }],
          htmlAttributes: [
            {
              name: "aria-labelledby",
              value: forceGetElementNonEmptyAttribute(item.trigger, "id")
            }
          ]
        }
      }))
    }

    return properties
  }

  render() {
    const { elements } = this._config
    const props = this.getManagedElementPropertySets()

    elements.items.forEach(({ __refs: item }, index) => {
      const itemProps = props.items[index]
      if (!itemProps) return

      UIComponent.setElementProperties(item.root, itemProps.root)
      UIComponent.setElementProperties(item.header, itemProps.header)
      UIComponent.setElementProperties(item.trigger, itemProps.trigger)
      UIComponent.setElementProperties(item.content, itemProps.content)
    })
  }

  /** @param {string} itemName */
  setOpenItem(itemName) {
    const {
      _config: { elements }
    } = this

    /** @type {number} */
    let intendedItemIndex = 0

    const intendedItem = elements.items.find((item, index) => {
      const itemHasName = item.name === itemName
      if (itemHasName) intendedItemIndex = index
      return itemHasName
    })

    assertIsDefined(intendedItem, `accordion item with name: ${itemName}`)

    this._state = /** @satisfies {AccordionState} */ ({
      currentItemIndex: intendedItemIndex,
      controller: "api"
    })

    this.render()
  }
}

/** Make sure constructor has necessary properties */
UIComponent.validateExtender(Accordion)

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
 */

/*--------------------------------------------*\
STATE
\*--------------------------------------------*/

/**
 * @typedef {null | string | number | boolean | JSONObject | JSONArray} JSONValue
 * @typedef {{ [x: string]: JSONValue; }} JSONObject
 * @typedef {JSONValue[]} JSONArray
 */

/**
 * @template {JSONValue} Value
 * @typedef {(newValue: Value, oldValue: Value) => void} StateCallback
 */

/** @template {JSONValue} Value */
class State {
  /** @param {Value} defaultValue */
  constructor(defaultValue) {
    /** @protected */
    this._callbacks = /** @type {Set<StateCallback<Value>>} */ (new Set())

    /** @protected */
    this._value = defaultValue
  }

  getValue() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return /** @type {Value} */ (JSON.parse(JSON.stringify(this._value)))
  }

  /** @param {StateCallback<Value>} callback */
  addChangeCallback(callback) {
    this._callbacks.add(callback)
  }

  /** @param {Value} value */
  setValue(value) {
    const oldValue = this._value
    this._value = value

    Array.from(this._callbacks).forEach((callback) => {
      callback.call(null, value, oldValue)
    })
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
 */

/*--------------------------------------------*\
UI ELEMENTS SETUP
\*--------------------------------------------*/

/**
 * @typedef {State<{
 *   completed: number,
 *   markedCheckbox: number | null
 * }>} SetupGuideState
 */

const setupNotificationPopover = () => {
  const selectors = {
    root: "[data-js-notification-popover-root]",
    trigger: "[data-js-notification-popover-trigger]",
    content: "[data-js-notification-popover-content]"
  }

  const root = selectElement(selectors.root, HTMLDivElement)

  Popover.create({
    elements: {
      trigger: selectElement(selectors.trigger, HTMLButtonElement, root),
      content: selectElement(selectors.content, HTMLElement, root)
    }
  })
}

const setupStoreButtonDropdownMenu = () => {
  const selectors = {
    root: "[data-js-store-button-menu-root]",
    trigger: "[data-js-store-button-menu-trigger]",
    content: "[data-js-store-button-menu-content]",
    itemRoots: "[data-js-store-button-menu-item]"
  }

  const root = selectElement(selectors.root, HTMLDivElement)

  DropdownMenu.create({
    elements: {
      trigger: selectElement(selectors.trigger, HTMLButtonElement, root),
      content: selectElement(selectors.content, HTMLElement, root),
      items: selectAllElements(
        selectors.itemRoots,
        HTMLAnchorElement,
        root
      ).map((element) => ({ __refs: { root: element } }))
    }
  })
}

const setupPlanSelectionHideable = () => {
  const selectors = {
    root: "[data-js-plan-selection-hideable-root]",
    trigger: "[data-js-plan-selection-hideable-trigger]"
  }

  const root = selectElement(selectors.root, HTMLElement)
  Hideable.create({
    elements: {
      root,
      trigger: selectElement(selectors.trigger, HTMLButtonElement, root)
    }
  })
}

/** @param {SetupGuideState} state */
const setupSetupGuideProgressText = (state) => {
  const selectors = {
    root: "[data-js-setup-guide-progress-number]"
  }

  const container = selectElement(selectors.root, HTMLSpanElement)
  state.addChangeCallback(({ completed }) => {
    container.innerText = String(completed)
  })
}

/** @param {SetupGuideState} state */
const setupSetupGuideProgress = (state) => {
  const selectors = {
    root: "[data-js-setup-progress-root]",
    indicator: "[data-js-setup-progress-indicator]"
  }

  const root = selectElement(selectors.root, HTMLDivElement)
  const progress = new Progress({
    max: 5,
    value: 0,
    elements: {
      root,
      indicator: selectElement(selectors.indicator, HTMLSpanElement, root)
    }
  })

  state.addChangeCallback(({ completed }) => {
    progress.setCurrentValue(completed)
  })
}

/** @param {SetupGuideState} state */
const setupSetupGuideItemCheckboxes = (state) => {
  const selectors = {
    roots: "[data-js-setup-guide-item-checkbox-root]",
    indicators: "[data-js-setup-guide-item-checkbox-indicator]"
  }

  const checkboxRoots = selectAllElements(selectors.roots, HTMLButtonElement)
  const checkboxes = checkboxRoots.map((root, index) => {
    const checkbox = new Checkbox({
      onCheckedChange: (checked) => {
        const checkedBoxes = checkboxes.filter((box) => box.isChecked())
        state.setValue({
          completed: checkedBoxes.length,
          markedCheckbox: checked ? index : null
        })
      },

      elements: {
        root,
        indicator: selectElement(selectors.indicators, HTMLElement, root)
      }
    })

    return checkbox
  })

  checkboxRoots.forEach((checkboxRoot, index) => {
    checkboxRoot.addEventListener("keydown", (event) => {
      /** @type {number | null} */
      let indexToFocus = null
      const { AriaKeys } = A11y

      if (event.key === AriaKeys.ArrowUp) {
        indexToFocus = index === 0 ? checkboxRoots.length - 1 : index - 1
      } else if (event.key === AriaKeys.ArrowDown) {
        indexToFocus = index === checkboxRoots.length - 1 ? 0 : index + 1
      } else if (event.key === AriaKeys.Home) {
        indexToFocus = 0
      } else if (event.key === AriaKeys.End) {
        indexToFocus = checkboxRoots.length - 1
      }

      if (indexToFocus === null) return

      event.preventDefault()
      const checkboxRootToFocus = checkboxRoots.at(indexToFocus)

      assertIsDefined(checkboxRootToFocus, `checkbox at index: ${indexToFocus}`)
      attemptElementFocus(checkboxRootToFocus)
    })
  })

  return checkboxes
}

const setupSetupGuideCollapsible = () => {
  const selectors = {
    root: "[data-js-setup-guide-collapsible-root]",
    trigger: "[data-js-setup-guide-collapsible-trigger]",
    content: "[data-js-setup-guide-collapsible-content]",
    contentArea: "[data-js-setup-guide-collapsible-content-area]"
  }

  const root = selectElement(selectors.root, HTMLElement)
  Collapsible.create({
    elements: {
      root,
      trigger: selectElement(selectors.trigger, HTMLButtonElement, root),
      content: selectElement(selectors.content, HTMLElement, root),
      contentArea: selectElement(selectors.contentArea, HTMLElement, root)
    }
  })
}

/**
 * @param {SetupGuideState} state
 * @param {Checkbox<CheckboxConfig>[]} checkboxes
 */
const setupSetupGuideAccordion = (state, checkboxes) => {
  const selectors = {
    root: "[data-js-setup-guide-accordion-root]",
    itemRoots: "[data-js-setup-guide-accordion-item]",
    itemHeaders: "[data-js-setup-guide-accordion-item-header]",
    itemTriggers: "[data-js-setup-guide-accordion-item-trigger]",
    itemContents: "[data-js-setup-guide-accordion-item-content]",
    itemContentAreas: "[data-js-setup-guide-accordion-item-content-area]"
  }

  const root = selectElement(selectors.root, HTMLDivElement)
  const itemRoots = selectAllElements(selectors.itemRoots, HTMLDivElement, root)

  const itemNames = /** @type {const} */ ([
    "customize-store",
    "add-product",
    "add-domain",
    "name-store",
    "setup-payment"
  ])

  const accordion = new Accordion({
    defaultItem: itemNames[0],
    elements: {
      items: itemRoots.map((itemRoot, index) => {
        const itemName = itemNames.at(index)
        assertIsDefined(itemName, `name of accordion item at index ${index}`)

        return {
          name: itemName,
          __refs: {
            root: itemRoot,
            header: selectElement(
              selectors.itemHeaders,
              HTMLHeadingElement,
              itemRoot
            ),
            trigger: selectElement(
              selectors.itemTriggers,
              HTMLButtonElement,
              itemRoot
            ),
            content: selectElement(
              selectors.itemContents,
              HTMLDivElement,
              itemRoot
            ),
            contentArea: selectElement(
              selectors.itemContentAreas,
              HTMLDivElement,
              itemRoot
            )
          }
        }
      })
    }
  })

  state.addChangeCallback(({ markedCheckbox }) => {
    if (markedCheckbox === null) return
    const openItem = accordion.getOpenItem()

    const uncheckedIndexAfterMarked = checkboxes.findIndex(
      (checkbox, index) => index > markedCheckbox && !checkbox.isChecked()
    )

    /** @type {number | null} */
    let itemIndexToOpen = null

    if (uncheckedIndexAfterMarked !== -1) {
      itemIndexToOpen = uncheckedIndexAfterMarked
    } else {
      const firstUncheckedBoxIndex = checkboxes.findIndex(
        (checkbox) => !checkbox.isChecked()
      )

      if (firstUncheckedBoxIndex !== -1) {
        itemIndexToOpen = firstUncheckedBoxIndex
      }
    }

    if (itemIndexToOpen === null) return
    const itemName = itemNames.at(itemIndexToOpen)
    assertIsDefined(itemName, `accordion item at index: ${itemIndexToOpen}`)
    if (openItem !== itemName) accordion.setOpenItem(itemName)
  })
}

const setupCSSRelatedFunctions = () => {
  const JS_CONTROLLED_CSS_VARS = {
    RootVerticalScrollbarWidth: "--root-vertical-scrollbar-width"
  }

  const documentSizeObserver = new ResizeObserver(() => {
    document.documentElement.style.setProperty(
      JS_CONTROLLED_CSS_VARS.RootVerticalScrollbarWidth,
      `${window.innerWidth - document.documentElement.clientWidth}px`
    )
  })

  documentSizeObserver.observe(document.documentElement)
}

window.addEventListener("load", () => {
  // Anything related to functioning of CSS e.g. CSS vars.
  setupCSSRelatedFunctions()

  setupNotificationPopover()
  setupStoreButtonDropdownMenu()
  setupPlanSelectionHideable()

  const setupGuideState = /** @type {SetupGuideState} */ (
    new State({ completed: 0, markedCheckbox: null })
  )

  setupSetupGuideProgress(setupGuideState)
  const checkboxes = setupSetupGuideItemCheckboxes(setupGuideState)

  setupSetupGuideProgressText(setupGuideState)
  setupSetupGuideAccordion(setupGuideState, checkboxes)
  setupSetupGuideCollapsible()
})
