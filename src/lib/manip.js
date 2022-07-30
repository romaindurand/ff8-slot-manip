import RNGMap from "../data/RNGMap.json";

export default function getManip(
  currentTable,
  currentCrisis,
  rng,
  category,
  computedTable,
  spellOrder
) {
  const manip = computeManip(
    currentTable,
    currentCrisis,
    rng,
    category,
    computedTable,
    spellOrder
  );

  return getManipText(manip);
}

function getManipText(manip) {
  if (manip.fastDoOver) return `do-over \tx${manip.fastDoOver}`;
  return `do-over \tx${manip.doOver1} \nskip-turn \tx${manip.skipTurn} \ndo-over \tx${manip.doOver2}`;
}

export function computeManip(
  currentTable,
  currentCrisis,
  rng,
  category,
  computedTable,
  spellOrder
) {
  const currentRNG = (rng + spellOrder * 4) % 256;

  if (currentTable === 4 && currentCrisis === 4) {
    return {
      fastDoOver: computeFastDoOver(currentRNG),
    };
  }

  const blackDots = computeBlackDots(computedTable);
  let closestBlackDot = computeClosestBlackDot(currentRNG, blackDots);

  let doOver1, skipTurn, doOver2;
  do {
    const delta1 = computeDelta1(closestBlackDot, currentRNG);
    const delta2 = computeDelta2(closestBlackDot);
    doOver1 = computeDoOver1(delta1);
    skipTurn = computeSkipTurn(delta1);
    doOver2 = computeDoOver2(delta2);

    if (currentTable === 4) {
      doOver1 -= 1;
      if (doOver1 < 0) doOver1 += 64;
      skipTurn = 4;
    }

    if (skipTurn === 0) {
      switch (category) {
        case "100%":
          doOver1 -= 3;
          skipTurn += 12;
          break;

        case "Any%":
          doOver1 -= 1;
          skipTurn += 4;
          break;
      }
    }

    if (category !== "100%") {
      return { doOver1, skipTurn, doOver2 };
    }

    // cas category === '100%'
    if (skipTurn % 3 === 0 && skipTurn !== 0) {
      return { doOver1, skipTurn, doOver2 };
    }

    // transforms
    if (skipTurn === 1 || skipTurn === 4) {
      doOver1 -= 2;
      skipTurn += 8;
    }

    if (skipTurn === 2) {
      doOver1 -= 1;
      skipTurn += 4;
    }

    // find next black dot
    const blackDotIndex = blackDots.findIndex((el) => el === closestBlackDot);
    closestBlackDot = blackDots[blackDotIndex + 1] || blackDots[0];
  } while (doOver1 < 0);

  return {
    doOver1,
    skipTurn,
    doOver2,
  };
}

function computeBlackDots(computedTable) {
  return computedTable.filter((row) => row.the_end_table).map((row) => row.rng);
}

function computeClosestBlackDot(currentRng, blackDots) {
  const closestBlackDot =
    blackDots.find((blackDot) => {
      return blackDot > currentRng;
    }) || blackDots[0];

  return closestBlackDot;
}

export function computeFastDoOver(currentRNG) {
  let doOver1 = Math.floor((183 - currentRNG) / 4);
  if (doOver1 < 0) doOver1 += 64;
  return doOver1;
}

export function computeDoOver1(delta1) {
  let doOver1 = Math.floor(delta1 / 4);
  if (doOver1 < 0) doOver1 += 64;
  return doOver1;
}

function computeDelta1(closestBlackDot, currentRNG) {
  let delta1 = closestBlackDot - currentRNG;
  if (delta1 < 0) delta1 += 256;
  return delta1;
}

function computeDoOver2(delta2) {
  let doOver2 = Math.floor(delta2 / 4) - 1;
  if (doOver2 < 0) doOver2 += 64;
  return doOver2;
}

function computeDelta2(closestBlackDot) {
  let delta2 = 183 - closestBlackDot;
  if (delta2 < 0) delta2 += 256;
  return delta2;
}

function computeSkipTurn(delta) {
  let skipTurn = delta % 4;
  return skipTurn;
}

function computeCrisisLevel(
  random_mod,
  currentHp,
  auraChecked,
  maxHp,
  category,
  deadCharacters
) {
  const hpMod = Math.floor((2500 * currentHp) / maxHp);
  const deathBonus = deadCharacters * 200 + 1600;
  let statusSum = 0;
  if (auraChecked && category === "100%") {
    statusSum += 200;
  }
  if (blindChecked && category === "NoJunction/NoLevel") {
    statusSum += 30;
  }
  if (silenceChecked && category === "NoJunction/NoLevel") {
    statusSum += 30;
  }
  if (slowChecked && category === "NoJunction/NoLevel") {
    statusSum += 15;
  }
  const statusBonus = statusSum * 10;
  const limitLevel = Math.floor(
    (statusBonus + deathBonus - hpMod) / (random_mod + 160)
  );

  if (limitLevel <= 4) return 0;
  if (limitLevel === 5) return 1;
  if (limitLevel === 6) return 2;
  if (limitLevel === 7) return 3;
  return 4;
}

export function generateComputedTable(
  currentHp,
  auraChecked,
  maxHp,
  category,
  deadCharacters,
  spellTable
) {
  return RNGMap.map((row) => {
    return {
      ...row,
      current_crisis_level: computeCrisisLevel(
        row.random_mod,
        currentHp,
        auraChecked,
        maxHp,
        category,
        deadCharacters
      ),
    };
  }).map((row) => {
    const spellName1 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        row.entry - 1
      ];
    const rowEntryModulo = spellTable?.[row.table - 1]?.[
      row.current_crisis_level - 1
    ]?.[row.entry]
      ? row.entry
      : row.entry - 256;
    const spellName2 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        rowEntryModulo
      ];
    const spellName3 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        rowEntryModulo + 1
      ];
    const spellName4 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        rowEntryModulo + 2
      ];
    return {
      ...row,
      spell_name1: spellName1,
      spell_name2: spellName2,
      spell_name3: spellName3,
      spell_name4: spellName4,
      the_end_table: row.table === 4 && row.current_crisis_level === 4,
    };
  });
}

export function generateAutoCompleteSpells(
  filteredComputedTable,
  spellNameIndex
) {
  return filteredComputedTable
    .map((row) => row[`spell_name${spellNameIndex}`])
    .filter((spell, index, spells) => {
      return spells.indexOf(spell) === index;
    })
    .sort();
}

export function filterBySelectedSpells(selectedSpellIndex, selectedSpells) {
  return function (row) {
    const selectedSpell = selectedSpells[selectedSpellIndex];
    if (!selectedSpell) return true;
    return row[`spell_name${selectedSpellIndex + 1}`] === selectedSpell;
  };
}
