import deepmerge, { ArrayMergeOptions } from 'deepmerge'

const combineMerge = (target: any[], source: any[], options: ArrayMergeOptions) => {
  const destination = target.slice()

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options)
    } else if (target.indexOf(item) === -1) {
      destination.push(item)
    }
  })
  return destination
}

/**
 * This function recursively merges two objects or arrays with the `combineMerge` strategy for arrays.
 * This is useful for merging collections and globals in seed scripts.
 */
export function deepMerge<T1, T2>(target: Partial<T1>, source: Partial<T2>): T1 & T2 {
  return deepmerge(target, source, { arrayMerge: combineMerge })
}
