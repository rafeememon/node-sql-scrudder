/* eslint-env mocha */
import Searcher from '../src/Searcher'
import { expect } from 'chai'

import USERS_TABLE, { TABLE_NAME } from './fixtures/users-table'
import {
  USER_ID_KEY,
  USER_NAME_KEY,
  USER_ID_COLUMN,
  USER_NAME_COLUMN
} from './fixtures/users-columns'

function expectQuery ({text: actualText, values: actualValues}, {text, values}) {
  expect(actualText.trim().replace(/\s+/g, ' ')).to.equal(text)
  expect(actualValues).to.deep.equal(values)
}

describe('Searcher', () => {
  describe('#search', () => {
    it('should throw an error when no columns specified', () => {
      const searcher = new Searcher({
        table: USERS_TABLE,
        columns: [],
        aggregate: {},
        sort: null
      })
      expect(() => searcher.search()).to.throw('no columns')
    })

    describe('default searcher', () => {
      const searcher = new Searcher({
        table: USERS_TABLE,
        columns: [USER_ID_KEY],
        aggregate: {},
        sort: null
      })
      const BASE_SELECT = `SELECT ${USER_ID_COLUMN} AS ${USER_ID_KEY} FROM ${TABLE_NAME}`
      it('should not have a where clause when no queries specified', () => {
        expectQuery(searcher.search(), {
          text: BASE_SELECT,
          values: []
        })
      })
      it('should throw an error for an invalid query', () => {
        expect(() => searcher.search({
          invalid: 'valid'
        })).to.throw('invalid column')
      })
      it('should add a where clause for a valid query', () => {
        const userName = 'admin'
        expectQuery(searcher.search({
          [USER_NAME_KEY]: userName
        }), {
          text: `${BASE_SELECT} WHERE ${USER_NAME_COLUMN} = ?`,
          values: [userName]
        })
      })
      it('should include a sort if specified', () => {
        expectQuery(searcher.search({}, {sort: USER_ID_KEY}), {
          text: `${BASE_SELECT} ORDER BY ${USER_ID_COLUMN} ASC`,
          values: []
        })
      })
    })

    describe('aggregated searcher', () => {
      const AGGREGATE_KEY = 'count'
      const AGGREGATE_EXPR = 'COUNT(UserID)'
      it('should include an aggregation', () => {
        const searcher = new Searcher({
          table: USERS_TABLE,
          columns: [],
          aggregate: {
            [AGGREGATE_KEY]: AGGREGATE_EXPR
          },
          sort: null
        })
        expectQuery(searcher.search(), {
          text: `SELECT ${AGGREGATE_EXPR} AS ${AGGREGATE_KEY} FROM ${TABLE_NAME}`,
          values: []
        })
      })
      it('should include an aggregation and group columns if columns specified', () => {
        const searcher = new Searcher({
          table: USERS_TABLE,
          columns: [USER_ID_KEY],
          aggregate: {
            [AGGREGATE_KEY]: AGGREGATE_EXPR
          },
          sort: null
        })
        expectQuery(searcher.search(), {
          text: `SELECT ${USER_ID_COLUMN} AS ${USER_ID_KEY}, ${AGGREGATE_EXPR} AS ${AGGREGATE_KEY} FROM ${TABLE_NAME} GROUP BY ${USER_ID_COLUMN}`,
          values: []
        })
      })
    })

    describe('sorted searcher', () => {
      const searcher = new Searcher({
        table: USERS_TABLE,
        columns: [USER_ID_KEY],
        aggregate: {},
        sort: USER_ID_KEY
      })
      const BASE_SELECT = `SELECT ${USER_ID_COLUMN} AS ${USER_ID_KEY} FROM ${TABLE_NAME}`
      it('should include a default sort', () => {
        expectQuery(searcher.search(), {
          text: `${BASE_SELECT} ORDER BY ${USER_ID_COLUMN} ASC`,
          values: []
        })
      })
      it('should override the default sort if sort specified', () => {
        expectQuery(searcher.search({}, {sort: USER_NAME_KEY}), {
          text: `${BASE_SELECT} ORDER BY ${USER_NAME_COLUMN} ASC`,
          values: []
        })
      })
    })
  })
})
