<script>
  import Icon from "./Icon.svelte";
  export let item;
  export let data;
  export let categories;
  export let isLowlight;
  export let iconContainerSize;
  export let newArray;
</script>

{#if item.options && item.options.iconsOneRow}
  <div class="q-isotype-row--compare q-isotype-row--margin">
    {#if data[0][1]}
      <div
        class="q-isotype-row-title s-font-title-xs q-isotype-icon-block
        q-isotype-icon-block--first">
         {data[0][1]}
      </div>
    {/if}
    {#if data[0][2]}
      <div class="q-isotype-row-title s-font-title-xs q-isotype-icon-block">
         {data[0][2]}
      </div>
    {/if}
  </div>
  <div class="q-isotype-row--compare">
    {#each item.data.slice(1) as row, rowIndex}
      <div
        class="q-isotype-icon-block"
        class:q-isotype-icon-block--first={rowIndex === 0}>
        {#each row as value, currentCategoryIndex}
          {#each newArray(row[currentCategoryIndex]) as value, i}
            <Icon
              {item}
              {isLowlight}
              {currentCategoryIndex}
              {iconContainerSize} />
          {/each}
        {/each}
      </div>
    {/each}
  </div>
{:else}
  {#each data as row, currentCategoryIndex}
    <div
      class="q-isotype-row--compare"
      class:q-isotype-row--margin={currentCategoryIndex !== data.length - 1}>
      {#each row.slice(1) as val, colIndex}
        {#if currentCategoryIndex === 0}
          {#if val}
            <div
              class="q-isotype-row-title s-font-title-xs q-isotype-icon-block"
              class:q-isotype-icon-block--first={colIndex === 0}>
               {val}
            </div>
          {/if}
        {:else}
          <div
            class="q-isotype-icon-block"
            class:q-isotype-icon-block--first={colIndex === 0}>
            {#each newArray(val) as value, i}
              <Icon
                {item}
                {isLowlight}
                {currentCategoryIndex}
                {iconContainerSize} />
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/each}
{/if}
