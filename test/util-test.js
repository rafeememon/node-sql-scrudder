/* eslint-env mocha */
import { getOption, EMPTY_SQL, isEmptySql, joinsql } from '../src/util'
import { expect } from 'chai'
import { sql } from 'sql-composer'

describe('getOption', () => {
  it('should return the value if it exists', () => {
    const key = 'key'
    const value = 'value'
    expect(getOption({[key]: value}, key)).to.equal(value)
  })
  it('should throw an error if the value does not exist', () => {
    expect(() => getOption({}, 'key')).to.throw()
  })
  it('should return the default value if the value does not exist', () => {
    const value = 'value'
    expect(getOption({}, 'key', value)).to.equal(value)
  })
  it('should return the value if it exists and a default is given', () => {
    const key = 'key'
    const value = 'value'
    expect(getOption({[key]: value}, key, 'value2')).to.equal(value)
  })
})

describe('EMPTY_SQL', () => {
  it('should represent an empty query', () => {
    expect(EMPTY_SQL).to.deep.equal({
      text: '',
      values: []
    })
  })
})

describe('isEmptySql', () => {
  it('should return true for an empty query', () => {
    expect(isEmptySql(EMPTY_SQL)).to.be.true
  })
  it('should return false for a nonempty query', () => {
    expect(isEmptySql(sql`query`)).to.be.false
  })
})

describe('joinsql', () => {
  it('should return an empty query for no queries', () => {
    expect(joinsql([], ' AND ')).to.deep.equal(EMPTY_SQL)
  })
  it('should return the query for a single query', () => {
    const query = sql`UserID = ${1}`
    expect(joinsql([query], ' AND ')).to.deep.equal(query)
  })
  it('should return a joined query for multiple queries', () => {
    const query1 = sql`UserID = ${1}`
    const query2 = sql`UserState = ${'CA'}`
    const sep = ' AND '
    expect(joinsql([query1, query2], sep)).to.deep.equal({
      text: `${query1.text}${sep}${query2.text}`,
      values: query1.values.concat(query2.values)
    })
  })
  it('should return an empty query for an empty query', () => {
    expect(joinsql([EMPTY_SQL]), ' AND ').to.deep.equal(EMPTY_SQL)
  })
  it('should only return nonempty queries', () => {
    const query = sql`UserID = ${1}`
    expect(joinsql([query, EMPTY_SQL], ' AND ')).to.deep.equal(query)
  })
})
