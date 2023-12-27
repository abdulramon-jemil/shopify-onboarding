/** @type {(value: unknown) => value is CharacterData} */
// const isCharacterData = (value) => value instanceof CharacterData

/** @type {(value: unknown, desc: string) => asserts value is CharacterData} */
// const assertIsCharacterData = (value, desc) => {
//   if (!isCharacterData(value))
//     throw new Error(`Expected '${desc}' to be a CharacterData`)
// }

/**
 * Create a `CSSStyleDeclaration` object from a CSS string
 *
 * @param {string} cssText
 */
// const createCSSStyleDeclaration = (cssText) => {
//   const div = document.createElement("div")
//   div.setAttribute("style", cssText)
//   return div.style
// }

/**
 * Returns whether two `CSSStyleDeclaration` objects are the same
 *
 * @param {CSSStyleDeclaration} first
 * @param {CSSStyleDeclaration} second
 */
// const isSameCSSStyleDeclaration = (first, second) => {
//   const firstCSSString = Array.from(first)
//     .sort()
//     .map((property) => `${property}: ${first.getPropertyValue(property)};`)
//     .join(" ")

//   const secondCSSString = Array.from(second)
//     .sort()
//     .map((property) => `${property}: ${second.getPropertyValue(property)};`)
//     .join(" ")

//   return firstCSSString === secondCSSString
// }

/**
 * Returns whether a set of mutation records (usually passed from a mutation
 * observer) is a rewrite of the records e.g rewritten HTML attributes.
 *
 * @param {MutationRecord[]} records
 * @param {string} observedElementName
 */
// const mutationIsRewrite = (records, observedElementName) => {
//   /** @param {MutationRecord} record */
//   const recordIsRewrite = (record) => {
//     const { attributeName, oldValue, target } = record

//     if (record.type === "attributes") {
//       assertIsElement(target, `${observedElementName} mutation record target`)
//       assertIsDefined(attributeName, `${observedElementName} attribute name`)

//       if (attributeName === "style") {
//         return isSameCSSStyleDeclaration(
//           createCSSStyleDeclaration(target.getAttribute("style") ?? ""),
//           createCSSStyleDeclaration(oldValue ?? "")
//         )
//       }

//       return target.getAttribute(attributeName) === oldValue
//     }

//     if (record.type === "characterData") {
//       assertIsCharacterData(
//         target,
//         `${observedElementName} item mutation record target`
//       )

//       return target.data === oldValue
//     }

//     return false
//   }

//   return records.every((record) => recordIsRewrite(record))
// }
