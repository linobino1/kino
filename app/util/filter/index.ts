import type { Payload } from "payload";
import type { Where } from "payload/types";

export type FilterProps = {
  name: string;
  collection: string;
  payload: Payload;
  labelOff?: string;
  labelTrue?: string;
  labelFalse?: string;
  parent: Filters;
}

export type FilterOption = {
  value: string;
  label?: string | Record<string, string>;
  count: number;
}

export type FiltersProps = {
  payload: Payload;
  collection: string;
  filters: Omit<FilterProps, 'payload' | 'collection' | 'parent'>[];
  globalCause?: Where;
}

export type AppliedFilter = {
  name: string;
  value: any;
  options: FilterOption[];
}

export class Filter {
  props = {} as FilterProps;
  activeValue = null as any;
  
  constructor(props: FilterProps) {
    this.props = props;
  }
  
  getWhereClause(value: any): Where {
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    if (value === null) return {
      [this.props.name]: {},
    }
    if (value.length) return {
      [this.props.name]: {
        contains: value,
      },
    }
    return {
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
  getField(item: any, name: string): any {
    const fields = this.props.name.split('.');
    if (fields.length > 1) {
      return fields.reduce((acc, field) => {
        if (Array.isArray(acc)) {
          // treat hasMany and array fields, return an array of values of the field for each item
          return acc.map((x) => x[field]);
        } else {
          return acc[field];
        }
      }, item);
    } else {
      return item[name];
    }
  }
  
  async getPossibleValues(): Promise<any[]> {
    // get all items in the collection
    const items = (await this.props.payload.find({
      // @ts-ignore this.collection must be a valid collection slug
      collection: this.props.collection,
    })).docs;
    
    // remove duplicate values
    const values = items.map((item) => this.getField(item, this.props.name)).flat();
    const uniqueValues  = values.filter((value, index) => {
      const _value = JSON.stringify(value);
      return index === values.findIndex(obj => {
        return JSON.stringify(obj) === _value;
      });
    });
    return uniqueValues;
  }
  
  async getOptions(): Promise<FilterOption[]> {
    const values = await this.getPossibleValues();
    return [
      {
        value: '',
        label: this.props.labelOff || 'off',
        count: await this.getCount(null),
      },
      ...await Promise.all(values.map(async (value) => {
        const label = value === true ? this.props.labelTrue : value === false ? this.props.labelFalse : `${value}`;
        return {
          value,
          label,
          count: await this.getCount(value),
        }
      })),
    ];
  }
  
  async getCount(value: any): Promise<number> {
    const where = this.props.parent.getWhereClause();
    
    // TODO somewhere here seems to be a bug, the count is not correct for some
    // docs if a global cause is applied and true
    // replace this fields value in the where clause with the probe value
    if (where.and) {
      const clause = where.and.find((item) => item[this.props.name] !== undefined);
      if (clause) {
        if (value === null) {
          // remove the clause
          where.and = where.and.filter((item) => item !== clause);
        }
        clause[this.props.name] = this.getWhereClause(value)[this.props.name];
      } else if (value !== null) {
        where.and.push(this.getWhereClause(value));
      }
    }
    
    const res = (await this.props.payload.find({
      // @ts-ignore this.collection must be a valid collection slug
      collection: this.props.collection,
      where,
      depth: 7,
    })).totalDocs;
    return res;
    // IDEA: use aggregate to get the count, might be faster
    // const model = this.props.payload.collections[this.props.collection].Model;
    // const res = await model.aggregate([
    //   { $match: where },
    //   { $group: { _id: null, count: { $sum: 1 } } },
    // ]);
    // return res[0]?.count || 0;
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
  props: FiltersProps;
  filters: Filter[];
  
  constructor(props: FiltersProps) {
    this.props = props;

    this.filters = this.props.filters.map((filter) => new Filter({
      ...filter,
      payload: this.props.payload,
      collection: this.props.collection,
      parent: this,
    }));
  }
  
  getWhereClauses(): Where[] {
    const res = this.filters
      .filter((filter) => filter.activeValue !== null)
      .map((filter) => filter.getWhereClause(filter.activeValue));
    if (this.props.globalCause) {
      res.push(this.props.globalCause);
    }
    return res;  
  }

  getWhereClause(): Where {
    const res = {
      and: this.getWhereClauses(),
    }
    return res;
  }
  
  /**
   * apply the filters from a form data
   * @param formData request body
   */
  apply(formData?: FormData): void {
    this.filters.forEach((filter) => {
      filter.activeValue = formData?.get(filter.props.name) || null;
    });
  }
  
  async getApplied(): Promise<AppliedFilter[]> {
    return await Promise.all(this.filters.map(async (filter) => filter.getApplied()));
  }
}
