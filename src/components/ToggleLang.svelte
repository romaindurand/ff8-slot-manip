<script>
  import { createEventDispatcher } from "svelte";
  import clickOutside from "../lib/clickOutside.js";
  import { getSpells } from "../lib/i18n";

  export let currentLevel;

  const dispatch = createEventDispatcher();

  function toggleLang(targetLang) {
    dispatch("toggle", {
      spellTable: langs.find((lang) => lang.value === targetLang).spellTable,
      lang: targetLang,
    });
  }

  function toggleOpen() {
    if (isOpen) document.activeElement.blur();
    isOpen = !isOpen;
  }

  let isOpen = false;

  const langs = [
    {
      name: "Français",
      value: "FR",
      spellTable: getSpells("FR"),
    },
    {
      name: "English",
      value: "EN",
      spellTable: getSpells("EN"),
    },
    {
      name: "日本語",
      value: "JP",
      spellTable: getSpells("JP"),
    },
  ];
</script>

<div
  class="ToggleLang dropdown dropdown-end"
  class:dropdown-open={isOpen}
  on:click={toggleOpen}
  use:clickOutside={() => (isOpen = false)}
>
  <span tabindex="0" class="btn btn-xs m-1">Spells language</span>
  <ul
    tabindex="0"
    class="dropdown-content menu p-2 shadow bg-neutral rounded-box w-52"
  >
    {#each langs as lang}
      <li class="menu-item">
        <button
          class="hover:bg-neutral-focus neutral-content"
          on:click={() => toggleLang(lang.value)}
        >
          {lang.name}
        </button>
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    color: hsl(var(--nc));
  }
</style>
