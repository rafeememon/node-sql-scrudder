/* eslint-env mocha */
import Updater from '../src/Updater'
import { expect } from 'chai'

import USERS_TABLE, { TABLE_NAME } from './fixtures/users-table'
import {
  USER_ID_KEY,
  USER_NAME_KEY,
  USER_ID_COLUMN,
  USER_NAME_COLUMN
} from './fixtures/users-columns'

describe('Updater', () => {
  describe('#update', () => {
    const updater = new Updater({
      table: USERS_TABLE
    })
    it('should throw an error if no updates specified', () => {
      expect(() => updater.update({
        [USER_ID_KEY]: 1
      })).to.throw('no updates')
    })
    it('should throw an error if no id values specified', () => {
      expect(() => updater.update({
        [USER_NAME_KEY]: 'admin'
      })).to.throw('missing id column')
    })
    it('should update the specified record', () => {
      const userId = 1
      const userName = 'admin'
      expect(updater.update({
        [USER_ID_KEY]: userId,
        [USER_NAME_KEY]: userName
      })).to.deep.equal({
        text: `UPDATE ${TABLE_NAME} SET ${USER_NAME_COLUMN} = ? WHERE ${USER_ID_COLUMN} = ?`,
        values: [userName, userId]
      })
    })
  })
})
