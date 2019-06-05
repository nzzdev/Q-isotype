<script>
  export let item;
  export let displayOptions;
</script>

{#if displayOptions.hideTitle !== true}
  <h3 class="s-q-item__title">{item.title}</h3>
{/if}
{#if item.subtitle}
  <div class="s-q-item__subtitle"> {item.subtitle} </div>
{/if}
