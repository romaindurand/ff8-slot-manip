// export default function getManip(
//   { random_mod, rng, table, entry, current_crisis_level },
//   spellOrder,
//   computedTable,
//   category
// ) {
//   let doOver1, skipTurn, doOver2;
//   const availableAtb = category === "100%" ? 3 : 1;
//   const currentRng = (rng + spellOrder * 4) % 256;
//   if (table === 4 && current_crisis_level === 4) {
//     let delta = 183 - currentRng;
//     if (delta < 0) delta += 256;
//     return `do-over x${delta / 4}`;
//   }

//   /**
//    * @type {Array}
//    */
//   const blackDots = computedTable
//     .filter((row) => row.the_end_table)
//     .map((row) => row.rng);

//   const closestBlackDot =
//     blackDots.find((blackDot) => {
//       return blackDot > currentRng;
//     }) || blackDots[0];
//   console.log({ closestBlackDot });

//   if (table === 4) {
//     console.log("table === 4");
//     doOver1 = (closestBlackDot - 4 - currentRng) / 4;
//     if (doOver1 < 0 && category === "Any%") doOver1 += 64;
//     if (doOver1 < 0 && category === "100%") doOver1 += 64;
//     skipTurn = 4;
//     let delta = 183 - closestBlackDot;
//     if (delta < 0) delta += 256;
//     doOver2 = delta / 4 - 1;
//     if (doOver1 < 0 && category === "100%") {
//       console.log('doOver1 < 0 && category === "100%"');
//       console.log({ doOver1, skipTurn, doOver2 });
//       console.log({ closestBlackDot });
//       const blackDotIndex = blackDots.findIndex((el) => el === closestBlackDot);
//       const nextBlackDot = blackDots[blackDotIndex + 1] || blackDots[0];
//       console.log({ nextBlackDot });
//       debugger;
//       ({ doOver1, skipTurn, doOver2 } = computeManip(nextBlackDot, currentRng));
//       console.log({ doOver1, skipTurn, doOver2 });
//     }
//     return getManipText(doOver1, skipTurn, doOver2);
//   }

//   ({ doOver1, skipTurn, doOver2 } = computeManip(closestBlackDot, currentRng));

//   if (skipTurn !== availableAtb && category === "100%") {
//     console.log('skipTurn !== availableAtb && category === "100%"');
//     if (skipTurn === 4 || skipTurn === 1) {
//       console.log("skipTurn === 4 || skipTurn === 1");
//       while (doOver1 - 2 < 0) {
//         console.log("doOver1 - 2 < 0");

//         // bloc à exécuter si category === "100%"
//         const blackDotIndex = blackDots.findIndex(
//           (el) => el === closestBlackDot
//         );
//         const nextBlackDot = blackDots[blackDotIndex + 1] || blackDots[0];
//         ({ doOver1, skipTurn, doOver2 } = computeManip(
//           nextBlackDot,
//           currentRng
//         ));
//       }
//       return getManipText(doOver1 - 2, skipTurn + 8, doOver2);
//     }
//     if (skipTurn === 2) {
//       console.log("skipTurn === 2");
//       while (doOver1 - 1 < 0) {
//         console.log("doOver1 - 1 < 0");
//         const blackDotIndex = blackDots.findIndex(
//           (el) => el === closestBlackDot
//         );
//         const nextBlackDot = blackDots[blackDotIndex + 1] || blackDots[0];
//         ({ doOver1, skipTurn, doOver2 } = computeManip(
//           nextBlackDot,
//           currentRng
//         ));
//       }
//       return getManipText(doOver1 - 1, skipTurn + 4, doOver2);
//     }
//   }
//   return getManipText(doOver1, skipTurn, doOver2);
// }

// function computeManip(closestBlackDot, currentRng) {
//   let delta1 = closestBlackDot - currentRng;
//   if (delta1 < 0) delta1 += 256;
//   const doOver1 = delta1 <= 4 ? 0 : Math.floor(delta1 / 4);
//   const skipTurn = delta1 % 4;
//   let delta2 = 183 - closestBlackDot;
//   if (delta2 < 0) delta2 += 256;
//   const doOver2 = delta2 / 4 - 1;

//   return { doOver1, skipTurn, doOver2 };
// }

// function getManipText(do1, st, do2) {
//   return `do-over \tx${do1} \nskip-turn \tx${st} \ndo-over \tx${do2}`;
// }

// function alterManip(doOver1, skipTurn, doOver2, blackDots, closestBlackDot) {
//   if (skipTurn % 3 !== 0) {
//     if (skipTurn === 4 || skipTurn === 1) {
//       doOver1 -= 2;
//       skipTurn += 8;
//     }
//     if (skipTurn === 2) {
//       doOver1 -= 1;
//       skipTurn += 4;
//     }
//   }

//   if (doOver1 < 0) {
//     const blackDotIndex = blackDots.findIndex((el) => el === closestBlackDot);
//     const nextBlackDot = blackDots[blackDotIndex + 1] || blackDots[0];
//     ({ doOver1, skipTurn, doOver2 } = alterManip(
//       doOver1,
//       skipTurn,
//       doOver2,
//       blackDots,
//       nextBlackDot
//     ));
//   }

//   return { doOver1, skipTurn, doOver2 };
// }

// call (current RNG + crisis lvl + current hp + max hp + spelltarget + blackdot)

// DoOver2 = (theend[183] – currentRNG) / 4    if < 0 +64
// if current spelltarget is theend(table4+crisis4) need current table and current crisis > doOver2
// FINISH

// delta = closestBlackdot – 4 – current rng        If < 0 +-256
// delta2 = theend[183] - clostestBacldot           if < 0 +-256
// DoOver 1 = delta / 4                          if doOver1 < 0 +-64
// skipturn = delta % 4
// if current SpellTarget(table 4) need current table and do not have current crisis ==>DoOver1 – 1 ; Skip turn = 4         if doOver1 < 0 +-64
// DoOver 2 = theend[183] – delta2 / 4 – 1   if doOver2 < 0 +-64
// if category 100% then
// if skipturn = ! x3 ==> do transform
// if skipturn 1;4 > doOver1 -2 ; skipturn +8 ; doOver2 +0
// if skipturn 2 > doOver1 -1 ; skipturn +4 ; doOver2 +0
// if DoOver1 < 0  ==> go next blackdot

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

  return JSON.stringify(manip);
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
