import type { Where } from 'payload'

export type FilterProps = {
  name: string
  label?: string
  labelTrue?: string
  labelFalse?: string
  where?: (value: any) => Where
  getValue?: (item: any) => any
  parent: Filters
  type?: 'number' | 'text' | 'boolean'
}

export type FilterOption = {
  value: string
  label?: string
  count: number
}

export type FiltersProps = {
  filters: Omit<FilterProps, 'parent'>[]
  globalCause?: Where
}

export type AppliedFilter = {
  name: string
  value: any
  options: FilterOption[]
}

export class Filter {
  props = {} as FilterProps
  activeValue = null as any

  constructor(props: FilterProps) {
    this.props = props
  }

  getWhereClause(value: any): Where {
    if (value === 'true') value = true
    if (value === 'false') value = false
    if (this.props.type === 'number' && value !== undefined && value !== null) {
      value = parseInt(value)
    }

    return this.props.where
      ? this.props.where(value)
      : value === null || value === undefined
        ? {
            [this.props.name]: {},
          }
        : {
            [this.props.name]: {
              equals: value,
            },
          }
  }

  /**
   * allows to access nested fields using dot notation
   * @param item the doc to get the field from
   * @param name a field name or a dot separated path to a field
   * @returns the value of the field
   */
  getField(item: any): any {
    if (this.props.getValue) return this.props.getValue(item)

    const fields = this.props.name.split('.')
    return fields.reduce((acc, field) => {
      if (acc == null) {
        console.warn(`field ${field} is undefined in ${this.props.name}`)
        return undefined
      }
      if (Array.isArray(acc)) {
        // treat hasMany and array fields, return an array of values of the field for each item
        return acc.map((x) => x[field])
      } else {
        return acc[field]
      }
    }, item)
  }

  matches(item: any, rawValue: any): boolean {
    const value = this.normalizeValue(rawValue)
    const values = this.flattenValues(this.getField(item))
    return values.some((itemValue) => this.normalizeValue(itemValue) === value)
  }

  getApplied(items: any[]): AppliedFilter {
    // A facet's counts include every active filter except itself.
    const matchingItems = items.filter((item) =>
      this.props.parent.filters.every(
        (filter) =>
          filter === this ||
          filter.activeValue === null ||
          filter.matches(item, filter.activeValue),
      ),
    )

    const counts = new Map<string, { value: any; count: number }>()
    for (const item of matchingItems) {
      const uniqueItemValues = new Map<string, any>()
      for (const value of this.flattenValues(this.getField(item))) {
        uniqueItemValues.set(this.valueKey(value), value)
      }

      for (const [key, value] of uniqueItemValues) {
        const entry = counts.get(key)
        if (entry) entry.count++
        else counts.set(key, { value, count: 1 })
      }
    }

    return {
      name: this.props.name,
      value: this.activeValue,
      options: [
        {
          value: '',
          label: this.props.label || '',
          count: matchingItems.length,
        },
        ...[...counts.values()].map(({ value, count }) => ({
          value,
          label:
            value === true
              ? this.props.labelTrue
              : value === false
                ? this.props.labelFalse
                : `${value}`,
          count,
        })),
      ].map((option) => ({
        ...option,
        label: option.label || `${option.value}`,
      })),
    }
  }

  private normalizeValue(value: any): any {
    if (value === 'true') return true
    if (value === 'false') return false
    if (this.props.type === 'number' && value !== null && value !== undefined) {
      return parseInt(value, 10)
    }
    return value
  }

  private flattenValues(value: any): any[] {
    if (Array.isArray(value)) return value.flatMap((item) => this.flattenValues(item))
    return value === null || value === undefined ? [] : [value]
  }

  private valueKey(value: any): string {
    return `${typeof value}:${JSON.stringify(value)}`
  }
}

export class Filters {
  props: FiltersProps
  filters: Filter[]

  constructor(props: FiltersProps) {
    this.props = props

    this.filters = this.props.filters.map((filter) => new Filter({ ...filter, parent: this }))
  }

  getGlobalWhereClause(): Where {
    return this.props.globalCause ?? {}
  }

  getWhereClause({
    except,
    add,
  }: {
    except?: string
    add?: Where
  } = {}): Where {
    // TODO write a function that combines where clauses properly
    let clauses = this.filters
      .filter((filter) => filter.activeValue !== null)
      .filter((filter) => filter.props.name !== except)
      .map((filter) => filter.getWhereClause(filter.activeValue))

    clauses.push(add || {})
    clauses = clauses.filter(Boolean)

    let and
    if (this.props.globalCause?.and) {
      and = this.props.globalCause.and.concat(clauses)
    } else {
      and = clauses
    }

    return {
      and,
    }
  }

  /**
   * apply the filters from a form data
   * @param params request body
   */
  applySearchParams(params?: URLSearchParams): void {
    this.filters.forEach((filter) => {
      filter.activeValue = params?.get(filter.props.name) || null
    })
  }

  /**
   * apply the filters from a form data
   * @param formData request body
   */
  applyFormData(formData?: FormData): void {
    this.filters.forEach((filter) => {
      filter.activeValue = formData?.get(filter.props.name) || null
    })
  }

  getApplied(items: any[]): AppliedFilter[] {
    return this.filters.map((filter) => filter.getApplied(items))
  }
}
