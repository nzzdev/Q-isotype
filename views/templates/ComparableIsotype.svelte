<script>
  import IconsOnOneRow from "./IconsOnOneRow.svelte";
  export let item;
  export let data;
  export let categories;
  export let isLowlight;
  export let iconContainerSize;
  export let newArray;
</script>

{#if data && data.length > 1}
  {#if item.options && item.options.iconsOneRow}
    <div class="q-isotype-row--compare q-isotype-row--margin">
      <div
        class="q-isotype-row-title s-font-title-xs q-isotype-icon-block
        q-isotype-icon-block--first">
         {data[0][1]}
      </div>
      <div class="q-isotype-row-title s-font-title-xs q-isotype-icon-block">
         {data[0][2]}
      </div>
    </div>
    <div class="q-isotype-row--compare">
      {#each item.data.slice(1) as row, rowIndex}
        <div
          class="q-isotype-icon-block"
          class:q-isotype-icon-block--first={rowIndex === 0}>
          <IconsOnOneRow
            {item}
            {row}
            {isLowlight}
            {newArray}
            {iconContainerSize} />
        </div>
      {/each}
    </div>
  {:else}
    {#each data as row, rowIndex}
      <div
        class="q-isotype-row--compare"
        class:q-isotype-row--margin={rowIndex !== data.length - 1}>
        {#each row.slice(1) as val, colIndex}
          {#if rowIndex === 0}
            <div
              class="q-isotype-row-title s-font-title-xs q-isotype-icon-block"
              class:q-isotype-icon-block--first={colIndex === 0}>
               {val}
            </div>
          {:else}
            <div
              class="q-isotype-icon-block"
              class:q-isotype-icon-block--first={colIndex === 0}>
              {#each newArray(val) as value, i}
                {#if item.icons && item.icons[rowIndex - 1]}
                  <div
                    class="q-isotype-icon-container"
                    class:q-isotype-lowlight={isLowlight(rowIndex)}
                    style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                    {#if item.icons[rowIndex - 1].svg}
                      <div
                        class="q-isotype-icon-svg"
                        style="{item.icons[rowIndex - 1].style};">
                        <svg>
                          <use xlink:href="#{item.icons[rowIndex - 1].key}" />
                        </svg>
                      </div>
                    {:else}
                      <div
                        class="q-isotype-icon-png"
                        style="background-image: url('{item.icons[rowIndex - 1].url}');" />
                    {/if}
                  </div>
                {:else}
                  <div
                    class="q-isotype-icon-container"
                    class:q-isotype-lowlight={isLowlight(rowIndex)}
                    style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                    <div class="q-isotype-icon-svg" style="width: 100%;">
                      <svg>
                        <use xlink:href="#no-icon-default-svg" />
                      </svg>
                    </div>
                  </div>
                {/if}
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/each}
  {/if}
{/if}
