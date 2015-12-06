/* eslint-env mocha */
import Column from '../src/Column'
import { expect } from 'chai'

describe('Column', () => {
  const expr = 'UserID'

  describe('constructor', () => {
    it('should throw an error if expr is omitted', () => {
      expect(() => new Column({})).to.throw('option required')
    })
    it('should set the expression column', () => {
      expect(new Column({expr}).expr).to.equal(expr)
    })
    it('should be a non-id column by default', () => {
      expect(new Column({expr}).id).to.be.false
    })
    it('should set the id property', () => {
      expect(new Column({expr, id: true}).id).to.be.true
    })
    it('should not have constraints by default', () => {
      expect(new Column({expr}).constraint).to.deep.equal({})
    })
    it('should set the constraint property', () => {
      const constraint = {'>': 0}
      expect(new Column({expr, constraint}).constraint).to.deep.equal(constraint)
    })
  })
})
