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
  if (manip.fastDoOver) return `do-over \tx${manip.fastDoOver}`
  return `do-over \tx${manip.doOver1} \nskip-turn \tx${manip.skipTurn} \ndo-over \tx${manip.doOver2}`
}

function computeManip(
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

function computeFastDoOver(currentRNG) {
  let doOver1 = Math.floor((183 - currentRNG) / 4);
  if (doOver1 < 0) doOver1 += 64;
  return doOver1;
}

function computeDoOver1(delta1) {
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
