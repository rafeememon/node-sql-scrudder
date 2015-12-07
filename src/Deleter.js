import { sql, rawsql } from 'sql-composer'
import { getOption } from './util'
import { getIdWhereClause } from './queries'

export default class Deleter {

  constructor (options) {
    this.table = getOption(options, 'table')
  }

  delete (queries = {}) {
    const { table } = this
    const tableExpr = rawsql(table.expr)
    const whereClause = getIdWhereClause({table, queries})
    return sql`DELETE FROM ${tableExpr} ${whereClause}`
  }

}
