<script context="module">
  export const prerender = true;
</script>

<script>
  import { slide, fly } from 'svelte/transition';
  import AutoComplete from "simple-svelte-autocomplete";
  import RNGMap from "../data/RNGMap.json";
  import spellTableFR from "../data/table.json";
  import spellTableEN from "../data/tableEN.json";
  import spellTableJP from "../data/tableJP.json";

  console.log('%cSubmit your questions to Kaivel, on Github, or on Twitter @romaindurand', 'font-size: 1.5em; font-weight: bold; color: #ff0000;');

  let selectedSpell1, selectedSpell2, selectedSpell3;
  let deadCharacters = 0;
  let maxHp = 482;
  let currentHp = maxHp;
  let showRawData = false;
  let showManipCheckbox

  let lang = "FR";
  $: spellTable = lang === "FR" ? spellTableFR : lang === "EN" ? spellTableEN : spellTableJP;

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
      the_end_table: row.table === 4 && row.current_crisis_level === 4,
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
      .filter((row) => row.the_end_table)
      .map((row) => row.rng);

    const closestBlackDot =
      blackDots.find((blackDot) => {
        return blackDot >= rng;
      }) || blackDots[0];

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

  function switchLang(targetLang) {
    lang = targetLang;
    resetSpells();
  }
</script>
<div class="main-content max-w-lg">
  <h1>Slot Manipulation</h1>
  <ul class="w-full max-w-lg">
    <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
    <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
    <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li>
  </ul>
  
  <!-- <button class="btn toggle-lang" on:click={toggleLang}>{lang}</button> -->
  <div class="dropdown dropdown-end toggle-lang">
    <span tabindex="0" class="btn m-1">Spells language</span>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-primary rounded-box w-52">
      <li><button on:click={() => switchLang('FR')}>Français</button></li>
      <li><button on:click={() => switchLang('EN')}>English</button></li>
      <li><button on:click={() => switchLang('JP')}>Japanese</button></li>
    </ul>
  </div>
  
  <div class="form-control w-full max-w-xs">
    <label class="label" for="hp">
      <span class="label-text">Current Selphie's HP</span>
    </label>
    <input
      id="hp"
      min="1"
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
  <pre
    class="raw-data max-w-sm"
    transition:slide
  >{JSON.stringify(filteredComputedTable, null, 2)}</pre>
  {/if}
  
  {#if filteredComputedTable.length === 1}
    <div>
      <label
        for="modal-manip"
        class="btn btn-success modal-button">
        Show manipulation
      </label>
    </div>
  {/if}
  
  <input type="checkbox" id="modal-manip" class="modal-toggle" bind:this={showManipCheckbox}/>
  <label for="modal-manip" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">Manipulation</h3>
      <pre class="py-4">{manip}</pre>
    </label>
  </label>
</div>

<a href="https://github.com/romaindurand/ff8-slot-manip">
  <img
    loading="lazy"
    width="149"
    height="149"
    src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=149%2C149"
    class="github-corner"
    alt="Fork me on GitHub"
    data-recalc-dims="1">
  </a>

<style>
  h1 {
    font: revert;
    margin-bottom: 1rem;
  }

  .btn-error, :global(.autocomplete), input, .btn, pre, ul {
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

  ul {
    list-style-type: disc;
  }

  .github-corner {
    position: fixed;
    top: 0;
    left: 0;
    border: 0;
    z-index: 2;
    transition: opacity 0.3s;
  }

  @media (max-width: 680px) {
    .github-corner {
      opacity: 0.2;
    }
  }

  .main-content {
    margin: auto;
  }

  li button {
    color: white;
  }
</style>
