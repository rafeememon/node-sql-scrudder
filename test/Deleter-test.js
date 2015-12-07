/* eslint-env mocha */
import Deleter from '../src/Deleter'
import { expect } from 'chai'

import USERS_TABLE, { TABLE_NAME } from './fixtures/users-table'
import { USER_ID_KEY, USER_ID_COLUMN } from './fixtures/users-columns'

describe('Deleter', () => {
  describe('#delete', () => {
    const deleter = new Deleter({table: USERS_TABLE})
    it('should throw an error when id column is not specified', () => {
      expect(() => deleter.delete()).to.throw('missing id column')
    })
    it('should read the specified record', () => {
      const userId = 1
      expect(deleter.delete({
        [USER_ID_KEY]: userId
      })).to.deep.equal({
        text: `DELETE FROM ${TABLE_NAME} WHERE ${USER_ID_COLUMN} = ?`,
        values: [userId]
      })
    })
  })
})
