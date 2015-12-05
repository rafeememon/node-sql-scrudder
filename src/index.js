import Table from './Table'
import Column from './Column'

export function table (expr, columns) {
  return new Table({expr, columns})
}

export function column (expr, options) {
  return new Column({expr, ...options})
}
