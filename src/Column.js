import { getOption } from './util'

export default class Column {

  // options = {expr, id, constraint}
  constructor (options) {
    this.expr = getOption(options, 'expr')
    this.id = getOption(options, 'id', false)
    this.constraint = getOption(options, 'constraint', {})
    this.order = getOption(options, 'order', this.expr)
  }

}
