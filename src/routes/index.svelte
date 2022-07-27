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
  import Faq from '../components/FAQ.svelte';
  import getManip from '../lib/manip.js'

  console.log('%cSubmit your questions to Kaivel, on Github, or on Twitter @romaindurand', 'font-size: 1.5em; font-weight: bold; color: #ff0000;');

  let selectedSpell1, selectedSpell2, selectedSpell3;
  let deadCharacters = 0;
  let currentHp = 34;
  let showRawData = false;
  let auraChecked = false;
  let showManipCheckbox
  let category
  let maxHp

  $: {
    maxHp = {
      'Any%': 482,
      '100%': 9576,
      'NoJunction' : 3680,
      'NoJunction/NoLevel' : 482
    }[category];
    currentHp = currentHp;
  }
  let lang = "FR";
  $: spellTable = lang === "FR" ? spellTableFR : lang === "EN" ? spellTableEN : spellTableJP;

  let manip;

  $: computedTable = RNGMap.map((row) => {
    return {
      ...row,
      current_crisis_level: computeCrisisLevel(row.random_mod, currentHp, auraChecked, maxHp),
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

  function computeCrisisLevel(random_mod, currentHp, auraChecked, maxHp) {
    const hpMod = Math.floor((2500 * currentHp) / maxHp);
    const deathBonus = deadCharacters * 200 + 1600;
    let statusSum = 0
    if (auraChecked && category === '100%') {
      statusSum += 200
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
      const currentTable = filteredComputedTable[0].table
      const currentCrisis = filteredComputedTable[0].current_crisis_level
      const currentRNG = filteredComputedTable[0].rng
      manip = getManip(
        currentTable,
        currentCrisis,
        currentRNG,
        category,
        computedTable,
        spellOrder,
      )
      // filteredComputedTable[0], spellOrder, computedTable, category);
      showManipCheckbox.checked = true
    } else {
      manip = null;
    }
  }

  function switchLang(targetLang) {
    lang = targetLang;
    resetSpells();
  }
</script>
<div class="main-content max-w-lg">
  <h1>Slot Manipulation</h1>
  
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
    <select bind:value={category} class="select select-primary w-full max-w-xs">
      <option selected>Any%</option>
      <option>100%</option>
      <option>NoJunction</option>
      <option>NoJunction/NoLevel</option>
    </select>
  <Faq category={category}/>

  
  {#if category === '100%'}  
  <label transition:slide class="label cursor-pointer">
      <span class="label-text">Aura status ?</span> 
      <input type="checkbox" class="checkbox" bind:checked={auraChecked}/>
    </label>
    {/if}
  
    <p>MaxHP : {maxHp}</p>
    <p>CurrentHp : {currentHp}</p>
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

  .btn-error, :global(.autocomplete), input, .btn, pre, ul, select {
    margin-bottom: 1rem;
  }

  :global(.autocomplete) {
    padding-left: 0;
    padding-right: 0;

  }
  :global(input.input.input-primary.autocomplete-input) {
    height: 2.5rem;
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
