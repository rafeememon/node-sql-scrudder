import { sql, rawsql } from 'sql-composer'
import { getOption } from './util'
import { getUpdateClause, getIdWhereClause } from './queries'

export default class Updater {

  constructor (options) {
    this.table = getOption(options, 'table')
  }

  update (values = {}) {
    const { table } = this
    const tableExpr = rawsql(table.expr)
    const updateClause = getUpdateClause({table, values})
    const whereClause = getIdWhereClause({table, queries: values})
    return sql`UPDATE ${tableExpr} SET ${updateClause} ${whereClause}`
  }

}
