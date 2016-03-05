import { sql, rawsql } from 'sql-composer'
import { getOption } from './util'
import {
  getSelectClause,
  getWhereClause,
  getGroupClause,
  getOrderClause,
  getLimitClause
} from './queries'

export default class Searcher {

  constructor (options) {
    this.table = getOption(options, 'table')
    this.columns = getOption(options, 'columns')
    this.aggregate = getOption(options, 'aggregate')
    this.sort = getOption(options, 'sort')
  }

  search (queries = {}, {sort, limit} = {}) {
    const { table, columns, aggregate, sort: defaultSort } = this
    const tableExpr = rawsql(table.expr)
    const selectClause = getSelectClause({table, columns, aggregate})
    const whereClause = getWhereClause({table, queries})
    const groupClause = getGroupClause({table, columns, aggregate})
    const orderClause = getOrderClause({table, sort: sort || defaultSort})
    const limitClause = getLimitClause({limit})
    return sql`SELECT ${selectClause} FROM ${tableExpr} ${whereClause} ${groupClause} ${orderClause} ${limitClause}`
  }

}
