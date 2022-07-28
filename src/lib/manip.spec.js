import { describe, it, expect } from 'vitest'
import { computeDoOver1, computeFastDoOver, generateComputedTable, computeManip } from './manip'
import spellTable from "../data/table.json";

describe('compute fast do over', () => {
  it('should compute a fast do over', async () => {
    expect(computeFastDoOver(235)).toEqual(51)
  })
})

describe('compute do over 1', () => {
  it('should compute do over 1', async () => {
    expect(computeDoOver1(46)).toEqual(11)
    expect(computeDoOver1(42)).toEqual(10)
    expect(computeDoOver1(0)).toEqual(0)
  })
})

describe('compute manip', () => {
  it('should compute manip', async () => {
    let category = 'Any%'
    let currentCrisis = 1
    let currentTable = 2
    let rng = 125
    let spellOrder = 2
    let computedTable = generateComputedTable(34, false, 482, category, 0, spellTable)
    expect(computeManip(
      currentTable,
      currentCrisis,
      rng,
      category,
      computedTable,
      spellOrder)
    ).toEqual({
      doOver1: 11,
      skipTurn: 2,
      doOver2: 0
    })
  })

  it('should compute manip', async () => {
    let category = 'Any%'
    let currentCrisis = 2
    let currentTable = 4
    let rng = 203
    let spellOrder = 2
    let computedTable = generateComputedTable(34, false, 482, category, 0, spellTable)
    expect(computeManip(
      currentTable,
      currentCrisis,
      rng,
      category,
      computedTable,
      spellOrder)
    ).toEqual({
      doOver1: 4,
      skipTurn: 4,
      doOver2: 51
    })
  })

  it('should compute manip', async () => {
    let category = '100%'
    let currentCrisis = 3
    let currentTable = 4
    let rng = 203
    let spellOrder = 2
    let computedTable = generateComputedTable(34, false, 482, category, 0, spellTable)
    expect(computeManip(
      currentTable,
      currentCrisis,
      rng,
      category,
      computedTable,
      spellOrder)
    ).toEqual({
      doOver1: 2,
      skipTurn: 12,
      doOver2: 51
    })
  })
})