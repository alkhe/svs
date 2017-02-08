const { satisfies } = require('..')
const { expect } = require('chai')

describe('svs', () => {
	it('works on rays', () => {
		expect(satisfies('1.2.2', '>=1.0.0')).to.be.true
		expect(satisfies('0.5.7', '>1.0.0')).to.be.false
		expect(satisfies('1.5.4', '>1.4.6')).to.be.true
		expect(satisfies('1.3.4', '>1.4.6')).to.be.false
	})

	it('works on caret ranges', () => {
		expect(satisfies('1.2.2', '>=1.0.0 <2.0.0')).to.be.true
		expect(satisfies('3.0.5', '>=1.0.0 <2.0.0')).to.be.false
	})

	it('works on specific ranges', () => {
		expect(satisfies('1.3.4', '1.3.4')).to.be.true
		expect(satisfies('1.3.5', '1.3.4')).to.be.false
	})

	it('excludes prereleases', () => {
		expect(satisfies('1.3.4-beta', '>1.3.3')).to.be.false
	})

	it('satisfies prereleases with normal releases', () => {
		expect(satisfies('1.3.5', '>1.3.4-beta')).to.be.true
	})

	it('compares nested prereleases correctly', () => {
		expect(satisfies('1.0.0-beta.1', '>1.0.0-beta.1')).to.be.false
		expect(satisfies('1.0.0-beta.1.0', '>1.0.0-beta.1')).to.be.true
		expect(satisfies('1.0.0-beta.2.x.y', '>1.0.0-beta.1')).to.be.true
	})

	it('compares sets correctly', () => {
		expect(satisfies('1.0.0-beta', '>0.5.0')).to.be.false
		expect(satisfies('1.0.0-beta', '>0.5.0||>1.0.0-alpha')).to.be.true
		expect(satisfies('4.1.1', '>=1.0.0 <2.0.0||>=4.0.0')).to.be.true
	})
})
