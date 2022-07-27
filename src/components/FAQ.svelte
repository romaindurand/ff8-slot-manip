<script>
  export let category
</script>

{#if category === 'Any%'}
<ul class="w-full max-w-lg">
  <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>Entry available at HP;RNG;DoOver : 34;179;0 // 32;175;1 // 4;91;22 // 18;79;25 // 26;43;34 // 54;251;46 // 51;231;51 // 38;207;57 // 21;187;62.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li>
</ul>
{/if}

{#if category === '100%'}
<ul class="w-full max-w-lg">
  <li>Tool for searching Selphie's limit unique spells during Odin's encounter. (only for TheEnd right now)</li>
  <li>Note that only you can influence the battle RNG during this fight which means you don't need to launch a long animation in order to execute the manip.</li>
  <li class="red">If angelo search occurs during your execution manip is dead because it changes the RNG by XX (have to check).</li>
  <li>your Max HP must be 9576, and if Aura runs out while you were in the 2nd Do Over part you're fine</li>
</ul>
{/if}

{#if category === 'NoJunction'}
<ul class="w-full max-w-lg">
  <li class="red">Coming Soon TM.</li>
  <!-- <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li> -->
</ul>
{/if}

{#if category === 'NoJunction/NoLevel'}
<ul class="w-full max-w-lg">
  <li class="red">Coming Soon TM.</li>
  <!-- <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li> -->
</ul>
{/if}
<style> 
ul {
  list-style-type: disc;
}

.red {
  color: red;
}
</style>