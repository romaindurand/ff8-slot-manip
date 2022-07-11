<script context="module">
  export const prerender = true;
</script>

<script>
  import { slide, fly } from 'svelte/transition';
  import AutoComplete from "simple-svelte-autocomplete";
  import RNGMap from "../data/RNGMap.json";
  import spellTableFR from "../data/table.json";
  import spellTableEN from "../data/tableEN.json";

  let selectedSpell1, selectedSpell2, selectedSpell3;
  let deadCharacters = 0;
  let maxHp = 482;
  let currentHp = maxHp;
  let showRawData = false;
  let showManipCheckbox

  let lang = "FR";
  $: spellTable = lang === "FR" ? spellTableFR : spellTableEN;

  let manip;

  $: computedTable = RNGMap.map((row) => {
    return {
      ...row,
      current_crisis_level: computeCrisisLevel(row.random_mod, currentHp),
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
    return {
      ...row,
      spell_name1: spellName1,
      spell_name2: spellName2,
      spell_name3: spellName3,
      black_dot: row.table === 4 && row.current_crisis_level === 4,
    };
  });

  $: filteredComputedTable = computedTable
    .filter((row) => row.current_crisis_level > 0)
    .filter((row) => {
      if (!selectedSpell1) return true;
      return row.spell_name1 === selectedSpell1;
    })
    .filter((row) => {
      if (!selectedSpell2) return true;
      return row.spell_name2 === selectedSpell2;
    })
    .filter((row) => {
      if (!selectedSpell3) return true;
      return row.spell_name3 === selectedSpell3;
    });

  

  $: autocompleteSpells1 = filteredComputedTable
    .map((row) => row.spell_name1)
    .filter((spell, index, spells) => {
      return spells.indexOf(spell) === index;
    })
    .sort();

  $: autocompleteSpells2 = filteredComputedTable
    .map((row) => row.spell_name2)
    .filter((spell, index, spells) => {
      return spells.indexOf(spell) === index;
    })
    .sort();

  $: autocompleteSpells3 = filteredComputedTable
    .map((row) => row.spell_name3)
    .filter((spell, index, spells) => {
      return spells.indexOf(spell) === index;
    })
    .sort();

  function computeCrisisLevel(random_mod, currentHp) {
    const hpMod = Math.floor((2500 * currentHp) / maxHp);
    const deathBonus = deadCharacters * 200 + 1600;
    const statusBonus = 0 * 10;
    const limitLevel = Math.floor(
      (statusBonus + deathBonus - hpMod) / (random_mod + 160)
    );

    if (limitLevel <= 4) return 0;
    if (limitLevel === 5) return 1;
    if (limitLevel === 6) return 2;
    if (limitLevel === 7) return 3;
    return 4;
  }

  function resetSpells() {
    selectedSpell1 = "";
    selectedSpell2 = "";
    selectedSpell3 = "";
  }

  $: spellList = [selectedSpell1, selectedSpell2, selectedSpell3].filter(
    (spell) => spell
  );
  $: spellOrder = spellList.length;
  $: {
    if (filteredComputedTable.length === 1) {
      manip = computeManip(filteredComputedTable[0], spellOrder);
      showManipCheckbox.checked = true
    } else {
      manip = null;
    }
  }

  function computeManip(
    { random_mod, rng, table, entry, current_crisis_level },
    spellOrder
  ) {
    const currentRng = (rng + spellOrder * 4) % 256;
    if (table === 4 && current_crisis_level === 4) {
      let delta = 183 - currentRng;
      if (delta < 0) delta += 256;
      return `do-over x${delta / 4}`;
    }

    const blackDots = computedTable
      .filter((row) => row.black_dot)
      .map((row) => row.rng);
    console.log({ blackDots });

    const closestBlackDot =
      blackDots.find((blackDot) => {
        return blackDot >= rng;
      }) || blackDots[0];
    console.log({ closestBlackDot });

    if (table === 4) {
      const doOver1 = (closestBlackDot - 4 - currentRng) / 4;
      const skipTurn = 4;
      let delta = 183 - closestBlackDot;
      if (delta < 0) delta += 256;
      const doOver2 = delta / 4 - 1;
      return `do-over \tx${doOver1} \nskip-turn \tx${skipTurn} \ndo-over \tx${doOver2}`;
    }

    let delta1 = closestBlackDot - currentRng;
    if (delta1 < 0) delta1 += 256;
    const doOver1 = delta1 <= 4 ? 0 : Math.floor(delta1 / 4);
    const skipTurn = delta1 % 4;
    let delta2 = 183 - closestBlackDot;
    if (delta2 < 0) delta2 += 256;
    const doOver2 = delta2 / 4 - 1;
    return `do-over \tx${doOver1} \nskip-turn \tx${skipTurn} \ndo-over \tx${doOver2}`;
  }

  function toggleLang() {
    lang = lang === "FR" ? "EN" : "FR";
    resetSpells();
  }
</script>

<h1>Welcome To the Slot Manipulation</h1>
<p>
  Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End
</p>

<button class="btn toggle-lang" on:click={toggleLang}>{lang}</button>

<div class="form-control w-full max-w-xs">
  <label class="label" for="hp">
    <span class="label-text">Current Selphie's HP</span>
  </label>
  <input
    id="hp"
    type="number"
    placeholder="Current Selphie's HP"
    class="input input-primary input-bordered w-full max-w-xs"
    bind:value={currentHp}
  />
  <AutoComplete
    placeholder="1st Spell"
    inputClassName="input input-primary input-bordered w-full max-w-xs"
    items={autocompleteSpells1}
    bind:selectedItem={selectedSpell1}
  />
  {#if selectedSpell1}
    <AutoComplete
      placeholder="2nd Spell"
      inputClassName="input input-primary input-bordered w-full max-w-xs"
      items={autocompleteSpells2}
      bind:selectedItem={selectedSpell2}
    />
  {/if}
  {#if selectedSpell2}
    <AutoComplete
      placeholder="3rd Spell"
      inputClassName="input input-primary input-bordered w-full max-w-xs"
      items={autocompleteSpells3}
      bind:selectedItem={selectedSpell3}
    />
  {/if}
  {#if spellOrder}
    <button
      class="btn btn-error"
      on:click={resetSpells}
      transition:fly="{{ x: -200, duration: 300 }}"
    >
      reset spells
    </button>
  {/if}
</div>

{#if filteredComputedTable.length > 0}
<button
  transition:fly="{{ x: -200, duration: 300 }}"
  class="btn btn-info btn-small"
  on:click={() => {
    showRawData = !showRawData;
  }}
>
  {showRawData ? 'Hide' : 'Show'} raw data
</button>
{/if}

{#if showRawData && filteredComputedTable.length > 0}
<pre class="raw-data max-w-sm" transition:slide>
{JSON.stringify(filteredComputedTable, null, 2)}
</pre>
{/if}



{#if filteredComputedTable.length === 1}
  <div>
    <label
      for="modal-manip"
      class="btn btn-success modal-button">
      Show manipulation
    </label>
  </div>
  <!-- <h2>Manip</h2>
  <p>
    {manip}
  </p> -->
{/if}


<!-- Put this part before </body> tag -->
<input type="checkbox" id="modal-manip" class="modal-toggle" bind:this={showManipCheckbox}/>
<label for="modal-manip" class="modal cursor-pointer">
  <label class="modal-box relative" for="">
    <h3 class="text-lg font-bold">Manipulation</h3>
    <pre class="py-4">{manip}</pre>
  </label>
</label>




<style>
  h1,
  h2 {
    font: revert;
  }

  .btn-error, :global(.autocomplete), p, input, .btn, pre {
    margin-bottom: 1rem;
  }

  .toggle-lang {
    position: absolute;
    top: 2rem;
    right: 2rem;
  }

  pre {
    padding: 1rem;
    background-color: #555;
    color: white;
  }
</style>
