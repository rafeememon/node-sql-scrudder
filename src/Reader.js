import { sql, rawsql } from 'sql-composer'
import { getOption } from './util'
import { getSelectClause, getIdWhereClause } from './queries'

export default class Reader {

  constructor (options) {
    this.table = getOption(options, 'table')
    this.columns = getOption(options, 'columns')
  }

  read (queries = {}) {
    const { table, columns } = this
    const tableExpr = rawsql(table.expr)
    const selectClause = getSelectClause({table, columns})
    const whereClause = getIdWhereClause({table, queries})
    return sql`SELECT ${selectClause} FROM ${tableExpr} ${whereClause}`
  }

}
