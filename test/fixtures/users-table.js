import { table, column } from '../../src'

import {
  USER_ID_KEY,
  USER_NAME_KEY,
  USER_ACTIVE_KEY,
  USER_ID_COLUMN,
  USER_NAME_COLUMN,
  USER_ACTIVE_COLUMN
} from './users-columns'

export const TABLE_NAME = 'Users'

export default table(TABLE_NAME, {
  [USER_ID_KEY]: column(USER_ID_COLUMN, {id: true}),
  [USER_NAME_KEY]: column(USER_NAME_COLUMN),
  [USER_ACTIVE_KEY]: column(USER_ACTIVE_COLUMN)
})
