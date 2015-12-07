/* eslint-env mocha */
import Creator from '../src/Creator'
import { expect } from 'chai'

import USERS_TABLE, { TABLE_NAME } from './fixtures/users-table'
import { USER_ID_KEY, USER_ID_COLUMN } from './fixtures/users-columns'

describe('Creator', () => {
  describe('#create', () => {
    const creator = new Creator({
      table: USERS_TABLE
    })
    it('should throw an error when no values are specified', () => {
      expect(() => creator.create()).to.throw('no values')
    })
    it('should insert the specified record', () => {
      const userId = 1
      expect(creator.create({
        [USER_ID_KEY]: userId
      })).to.deep.equal({
        text: `INSERT INTO ${TABLE_NAME} (${USER_ID_COLUMN}) VALUES (?)`,
        values: [userId]
      })
    })
  })
})

