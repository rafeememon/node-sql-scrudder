/* eslint-env mocha */
import {
  getSelectClause,
  getWhereClause,
  getIdWhereClause,
  getGroupClause,
  getOrderClause,
  getInsertClause,
  getUpdateClause
} from '../src/queries'
import { EMPTY_SQL } from '../src/util'
import { expect } from 'chai'

import USERS_TABLE from './fixtures/users-table'
import ACTIVE_USERS_TABLE from './fixtures/active-users-table'

import {
  USER_ID_KEY,
  USER_NAME_KEY,
  USER_ACTIVE_KEY,
  USER_ID_COLUMN,
  USER_NAME_COLUMN,
  USER_ACTIVE_COLUMN
} from './fixtures/users-columns'

const INVALID_KEY = 'invalid'
const AGGREGATE_KEY = 'count'
const AGGREGATE_EXPR = 'COUNT(UserID)'

describe('getSelectClause', () => {
  it('should throw an error if no columns specified', () => {
    expect(() => getSelectClause({
      table: USERS_TABLE
    })).to.throw('no columns')
  })
  it('should select specified columns', () => {
    expect(getSelectClause({
      table: USERS_TABLE,
      columns: [USER_ID_KEY]
    })).to.deep.equal({
      text: `${USER_ID_COLUMN} AS ${USER_ID_KEY}`,
      values: []
    })
  })
  it('should throw an error for an invalid column', () => {
    expect(() => getSelectClause({
      table: USERS_TABLE,
      columns: [INVALID_KEY]
    })).to.throw('invalid column')
  })
  it('should select aggregated columns', () => {
    expect(getSelectClause({
      table: USERS_TABLE,
      aggregate: {
        [AGGREGATE_KEY]: AGGREGATE_EXPR
      }
    })).to.deep.equal({
      text: `${AGGREGATE_EXPR} AS ${AGGREGATE_KEY}`,
      values: []
    })
  })
  it('should select column and aggregated column', () => {
    const clause = getSelectClause({
      table: USERS_TABLE,
      columns: [USER_ID_KEY],
      aggregate: {
        [AGGREGATE_KEY]: AGGREGATE_EXPR
      }
    })
    expect(clause.text).to.contain(`${USER_ID_COLUMN} AS ${USER_ID_KEY}`)
    expect(clause.text).to.contain(`${AGGREGATE_EXPR} AS ${AGGREGATE_KEY}`)
    expect(clause.values).to.be.empty
  })
})

describe('getWhereClause', () => {
  it('should return an empty query for no queries', () => {
    expect(getWhereClause({
      table: USERS_TABLE,
      queries: {}
    })).to.deep.equal(EMPTY_SQL)
  })
  it('should throw an error for an invalid column', () => {
    expect(() => getWhereClause({
      table: USERS_TABLE,
      queries: {
        [INVALID_KEY]: 'value'
      }
    })).to.throw('invalid column')
  })
  it('should return an equals query for a basic query', () => {
    const userId = 1
    expect(getWhereClause({
      table: USERS_TABLE,
      queries: {
        [USER_ID_KEY]: userId
      }
    })).to.deep.equal({
      text: `WHERE ${USER_ID_COLUMN} = ?`,
      values: [userId]
    })
  })
  it('should return multiple operations on one column', () => {
    const userIdGt = 1
    const userIdLt = 9
    expect(getWhereClause({
      table: USERS_TABLE,
      queries: {
        [USER_ID_KEY]: {
          '>': userIdGt,
          '<': userIdLt
        }
      }
    })).to.deep.equal({
      text: `WHERE ${USER_ID_COLUMN} > ? AND ${USER_ID_COLUMN} < ?`,
      values: [userIdGt, userIdLt]
    })
  })
  it('should return a query on multiple columns', () => {
    const userId = 1
    const userName = 'admin'
    expect(getWhereClause({
      table: USERS_TABLE,
      queries: {
        [USER_ID_KEY]: userId,
        [USER_NAME_KEY]: userName
      }
    })).to.deep.equal({
      text: `WHERE ${USER_ID_COLUMN} = ? AND ${USER_NAME_COLUMN} = ?`,
      values: [userId, userName]
    })
  })
  it('should return a query with constraints', () => {
    expect(getWhereClause({
      table: ACTIVE_USERS_TABLE,
      queries: {}
    })).to.deep.equal({
      text: `WHERE ${USER_ACTIVE_COLUMN} = ?`,
      values: ['Y']
    })
  })
  it('should return a query with constraints and queries on different columns', () => {
    const userId = 1
    expect(getWhereClause({
      table: ACTIVE_USERS_TABLE,
      queries: {
        [USER_ID_KEY]: userId
      }
    })).to.deep.equal({
      text: `WHERE ${USER_ACTIVE_COLUMN} = ? AND ${USER_ID_COLUMN} = ?`,
      values: ['Y', userId]
    })
  })
  it('should return a query with constraints and queries on the same column', () => {
    expect(getWhereClause({
      table: ACTIVE_USERS_TABLE,
      queries: {
        [USER_ACTIVE_KEY]: 'N'
      }
    })).to.deep.equal({
      text: `WHERE ${USER_ACTIVE_COLUMN} = ? AND ${USER_ACTIVE_COLUMN} = ?`,
      values: ['Y', 'N']
    })
  })
})

describe('getIdWhereClause', () => {
  it('should return an error when id column is missing', () => {
    expect(() => getIdWhereClause({
      table: USERS_TABLE,
      queries: {}
    })).to.throw('missing id column')
  })
  it('should return a query on the id column', () => {
    const params = {
      table: USERS_TABLE,
      queries: {
        [USER_ID_KEY]: 1
      }
    }
    expect(getIdWhereClause(params)).to.deep.equal(getWhereClause(params))
  })
  it('should omit non-id columns from query', () => {
    const queries = {[USER_ID_KEY]: 1}
    const queriesExtra = {...queries, [USER_NAME_KEY]: 'admin'}
    expect(getIdWhereClause({
      table: USERS_TABLE,
      queries: queriesExtra
    })).to.deep.equal(getWhereClause({
      table: USERS_TABLE,
      queries
    }))
  })
})

