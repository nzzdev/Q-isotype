<script>
  export let row;
  export let item;
  export let newArray;
  export let isLowlight;
  export let iconContainerSize;
</script>

{#each row as value, currentCategoryIndex}
  {#each newArray(row[currentCategoryIndex]) as value, i}
    {#if item.icons && item.icons[currentCategoryIndex - 1]}
      <div
        class="q-isotype-icon-container"
        class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}
        style="flex: 0 1 calc({iconContainerSize}% - 4px)">
        {#if item.icons[currentCategoryIndex - 1].svg}
          <div
            class="q-isotype-icon-svg"
            style="{item.icons[currentCategoryIndex - 1].style};">
            <svg>
              <use xlink:href="#{item.icons[currentCategoryIndex - 1].key}" />
            </svg>
          </div>
        {:else}
          <div
            class="q-isotype-icon-png"
            style="background-image: url('{item.icons[currentCategoryIndex - 1].url}');" />
        {/if}
      </div>
    {:else}
      <div
        class="q-isotype-icon-container"
        class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}
        style="flex: 0 1 calc({iconContainerSize}% - 4px)">
        <div class="q-isotype-icon-svg" style="width: 100%;">
          <svg>
            <use xlink:href="#no-icon-default-svg" />
          </svg>
        </div>
      </div>
    {/if}
  {/each}
{/each}
