<script>
  import Collapsible from "./Collapsible.svelte";
  export let category;
</script>

<!-- add collapsable secion -->

<Collapsible>
  {#if category === "Any%"}
    <iframe
      width="290"
      height="300"
      src="https://www.youtube.com/embed/ZmcaEiFeYi4"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <p>
      Currently Working only on lvl 8, with max Hp at 482, targeted spell is The
      End.
    </p>
    <p>
      During a freeze atb moment like a Guardian Force summon or a long limit
      break animation like invicible moon.
    </p>
    <p>
      The range of HP that works is equal or under 54 hp otherwise you can't get
      THE END, and the proper hp setup is equal or under 34 hp because it
      unlocks the spell instant on 2nd do over.
    </p>
    <p>
      Entry available at HP;RNG;DoOver : 34;179;0 // 32;175;1 // 4;91;22 //
      18;79;25 // 26;43;34 // 54;251;46 // 51;231;51 // 38;207;57 // 21;187;62.
    </p>
    <p class="red">
      you roughly have 23seconds with quetz summon to find The End, when damage
      for summon is rolled it changes rng and then manip is Dead (you can see
      the exact moment where damage is rolled on the video)
    </p>
  {/if}

  {#if category === "100%"}
    <p>
      Tool for searching Selphie's limit unique spells during Odin's encounter
      or BGH251F2 (1st encounter)
    </p>
    <p>
      Note that only you can influence the battle RNG during Odin fight which
      means you don't need to launch a long animation in order to execute the
      manip.
    </p>
    <p class="red">
      If angelo search occurs during your execution manip is dead because it
      changes the RNG by XX (have to check).
    </p>
    <p>
      your Max HP must be 9576 during Odin, and if Aura runs out while you were
      in the 2nd Do Over part you're fine
    </p>
  {/if}

  {#if category === "NoJunction"}
    <p class="red">Coming Soon TM.</p>
    <!-- <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li> -->
  {/if}

  {#if category === "NoJunction/NoLevel"}
    <p class="red">Coming Soon TM.</p>
    <!-- <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li> -->
  {/if}

  {#if category === "Custom"}
    <p class="red">Coming Soon TM.</p>
    <!-- <li>Currently Working only on lvl 8, with max Hp at 482, targeted spell is The End.</li>
  <li>During a freeze atb moment like a Guardian Force summon or a long limit break animation like invicible moon.</li>
  <li>The range of HP that works is equal or under 54 hp otherwise you can't get THE END, and the proper hp setup is equal or under 34 hp because it unlocks the spell instant on 2nd do over.</li> -->
  {/if}
</Collapsible>

<style>
  ul {
    list-style-type: disc;
    padding-left: 3px;
  }

  p:not(:last-child) {
    margin-bottom: 15px;
  }

  p:not(:last-child):after {
    display: block;
    content: "";
    border-top: 1px solid grey;
    width: 100%;
    margin: 0;
    transform: translateY(9px);
  }

  .red {
    color: red;
  }
</style>
