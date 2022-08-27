import deepEqual from "deep-equal";
import RNGMap from "../data/RNGMap.json";
import spellTableFR from "../data/table.json";
import spellTableEN from "../data/tableEN.json";
import spellTableJP from "../data/tableJP.json";

export default function getManip(
  currentTable,
  currentCrisis,
  rng,
  category,
  computedTable,
  spellOrder,
  targetedSpellName
) {
  try {
    const manip = computeManip(
      currentTable,
      currentCrisis,
      rng,
      category,
      computedTable,
      spellOrder,
      targetedSpellName
    );

    return getManipText(manip);
  } catch {
    return "Error : manip not computable (yet).";
  }
}

function getManipText(manip) {
  if (manip.fastDoOver) return `do-over \tx${manip.fastDoOver}`;
  return `do-over \tx${manip.doOver1} \nskip-turn \tx${manip.skipTurn} \ndo-over \tx${manip.doOver2}`;
}

function getTargetTableCrisis(spellRNG, targetedSpellName) {
  const targetRow = RNGMap.find((row) => row.rng === spellRNG);
  const entry = targetRow.entry - 1;
  const table = targetRow.table;
  const crisisIndex =
    spellTableFR[table - 1].findIndex((crisis) => {
      return crisis[entry - 1] === targetedSpellName;
    }) + 1;
  return {
    targetTable: table,
    targetCrisis: crisisIndex,
  };
}

