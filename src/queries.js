import { sql, rawsql } from 'sql-composer'
import { EMPTY_SQL, isEmptySql, joinsql } from './util'

export function getSelectClause ({table, columns, aggregate}) {
  const columnSelect = (columns || []).map(key =>
    `${table.getColumn(key).expr} AS ${key}`
  )
  const aggregateSelect = Object.keys(aggregate || {}).map(key =>
    `${aggregate[key]} AS ${key}`
  )
  const selects = columnSelect.concat(aggregateSelect)
  if (!selects.length) {
    throw new Error(`no columns`)
  }
  return rawsql(selects.join(', '))
}

function getWhereClauseForColumn (expr, query) {
  if (!query || typeof query !== 'object') {
    query = {'=': query}
  }
  const ops = Object.keys(query)
  if (ops.length) {
    const wheres = ops.map(op =>
      sql`${rawsql(expr)} ${rawsql(op)} ${query[op]}`
    )
    return joinsql(wheres, ' AND ')
  } else {
    return EMPTY_SQL
  }
}

export function getWhereClause ({table, queries}) {
  const constraintWheres = Object.keys(table.columns).map(key => {
    const { expr, constraint } = table.getColumn(key)
    return getWhereClauseForColumn(expr, constraint)
  })
  const queryWheres = Object.keys(queries).map(key => {
    const { expr } = table.getColumn(key)
    return getWhereClauseForColumn(expr, queries[key])
  })
  const clause = joinsql(constraintWheres.concat(queryWheres), ' AND ')
  return isEmptySql(clause) ? EMPTY_SQL : sql`WHERE ${clause}`
}

export function getIdWhereClause ({table, queries}) {
  const idQueries = {}
  Object.keys(table.columns).forEach(key => {
    const { id } = table.getColumn(key)
    if (id) {
      const query = queries[key]
      if (!query) {
        throw new Error(`missing id column: ${key}`)
      }
      idQueries[key] = query
    }
  })
  if (!Object.keys(idQueries).length) {
    throw new Error('no id columns')
  }
  return getWhereClause({table, queries: idQueries})
}

export function getGroupClause ({table, columns, aggregate}) {
  if (columns.length && aggregate && Object.keys(aggregate).length) {
    const names = columns.map(key => table.getColumn(key).expr)
    return rawsql(`GROUP BY ${names.join(', ')}`)
  } else {
    return EMPTY_SQL
  }
}

export function getOrderClause ({table, sort}) {
  const key = (sort && sort.column) || sort
  const dir = sort && sort.desc ? 'DESC' : 'ASC'
  if (key) {
    return rawsql(`ORDER BY ${table.getColumn(key).expr} ${dir}`)
  } else {
    return EMPTY_SQL
  }
}

export function getLimitClause ({limit}) {
  const rows = (limit && limit.rows) || limit
  const offset = limit && limit.offset
  if (rows != null) {
    if (!(rows >= 0)) {
      throw new Error('invalid limit rows')
    }
    if (offset != null) {
      if (!(offset >= 0)) {
        throw new Error('invalid limit offset')
      }
      return rawsql(`LIMIT ${offset},${rows}`)
    } else {
      return rawsql(`LIMIT ${rows}`)
    }
  } else {
    return EMPTY_SQL
  }
}

export function getInsertClause ({table, values}) {
  const keys = Object.keys(values)
  if (!keys.length) {
    throw new Error('no values')
  }
  const columnList = keys.map(key => rawsql(table.getColumn(key).expr))
  const valueList = keys.map(key => sql`${values[key]}`)
  return sql`(${joinsql(columnList, ', ')}) VALUES (${joinsql(valueList, ', ')})`
}

export function getUpdateClause ({table, values}) {
  const updates = Object.keys(values)
    .filter(key => !table.getColumn(key).id)
    .map(key => sql`${rawsql(table.getColumn(key).expr)} = ${values[key]}`)
  if (!updates.length) {
    throw new Error('no updates')
  }
  return joinsql(updates, ', ')
}
