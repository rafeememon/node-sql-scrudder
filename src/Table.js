import Searcher from './Searcher'
import Reader from './Reader'
import Creator from './Creator'
import { getOption } from './util'

export default class Table {

  // options = {expr, columns}
  constructor (options) {
    this.expr = getOption(options, 'expr')
    this.columns = getOption(options, 'columns')
  }

  getColumn (key) {
    const column = this.columns[key]
    if (!column) {
      throw new Error(`invalid column: ${key}`)
    }
    return column
  }

  search ({columns, aggregate, sort} = {}) {
    const searcher = new Searcher({
      table: this,
      columns: columns || Object.keys(this.columns),
      aggregate: aggregate || {},
      sort: sort || null
    })
    return searcher.search.bind(searcher)
  }

  read ({columns} = {}) {
    const reader = new Reader({
      table: this,
      columns: columns || Object.keys(this.columns)
    })
    return reader.read.bind(reader)
  }

  create () {
    const creator = new Creator({table: this})
    return creator.create.bind(creator)
  }

}
