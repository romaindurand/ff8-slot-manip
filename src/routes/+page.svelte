<script>
  import { run } from "svelte/legacy";
  import "../app.css";

  import { slide, fly } from "svelte/transition";
  import AutoComplete from "simple-svelte-autocomplete";
  import ToggleLang from "../components/ToggleLang.svelte";
  import Faq from "../components/FAQ.svelte";
  import spellTable100 from "../data/table100.json";
  import spellTableFR from "../data/table.json";
  import { getSpells, getTranslatedSpell } from "../lib/i18n";
  import getManip, {
    filterComputedTable,
    generateAutoCompleteSpells,
    generateComputedTable,
  } from "../lib/manip.js";
  import Collapsible from "../components/Collapsible.svelte";

  console.log(
    "%cSubmit your questions to Kaivel, on Github, or on Twitter @romaindurand",
    "font-size: 1.5em; font-weight: bold; color: #ff0000;"
  );

  let deadCharacters = $state(0);
  let currentHp = $state(34);
  let showRawData = $state(false);
  let auraChecked = $state(false);
  let blindChecked = $state(false);
  let silenceChecked = $state(false);
  let slowChecked = $state(false);
  let poisonChecked = $state(false);
  let gradualChecked = $state(false);
  let doomChecked = $state(false);
  let showManipCheckbox = $state();
  let category = $state();
  let maxHp = $state();
  let lang = $state("FR");
  let spellTable = $state(getSpells(lang));

  let levels = ["8 or 9", "100"];
  let currentLevel = $state(levels[0]);
  run(() => {
    if (currentLevel === "8 or 9") {
      spellTable = spellTableFR;
    } else {
      spellTable = spellTable100;
    }
  });

  let selectedSpell1 = $state(),
    selectedSpell2 = $state(),
    selectedSpell3 = $state(),
    selectedSpell4 = $state();
  let currentEnemy = $state("Odin");
  const enemies = ["Odin", "BGH251F2"];

  run(() => {
    if (currentEnemy === "BGH251F2") {
      maxHp = 482;
      currentHp = 60;
    } else {
      maxHp = 9576;
      currentHp = 520;
    }
  });

  const targetableSpells100percent = [
    "The End (1)",
    "Joobu (1)",
    "Wall (1)",
    "Arkange (1)",
  ];

  const targetablesSpellsNoJNoL = [
    "The End (1)",
    "Cyanure (1)",
    "Mégalith (2)",
    "Mégalith (3)",
    "Morphée (2)",
    "Morphée (3)",
    "Cécité (2)",
    "Cécité (3)",
    "Aphasie (2)",
    "Aphasie (3)",
    "Ultima (1)",
    "Ultima (2)",
  ];

  let targetableSpells = $derived(
    (
      {
        "100%": targetableSpells100percent,
        "NoJunction/NoLevel": targetablesSpellsNoJNoL,
        Custom: targetableSpells100percent,
      }[category] || []
    ).map((spell) => {
      return {
        translatedSpell: getTranslatedSpell(spell, lang),
        spell,
      };
    })
  );
  const defaultTargetedSpell = {
    translatedSpell: "The End (1)",
    spell: "The End (1)",
  };
  let targetedSpell = $state(defaultTargetedSpell);

  run(() => {
    if (category === "Any%" || category === "NoJunction")
      targetedSpell = defaultTargetedSpell;
  });

  run(() => {
    maxHp = {
      "Any%": 482,
      "100%": 9576,
      NoJunction: 3680,
      "NoJunction/NoLevel": 482,
      Custom: 9999,
    }[category];
    // currentHp = currentHp;
  });

  run(() => {
    if (category === "100%") currentHp = 520;
    if (category === "Any%") currentHp = 34;
    if (category === "NoJunction/NoLevel" || category === "NoJunction")
      currentHp = 1;
    if (category === "Custom") currentHp = 482;
  });

  let manip = $state();

  let computedTable = $derived(
    generateComputedTable({
      currentHp,
      auraChecked,
      blindChecked,
      silenceChecked,
      slowChecked,
      poisonChecked,
      gradualChecked,
      doomChecked,
      maxHp,
      category,
      deadCharacters,
      spellTable,
    })
  );
  run(() => {
    console.table(computedTable);
  });

  let filteredComputedTable = $derived(
    filterComputedTable(computedTable, [
      selectedSpell1,
      selectedSpell2,
      selectedSpell3,
      selectedSpell4,
    ])
  );

  let autocompleteSpells1 = $derived(
    generateAutoCompleteSpells(filteredComputedTable, 1)
  );
  let autocompleteSpells2 = $derived(
    generateAutoCompleteSpells(filteredComputedTable, 2)
  );
  let autocompleteSpells3 = $derived(
    generateAutoCompleteSpells(filteredComputedTable, 3)
  );
  let autocompleteSpells4 = $derived(
    generateAutoCompleteSpells(filteredComputedTable, 4)
  );

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

  let spellList = $derived(
    [selectedSpell1, selectedSpell2, selectedSpell3, selectedSpell4].filter(
      (spell) => spell
    )
  );
  let spellOrder = $derived(spellList.length);
  run(() => {
    if (filteredComputedTable.length === 1) {
      const currentTable = filteredComputedTable[0].table;
      const currentCrisis = filteredComputedTable[0].current_crisis_level;
      const currentRNG = filteredComputedTable[0].rng;
      manip = getManip(
        currentTable,
        currentCrisis,
        currentRNG,
        category,
        computedTable,
        spellOrder,
        targetedSpell.spell
      );
      showManipCheckbox.checked = true;
    } else {
      manip = null;
    }
  });

  function switchLang(event) {
    spellTable = event.detail.spellTable;
    lang = event.detail.lang;
    resetSpells();
    targetedSpell = {
      translatedSpell: getTranslatedSpell(targetedSpell.spell, lang),
      spell: targetedSpell.spell,
    };
  }
