import type { Payload, Where } from 'payload'
import { Locale } from 'shared/config'

export type FilterProps = {
  name: string
  collection: string
  payload: Payload
  locale: Locale
  label?: string
  labelTrue?: string
  labelFalse?: string
  where?: (value: any) => Where
  parent: Filters
  type?: 'number' | 'text' | 'boolean'
}

export type FilterOption = {
  value: string
  label?: string
  count: number
}

export type FiltersProps = {
  payload: Payload
  locale: Locale
  collection: string
  filters: Omit<FilterProps, 'payload' | 'locale' | 'collection' | 'parent'>[]
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
    const fields = this.props.name.split('.')
    return fields.reduce((acc, field) => {
      if (acc === undefined) {
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

  async getPossibleValues(): Promise<any[]> {
    // get all items in the collection
    const items = (
      await this.props.payload.find({
        // @ts-expect-error this.collection must be a valid collection slug
        collection: this.props.collection,
        locale: this.props.locale,
      })
    ).docs

    // remove duplicate values
    const values = items.map((item) => this.getField(item)).flat()
    const uniqueValues = values.filter((value, index) => {
      const _value = JSON.stringify(value)
      return (
        index ===
        values.findIndex((obj) => {
          return JSON.stringify(obj) === _value
        })
      )
    })
    return uniqueValues
  }

  async getOptions(): Promise<FilterOption[]> {
    const values = await this.getPossibleValues()
    return [
      // please select ...
      {
        value: '',
        label: this.props.label || '',
        count: await this.getCount(null),
      },
      // all possible values
      ...(await Promise.all(
        values.map(async (value) => {
          const label =
            value === true
              ? this.props.labelTrue
              : value === false
                ? this.props.labelFalse
                : `${value}`
          return {
            value,
            label,
            count: await this.getCount(value),
          }
        }),
      )),
    ].filter((option) => option.count > 0)
  }

  async getCount(value: any): Promise<number> {
    const where = this.props.parent.getWhereClause({
      except: this.props.name,
      add: this.getWhereClause(value),
    })

    const res = (
      await this.props.payload.find({
        // @ts-expect-error this.collection must be a valid collection slug
        collection: this.props.collection,
        where,
        depth: 7,
        locale: this.props.locale,
      })
    ).totalDocs
    return res
    // IDEA: use aggregate to get the count, might be faster
    // const model = this.props.payload.collections[this.props.collection].Model;
    // const res = await model.aggregate([
    //   { $match: where },
    //   { $group: { _id: null, count: { $sum: 1 } } },
    // ]);
    // return res[0]?.count || 0;
    // ------> this won't work with implicit fields like movies.decade
  }

  async getApplied(): Promise<AppliedFilter> {
    return {
      name: this.props.name,
      value: this.activeValue,
      options: (await this.getOptions()).map((option) => ({
        count: option.count,
        value: option.value,
        label: option.label || `${option.value}`,
      })),
    }
  }
}

export class Filters {
  props: FiltersProps
  filters: Filter[]

  constructor(props: FiltersProps) {
    this.props = props

    this.filters = this.props.filters.map(
      (filter) =>
        new Filter({
          ...filter,
          payload: this.props.payload,
          locale: this.props.locale,
          collection: this.props.collection,
          parent: this,
        }),
    )
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

  async getApplied(): Promise<AppliedFilter[]> {
    return await Promise.all(this.filters.map(async (filter) => filter.getApplied()))
  }
}
