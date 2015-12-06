/* eslint-env mocha */
import Reader from '../src/Reader'
import { expect } from 'chai'

import USERS_TABLE, { TABLE_NAME } from './fixtures/users-table'
import { USER_ID_KEY, USER_ID_COLUMN } from './fixtures/users-columns'

describe('Reader', () => {
  describe('#read', () => {
    const reader = new Reader({
      table: USERS_TABLE,
      columns: [USER_ID_KEY]
    })
    it('should throw an error when id column is not specified', () => {
      expect(() => reader.read()).to.throw('missing id column')
    })
    it('should read the specified record', () => {
      const userId = 1
      expect(reader.read({
        [USER_ID_KEY]: userId
      })).to.deep.equal({
        text: `SELECT ${USER_ID_COLUMN} AS ${USER_ID_KEY} FROM ${TABLE_NAME} WHERE ${USER_ID_COLUMN} = ?`,
        values: [userId]
      })
    })
  })
})