export function computeManip(
  currentTable,
  currentCrisis,
  rng,
  category,
  computedTable,
  spellOrder,
  targetedSpellName
) {
  const currentRNG = (rng + spellOrder * 4) % 256;

  //compute instances
  const spellInstances = computeSpellInstances(targetedSpellName);
  //find closest instance
  let closestSpellInstances = findClosestSpellInstances(
    currentRNG,
    spellInstances
  );
  //compute blackdots based on closest instances
  let blackDots = computeBlackDots(computedTable, closestSpellInstances);
  while (blackDots.length === 0) {
    closestSpellInstances = findClosestSpellInstances(
      closestSpellInstances[0].spellRNG,
      spellInstances
    );
    blackDots = computeBlackDots(computedTable, closestSpellInstances);
  }
  //find closest blackdot
  let closestBlackDot = computeClosestBlackDot(currentRNG, blackDots);
  let { targetTable, targetCrisis } = getTargetTableCrisis(
    closestBlackDot.spellRNG,
    targetedSpellName
  );

  if (currentTable === targetTable && currentCrisis === targetCrisis) {
    return {
      fastDoOver: computeFastDoOver(currentRNG, closestBlackDot.spellRNG),
    };
  }

  let doOver1, skipTurn, doOver2;
  let shouldUseNextInstances = false;
  let loopCount = 100;
  let updatedCurrentRNG;
  do {
    ({ targetTable, targetCrisis } = getTargetTableCrisis(
      closestBlackDot.spellRNG,
      targetedSpellName
    ));
    loopCount--;
    const delta1 = computeDelta1(closestBlackDot.rng, currentRNG);
    const delta2 = computeDelta2(closestBlackDot);
    doOver1 = computeDoOver1(delta1);
    skipTurn = computeSkipTurn(delta1);
    doOver2 = computeDoOver2(delta2);

    if (currentTable === targetTable) {
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

    updatedCurrentRNG = (currentRNG + doOver1 * 4 + skipTurn) % 256;
    // currentRNG <= closestBlackDot.spellRNG <= updatedCurrentRNG
    if (
      currentRNG <= closestBlackDot.spellRNG &&
      closestBlackDot.spellRNG <= updatedCurrentRNG
    ) {
      shouldUseNextInstances = true;
    }

    // cas category === '100%'
    if (skipTurn % 3 === 0 && skipTurn !== 0 && !shouldUseNextInstances) {
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

    // if (doOver1 === 0) doOver2 -=1

    do {
      // find next spell instances
      const newClosestSpellInstances = findClosestSpellInstances(
        closestSpellInstances[0].spellRNG,
        spellInstances
      );

      shouldUseNextInstances = false;
      if (
        blackDots.length ===
        0 /*|| currentRNG + doOver1*4 + skipTurn >= closestBlackDot.spellRNG*/
      ) {
        shouldUseNextInstances = true;
      }

      // currentRNG <= closestBlackDot.spellRNG <= updatedCurrentRNG
      if (
        currentRNG <= closestBlackDot.spellRNG &&
        closestBlackDot.spellRNG <= updatedCurrentRNG
      ) {
        shouldUseNextInstances = true;
      }

      // go next spell instance
      const doOver1Negative = doOver1 < 0;
      const manipTooLong = doOver1 * 4 + doOver2 * 4 + skipTurn > 256;
      if (
        deepEqual(newClosestSpellInstances, closestSpellInstances) ||
        computedTable.every((row) => row.current_crisis_level === 4) || // has aura
        ((manipTooLong || doOver1Negative) && !shouldUseNextInstances) // manip too long
      ) {
        // use next closest blackdot
        const blackDotIndex = blackDots.findIndex(
          (el) => el.rng === closestBlackDot.rng
        );
        closestBlackDot.rng =
          blackDots[blackDotIndex + 1]?.rng || blackDots[0].rng;
        shouldUseNextInstances = false;
      }
      if (shouldUseNextInstances) {
        closestSpellInstances = newClosestSpellInstances;
        // compute new blackdots based on new closest spell instances
        blackDots = computeBlackDots(computedTable, closestSpellInstances);

        // find closest black dot
        closestBlackDot = computeClosestBlackDot(currentRNG, blackDots);
      }
    } while (blackDots.length === 0);
  } while (
    (doOver1 < 0 || doOver2 < 0 || shouldUseNextInstances) &&
    loopCount > 0
  );
  if (loopCount <= 0) throw new Error("ERROR : loop count exceded");

  return {
    doOver1,
    skipTurn,
    doOver2,
  };
}

function computeSpellInstances(targetedSpellName) {
  let instances = [];
  for (let tableIndex = 0; tableIndex < spellTableFR.length; tableIndex++) {
    for (
      let crisisIndex = 0;
      crisisIndex < spellTableFR[tableIndex].length;
      crisisIndex++
    ) {
      for (
        let entryIndex = 0;
        entryIndex < spellTableFR[tableIndex][crisisIndex].length;
        entryIndex++
      ) {
        const spell = spellTableFR[tableIndex][crisisIndex][entryIndex];
        if (spell === targetedSpellName) {
          instances.push({
            table: tableIndex + 1,
            crisis: crisisIndex + 1,
            entry: entryIndex + 1,
          });
        }
      }
    }
  }

  const instancesWithRngs = instances
    .map((instance) => {
      const rngRow = RNGMap.find((row) => {
        return row.table === instance.table && row.entry === instance.entry;
      });

      return {
        ...instance,
        ...rngRow,
      };
    })
    .map((row) => {
      return {
        // ...row,
        spellEntry: row.rng,
        spellTable: row.table,
        entry: row.entry,
        spellCrisis: row.crisis,
        spellRNG: row.rng + 4,
      };
    })
    .sort((a, b) => {
      return a.spellRNG - b.spellRNG;
    });

  return instancesWithRngs;
}

function computeBlackDots(computedTable, closestSpellInstances) {
  const targetTableCrisis = [];
  closestSpellInstances.forEach((row) => {
    if (
      !targetTableCrisis.find(
        (target) =>
          target.table === row.spellTable && target.crisis === row.spellCrisis
      )
    ) {
      targetTableCrisis.push({
        crisis: row.spellCrisis,
        table: row.spellTable,
        spellRNG: row.spellRNG,
      });
    }
  });

  const blackDots = computedTable
    .map((row) => {
      return {
        ...row,
        blackDot: isBlackDot(targetTableCrisis, row),
        spellRNG: targetTableCrisis.find(checkBlackDot(row))?.spellRNG,
      };
    })
    .filter((row) => row.blackDot)
    .map((row) => {
      return {
        rng: row.rng,
        spellRNG: row.spellRNG,
      };
    });

  return blackDots;
}

function findClosestSpellInstances(currentRng, spellInstances) {
  let closestSpellInstance = spellInstances.find((spellInstance) => {
    return spellInstance.spellRNG > currentRng;
  });

  let closestSpellInstances;
  if (!closestSpellInstance) {
    closestSpellInstances = spellInstances.filter((spellInstance) => {
      return spellInstances[0].spellRNG === spellInstance.spellRNG;
    });
  } else {
    closestSpellInstances = spellInstances.filter((spellInstance) => {
      return closestSpellInstance.spellRNG === spellInstance.spellRNG;
    });
  }

  return [...closestSpellInstances];
}

function computeClosestBlackDot(currentRng, blackDots) {
  const closestBlackDot =
    blackDots.find((blackDot) => {
      return blackDot.rng > currentRng;
    }) || blackDots[0];

  return { ...closestBlackDot };
}

export function computeFastDoOver(currentRNG, targetedSpellRNG) {
  let doOver1 = Math.floor((targetedSpellRNG - currentRNG) / 4);
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
  let delta2 = closestBlackDot.spellRNG - closestBlackDot.rng;
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
  blindChecked,
  silenceChecked,
  slowChecked,
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

export function generateComputedTable({
  currentHp,
  auraChecked,
  blindChecked,
  silenceChecked,
  slowChecked,
  maxHp,
  category,
  deadCharacters,
  spellTable,
}) {
  return RNGMap.map((row) => {
    return {
      ...row,
      current_crisis_level: computeCrisisLevel(
        row.random_mod,
        currentHp,
        auraChecked,
        blindChecked,
        silenceChecked,
        slowChecked,
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
    const spellName2 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        computeRowEntryModulo(spellTable, row, 2)
      ];
    const spellName3 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        computeRowEntryModulo(spellTable, row, 3)
      ];
    const spellName4 =
      spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
        computeRowEntryModulo(spellTable, row, 4)
      ];
    return {
      ...row,
      spell_name1: spellName1,
      spell_name2: spellName2,
      spell_name3: spellName3,
      spell_name4: spellName4,
      // blackdot: row.table === 4 && row.current_crisis_level === 4,
    };
  });
}

function computeRowEntryModulo(spellTable, row, spellIndex) {
  return spellTable?.[row.table - 1]?.[row.current_crisis_level - 1]?.[
    row.entry + spellIndex - 2
  ]
    ? row.entry + (spellIndex - 2)
    : row.entry - 64 + (spellIndex - 2);
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

function isBlackDot(targetTableCrisis, row) {
  return targetTableCrisis.some(checkBlackDot(row));
}

function checkBlackDot(row) {
  return (target) =>
    target.table === row.table && target.crisis === row.current_crisis_level;
}

export function getTranslatedSpell(frenchSpell, targetLang) {
  const tableIndex = spellTableFR.findIndex((table) =>
    table.find((row) => row.includes(frenchSpell))
  );
  const crisisIndex = spellTableFR[tableIndex].findIndex((row) =>
    row.includes(frenchSpell)
  );
  const entryIndex = spellTableFR[tableIndex][crisisIndex].findIndex((row) =>
    row.includes(frenchSpell)
  );

  const currentSpellTable = {
    FR: spellTableFR,
    EN: spellTableEN,
    JP: spellTableJP,
  }[targetLang];

  const currentSpell = currentSpellTable[tableIndex][crisisIndex][entryIndex];
  return currentSpell;
}

export function filterComputedTable(computedTable, selectedSpells) {
  return computedTable
    .filter((row) => row.current_crisis_level > 0)
    .filter(filterBySelectedSpells(0, selectedSpells))
    .filter(filterBySelectedSpells(1, selectedSpells))
    .filter(filterBySelectedSpells(2, selectedSpells))
    .filter(filterBySelectedSpells(3, selectedSpells));
}
