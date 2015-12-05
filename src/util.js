import { sql, rawsql } from 'sql-composer'

export function getOption (options, key, defaultValue) {
  if (options && options[key] !== undefined) {
    return options[key]
  } else if (defaultValue !== undefined) {
    return defaultValue
  } else {
    throw new Error('option required: ' + key)
  }
}

export const EMPTY_SQL = rawsql('')

export function isEmptySql (query) {
  return !query.text && !query.values.length
}

export function joinsql (queries, sep) {
  const nonemptyQueries = queries.filter(query => !isEmptySql(query))
  if (!nonemptyQueries.length) {
    return EMPTY_SQL
  }
  const [first, ...rest] = nonemptyQueries
  return rest.reduce((acc, query) =>
    sql`${acc}${rawsql(sep)}${query}`
  , first)
}
