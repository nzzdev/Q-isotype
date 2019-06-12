<script>
  import IconsOnOneRow from "./IconsOnOneRow.svelte";
  import Icon from "./Icon.svelte";
  export let item;
  export let data;
  export let categories;
  export let isLowlight;
  export let iconContainerSize;
  export let newArray;
</script>

{#if data && data.length > 1}
  {#each data.slice(1) as row, index}
    <div class="q-isotype-row">
      <div class="q-isotype-row-title s-font-title-xs">{row[0]}</div>
      {#if item.options && item.options.iconsOneRow}
        <div class="q-isotype-icon-row">
          <IconsOnOneRow
            {item}
            {row}
            {isLowlight}
            {newArray}
            {iconContainerSize} />
        </div>
      {:else}
        {#each row as value, currentCategoryIndex}
          {#if currentCategoryIndex > 0}
            <div
              class="q-isotype-icon-row"
              class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}>
              {#if categories.length === 1 && (row[currentCategoryIndex] == 0 || row[currentCategoryIndex] == null)}
                <div
                  class="q-isotype-icon-container"
                  style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                  <div class="q-isotype-icon-png" />
                </div>
              {:else}
                {#each newArray(row[currentCategoryIndex]) as i}
                  <Icon
                    {item}
                    {isLowlight}
                    {currentCategoryIndex}
                    {iconContainerSize} />
                {/each}
              {/if}
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {/each}
{/if}
