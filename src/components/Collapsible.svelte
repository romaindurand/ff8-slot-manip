<script>
  export let title = "FAQ";
</script>

<div
  class="Collapsible collapse collapse-arrow border border-base-300 bg-base-100 rounded-box"
>
  <input type="checkbox" />
  <div class="collapse-title text-lg font-small">{title}</div>
  <div class="collapse-content">
    <slot />
  </div>
</div>

<style>
  .Collapsible {
    margin-bottom: 10px;
  }
</style>