</script>

<div class="main-content max-w-lg">
  <h1>Slot Manipulation</h1>

  <ToggleLang on:toggle={switchLang} />

  <div class="form-control w-full max-w-xs">
    <select bind:value={category} class="select select-primary w-full max-w-xs">
      <option selected>Any%</option>
      <option>100%</option>
      <option>NoJunction</option>
      <option>NoJunction/NoLevel</option>
      <option>Custom</option>
    </select>
    <Faq {category} />

    {#if category !== "Any%"}
      <Collapsible title="Dead characters">
        <label class="label" for="deadchars">
          <span class="label-text">Dead characters</span>
        </label>
        <input
          id="deadchars"
          min="0"
          max="2"
          type="number"
          placeholder="Dead characters"
          class="input input-primary input-bordered w-full max-w-xs"
          bind:value={deadCharacters}
        />
      </Collapsible>
      <Collapsible title="Status">
        {#if ["100%", "NoJunction", "Custom"].includes(category)}
          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Aura status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={auraChecked}
            />
          </label>
        {/if}

        {#if ["NoJunction", "NoJunction/NoLevel", "Custom"].includes(category)}
          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Blind status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={blindChecked}
            />
          </label>
        {/if}

        {#if ["NoJunction", "NoJunction/NoLevel", "Custom"].includes(category)}
          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Silence status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={silenceChecked}
            />
          </label>
        {/if}

        {#if ["NoJunction/NoLevel", "Custom"].includes(category)}
          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Slow status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={slowChecked}
            />
          </label>
        {/if}

        {#if category === "Custom"}
          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Poison status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={poisonChecked}
            />
          </label>

          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Gradual petrify status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={gradualChecked}
            />
          </label>

          <label transition:slide|global class="label cursor-pointer">
            <span class="label-text">Doom status ?</span>
            <input
              type="checkbox"
              class="checkbox"
              bind:checked={doomChecked}
            />
          </label>
        {/if}
      </Collapsible>
    {/if}
    <p>MaxHP : {maxHp}</p>
    <p>CurrentHp : {currentHp}</p>

    {#if category === "100%"}
      <AutoComplete
        placeholder="Current enemy"
        inputClassName="input input-secondary input-bordered w-full max-w-xs"
        items={enemies}
        bind:selectedItem={currentEnemy}
      />
    {/if}

    {#if category === "Custom"}
      <label class="label" for="currentlevel">
        <span class="label-text">Current Selphie's level</span>
      </label>
      <AutoComplete
        placeholder="Current Selphie's level"
        inputClassName="input input-secondary input-bordered w-full max-w-xs"
        items={levels}
        bind:selectedItem={currentLevel}
      />

      <label class="label" for="maxhp">
        <span class="label-text">Selphie's max HP</span>
      </label>
      <input
        id="maxhp"
        min="482"
        max="9999"
        type="number"
        placeholder="Selphie's max HP"
        class="input input-primary input-bordered w-full max-w-xs"
        bind:value={maxHp}
      />
    {/if}

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

    {#if category !== "Any%" && category !== "NoJunction"}
      <label class="label" for="targetedSpell">
        <span class="label-text">Targeted spell</span>
      </label>
      <AutoComplete
        placeholder="Targeted Spell"
        inputClassName="input input-secondary input-bordered w-full max-w-xs"
        items={targetableSpells}
        labelFieldName="translatedSpell"
        bind:selectedItem={targetedSpell}
      />
    {/if}

    <div class="grid-cols-4">
      <AutoComplete
        placeholder="1st Spell"
        inputClassName="input input-primary input-bordered w-full max-w-xs"
        items={autocompleteSpells1}
        bind:selectedItem={selectedSpell1}
      />
      {#if selectedSpell1 && !selectedSpell2 && !selectedSpell3 && !selectedSpell4}
        <button
          class="btn btn-outline btn-error reset-button"
          onclick={() => resetSpell(1)}>✕</button
        >
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
        <button
          class="btn btn-outline btn-error reset-button"
          onclick={() => resetSpell(2)}>✕</button
        >
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
        <button
          class="btn btn-outline btn-error reset-button"
          onclick={() => resetSpell(3)}>✕</button
        >
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
        <button
          class="btn btn-outline btn-error reset-button"
          onclick={() => resetSpell(4)}>✕</button
        >
      {/if}
    </div>
    {#if spellOrder}
      <button
        class="btn btn-error"
        onclick={resetSpells}
        transition:fly|global={{ x: -200, duration: 300 }}
      >
        reset spells
      </button>
    {/if}
  </div>

  {#if filteredComputedTable.length > 0}
    <button
      transition:fly|global={{ x: -200, duration: 300 }}
      class="btn btn-info btn-small"
      onclick={() => {
        showRawData = !showRawData;
      }}
    >
      {showRawData ? "Hide" : "Show"} raw data
    </button>
  {/if}

  {#if showRawData && filteredComputedTable.length > 0}
    <pre class="raw-data max-w-sm" transition:slide|global>{JSON.stringify(
        filteredComputedTable,
        null,
        2
      )}</pre>
  {/if}

  {#if filteredComputedTable.length === 1}
    <div>
      <label for="modal-manip" class="btn btn-success modal-button">
        Show manipulation
      </label>
    </div>
  {/if}

  <input
    type="checkbox"
    id="modal-manip"
    class="modal-toggle"
    bind:this={showManipCheckbox}
  />
  <label for="modal-manip" class="modal cursor-pointer">
    <label class="modal-box relative" for="">
      <h3 class="text-lg font-bold">Manipulation</h3>
      <pre class="py-4">{manip}</pre>
    </label>
  </label>
</div>

<a href="https://github.com/romaindurand/ff8-slot-manip" target="_blank">
  <img
    loading="lazy"
    width="130"
    height="130"
    src="https://github.blog/wp-content/uploads/2008/12/forkme_left_darkblue_121621.png?resize=130%2C130"
    class="github-corner"
    alt="Fork me on GitHub"
    data-recalc-dims="1"
  />
</a>

<style>
  h1 {
    font: revert;
    margin-bottom: 1rem;
  }

  :global(.max-w-xs) {
    max-width: 25rem;
  }

  .btn-error,
  :global(.autocomplete),
  input,
  .btn,
  pre,
  select {
    margin-bottom: 1rem;
  }

  :global(.autocomplete) {
    padding-left: 0;
    padding-right: 0;
  }
  :global(
      input.input.input-primary.autocomplete-input,
      input.input.input-secondary.autocomplete-input
    ) {
    height: 2.5rem;
  }

  :global(.ToggleLang) {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  pre {
    padding: 1rem;
    background-color: #555;
    color: white;
  }

  .reset-button {
    min-height: 2.5rem;
    height: 2.5rem;
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

    .github-corner:hover {
      opacity: 1;
    }
  }

  .main-content {
    margin: auto;
  }
</style>
