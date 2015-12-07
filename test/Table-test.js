/* eslint-env mocha */
import Table from '../src/Table'
import { column } from '../src'
import { expect } from 'chai'

describe('Table', () => {
  const USER_ID_KEY = 'userId'
  const USER_ID_COLUMN = 'UserID'
  const options = {
    expr: 'Table',
    columns: {
      [USER_ID_KEY]: column(USER_ID_COLUMN, {id: true})
    }
  }
  const table = new Table(options)

  describe('constructor', () => {
    it('should throw an error if expr is omitted', () => {
      const { expr, ...other } = options // eslint-disable-line no-unused-vars
      expect(() => new Table(other)).to.throw('option required')
    })
    it('should throw an error if columns is omitted', () => {
      const { columns, ...other } = options // eslint-disable-line no-unused-vars
      expect(() => new Table(other)).to.throw('option required')
    })
  })
  describe('#getColumn', () => {
    it('should throw an error for an invalid column', () => {
      expect(() => table.getColumn('invalid')).to.throw('invalid column')
    })
    it('should return a valid column', () => {
      expect(table.getColumn(USER_ID_KEY).expr).to.equal(USER_ID_COLUMN)
    })
  })
  describe('#search', () => {
    it('should return a searcher', () => {
      expect(table.search()).to.be.a('function')
    })
  })
  describe('#read', () => {
    it('should return a reader', () => {
      expect(table.read()).to.be.a('function')
    })
  })
  describe('#create', () => {
    it('should return a creator', () => {
      expect(table.create()).to.be.a('function')
    })
  })
  describe('#delete', () => {
    it('should return a deleter', () => {
      expect(table.delete()).to.be.a('function')
    })
  })
})
