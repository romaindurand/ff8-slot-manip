<script context="module">
  export const prerender = true;
</script>

<script>
  import { slide, fly } from 'svelte/transition';
  import AutoComplete from "simple-svelte-autocomplete";
  import spellTableFR from "../data/table.json";
  import spellTableEN from "../data/tableEN.json";
  import spellTableJP from "../data/tableJP.json";
  import Faq from '../components/FAQ.svelte';
  import getManip, { generateComputedTable } from '../lib/manip.js'

  console.log('%cSubmit your questions to Kaivel, on Github, or on Twitter @romaindurand', 'font-size: 1.5em; font-weight: bold; color: #ff0000;');

  let selectedSpell1, selectedSpell2, selectedSpell3, selectedSpell4;
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

  
  $: computedTable = generateComputedTable(currentHp, auraChecked, maxHp, category, deadCharacters, spellTable)

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
    })
    .filter((row) => {
      if (!selectedSpell4) return true;
      return row.spell_name4 === selectedSpell4;
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

  $: autocompleteSpells4 = filteredComputedTable
    .map((row) => row.spell_name4)
    .filter((spell, index, spells) => {
      return spells.indexOf(spell) === index;
    })
    .sort();  


  function resetSpells() {
    selectedSpell1 = "";
    selectedSpell2 = "";
    selectedSpell3 = "";
    selectedSpell4 = "";
  }

  function resetSpell(spellNumber) {
    if (spellNumber === 1) {
      selectedSpell1 = "";
    } else if (spellNumber === 2) {
      selectedSpell2 = "";
    } else if (spellNumber === 3) {
      selectedSpell3 = "";
    } else if (spellNumber === 4) {
      selectedSpell4 = "";
    }
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
    <div class="grid-cols-4">

      <AutoComplete
        placeholder="1st Spell"
        inputClassName="input input-primary input-bordered w-full max-w-xs"
        items={autocompleteSpells1}
        bind:selectedItem={selectedSpell1}
      />
      {#if selectedSpell1 && !selectedSpell2 && !selectedSpell3 && !selectedSpell4}
        <button class="btn btn-outline btn-error" on:click={() => resetSpell(1)}>✕</button>
      {/if}
      {#if selectedSpell1}
      <AutoComplete
      placeholder="2nd Spell"
      inputClassName="input input-primary input-bordered w-full max-w-xs"
      items={autocompleteSpells2}
      bind:selectedItem={selectedSpell2}
      />
      {/if}
      {#if selectedSpell2 && !selectedSpell3 && !selectedSpell4}
        <button class="btn btn-outline btn-error" on:click={() => resetSpell(2)}>✕</button>
      {/if}
      {#if selectedSpell2}
        <AutoComplete
          placeholder="3rd Spell"
          inputClassName="input input-primary input-bordered w-full max-w-xs"
          items={autocompleteSpells3}
          bind:selectedItem={selectedSpell3}
        />
      {/if}
      {#if selectedSpell3 && !selectedSpell4}
        <button class="btn btn-outline btn-error"  on:click={() => resetSpell(3)}>✕</button>
      {/if}
      {#if selectedSpell3}
        <AutoComplete
          placeholder="4th Spell"
          inputClassName="input input-primary input-bordered w-full max-w-xs"
          items={autocompleteSpells4}
          bind:selectedItem={selectedSpell4}
        />
      {/if}
      {#if selectedSpell4}
        <button class="btn btn-outline btn-error" on:click={() => resetSpell(4)}>✕</button>
      {/if}
    </div>
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
