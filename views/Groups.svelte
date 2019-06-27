<script>
  import Icon from "./Icon.svelte";
  export let item;
  export let data;
  export let categories;
  export let isCountable;
  export let isLowlight;
  export let iconContainerSize;
  export let newArray;
</script>

{#each data.slice(1) as row, index}
  <div
    class="q-isotype-row"
    class:q-isotype-row--margin={index !== data.slice(1).length - 1}>
    {#if row[0]}
      <div class="q-isotype-row-title s-font-title-xs">{row[0]}</div>
    {/if}
    {#if item.options && item.options.iconsOneRow}
      <div class="q-isotype-icon-row">
        {#each row as value, currentCategoryIndex}
          {#if currentCategoryIndex > 0}
            {#each newArray(row[currentCategoryIndex]) as i}
              <Icon
                {item}
                {isCountable}
                {isLowlight}
                {currentCategoryIndex}
                {iconContainerSize} />
            {/each}
          {/if}
        {/each}
      </div>
    {:else}
      {#each row as value, currentCategoryIndex}
        {#if currentCategoryIndex > 0}
          <div
            class="q-isotype-icon-row"
            class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}>
            {#each newArray(row[currentCategoryIndex]) as i}
              <Icon
                {item}
                {isCountable}
                {isLowlight}
                {currentCategoryIndex}
                {iconContainerSize} />
            {/each}
          </div>
        {/if}
      {/each}
    {/if}
  </div>
{/each}