describe('getGroupClause', () => {
  const aggregate = {
    [AGGREGATE_KEY]: AGGREGATE_EXPR
  }
  it('should return an empty query for no aggregations', () => {
    expect(getGroupClause({
      table: USERS_TABLE,
      columns: [USER_ID_KEY]
    })).to.deep.equal(EMPTY_SQL)
  })
  it('should return an empty query for no columns', () => {
    expect(getGroupClause({
      table: USERS_TABLE,
      columns: [],
      aggregate
    })).to.deep.equal(EMPTY_SQL)
  })
  it('should throw an error for an invalid column', () => {
    expect(() => getGroupClause({
      table: USERS_TABLE,
      columns: [INVALID_KEY],
      aggregate
    })).to.throw('invalid column')
  })
  it('should return a clause for one column', () => {
    expect(getGroupClause({
      table: USERS_TABLE,
      columns: [USER_ID_KEY],
      aggregate
    })).to.deep.equal({
      text: `GROUP BY ${USER_ID_COLUMN}`,
      values: []
    })
  })
  it('should return an error for multiple columns', () => {
    expect(getGroupClause({
      table: USERS_TABLE,
      columns: [USER_ID_KEY, USER_NAME_KEY],
      aggregate
    })).to.deep.equal({
      text: `GROUP BY ${USER_ID_COLUMN}, ${USER_NAME_COLUMN}`,
      values: []
    })
  })
})

describe('getOrderClause', () => {
  it('should return an empty query for no sort', () => {
    expect(getOrderClause({
      table: USERS_TABLE
    })).to.deep.equal(EMPTY_SQL)
  })
  it('should throw an error for an invalid column as a string', () => {
    expect(() => getOrderClause({
      table: USERS_TABLE,
      sort: INVALID_KEY
    })).to.throw('invalid column')
  })
  it('should return a clause for a column as a string', () => {
    expect(getOrderClause({
      table: USERS_TABLE,
      sort: USER_ID_KEY
    })).to.deep.equal({
      text: `ORDER BY ${USER_ID_COLUMN} ASC`,
      values: []
    })
  })
  it('should throw an error for an invalid column as an object', () => {
    expect(() => getOrderClause({
      table: USERS_TABLE,
      sort: {
        column: INVALID_KEY,
        desc: false
      }
    })).to.throw('invalid column')
  })
  it('should return a clause for a column as an object, ascending', () => {
    expect(getOrderClause({
      table: USERS_TABLE,
      sort: {
        column: USER_ID_KEY,
        desc: false
      }
    })).to.deep.equal({
      text: `ORDER BY ${USER_ID_COLUMN} ASC`,
      values: []
    })
  })
  it('should return a clause for a column as an object, descending', () => {
    expect(getOrderClause({
      table: USERS_TABLE,
      sort: {
        column: USER_ID_KEY,
        desc: true
      }
    })).to.deep.equal({
      text: `ORDER BY ${USER_ID_COLUMN} DESC`,
      values: []
    })
  })
})

describe('getInsertClause', () => {
  it('should throw an error if no values specified', () => {
    expect(() => getInsertClause({
      table: USERS_TABLE,
      values: {}
    })).to.throw('no values')
  })
  it('should throw an error for an invalid column', () => {
    expect(() => getInsertClause({
      table: USERS_TABLE,
      values: {
        [INVALID_KEY]: 'value'
      }
    })).to.throw('invalid column')
  })
  it('should return a clause for one column', () => {
    const userId = 1
    expect(getInsertClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: userId
      }
    })).to.deep.equal({
      text: `(${USER_ID_COLUMN}) VALUES (?)`,
      values: [userId]
    })
  })
  it('should return a clause for multiple columns', () => {
    const userId = 1
    const userName = 'admin'
    expect(getInsertClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: userId,
        [USER_NAME_KEY]: userName
      }
    })).to.deep.equal({
      text: `(${USER_ID_COLUMN}, ${USER_NAME_COLUMN}) VALUES (?, ?)`,
      values: [userId, userName]
    })
  })
})

describe('getUpdateClause', () => {
  it('should throw an error if no values specified', () => {
    expect(() => getUpdateClause({
      table: USERS_TABLE,
      values: {}
    })).to.throw('no updates')
  })
  it('should throw an error if only id values specified', () => {
    expect(() => getUpdateClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: 1
      }
    })).to.throw('no updates')
  })
  it('should throw an error for an invalid column', () => {
    expect(() => getUpdateClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: 1,
        [INVALID_KEY]: 'value'
      }
    })).to.throw('invalid column')
  })
  it('should update a single column', () => {
    const userName = 'admin'
    expect(getUpdateClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: 1,
        [USER_NAME_KEY]: userName
      }
    })).to.deep.equal({
      text: `${USER_NAME_COLUMN} = ?`,
      values: [userName]
    })
  })
  it('should update multiple column', () => {
    const userName = 'admin'
    const active = 'Y'
    expect(getUpdateClause({
      table: USERS_TABLE,
      values: {
        [USER_ID_KEY]: 1,
        [USER_NAME_KEY]: userName,
        [USER_ACTIVE_KEY]: active
      }
    })).to.deep.equal({
      text: `${USER_NAME_COLUMN} = ?, ${USER_ACTIVE_COLUMN} = ?`,
      values: [userName, active]
    })
  })
})
