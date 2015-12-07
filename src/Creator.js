import { sql, rawsql } from 'sql-composer'
import { getOption } from './util'
import { getInsertClause } from './queries'

export default class Creator {

  constructor (options) {
    this.table = getOption(options, 'table')
  }

  create (values = {}) {
    const { table } = this
    const tableExpr = rawsql(table.expr)
    const insertClause = getInsertClause({table, values})
    return sql`INSERT INTO ${tableExpr} ${insertClause}`
  }

}
