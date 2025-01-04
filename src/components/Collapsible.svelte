<script>
  /**
   * @typedef {Object} Props
   * @property {string} [title]
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { title = "FAQ", children } = $props();
</script>

<div
  class="Collapsible collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
>
  <input type="checkbox" />
  <div class="collapse-title text-lg font-small">{title}</div>
  <div class="collapse-content">
    {@render children?.()}
  </div>
</div>

<style>
  .Collapsible {
    margin-bottom: 10px;
  }
</style>
