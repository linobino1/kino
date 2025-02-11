/**
 * Recursive function to traverse and modify objects/arrays. Can be used to replace a string throughout the whole database.
 */
export function deepReplace(obj: any, target: string, replacement: string): any {
  if (typeof obj === 'string') {
    return obj.includes(target) ? obj.replace(new RegExp(target, 'g'), replacement) : obj
  } else if (Array.isArray(obj)) {
    return obj.map((item) => deepReplace(item, target, replacement))
  } else if (typeof obj === 'object' && obj !== null) {
    let modified = false
    const newObj: any = {}

    for (const [key, value] of Object.entries(obj)) {
      const newValue = deepReplace(value, target, replacement)
      if (newValue !== value) modified = true
      newObj[key] = newValue
    }

    return modified ? newObj : obj // Return original if no changes
  }
  return obj
}
