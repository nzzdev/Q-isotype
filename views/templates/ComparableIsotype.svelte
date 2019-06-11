<script>
  export let item;
  export let data;
  export let categories;
  export let isLowlight;
  export let iconContainerSize;
  export let newArray;
</script>

{#if data && data.length > 1}
  {#each data as row, rowIndex}
    <div class="">
      {#each row.slice(1) as val, colIndex}
        {#if rowIndex === 0}
          <div
            class="q-isotype-row-title s-font-title-xs
            q-isotype-comparable-column"
            class:q-isotype-first-column={colIndex === 0}>
             {val}
          </div>
        {:else}
          <div
            class="q-isotype-comparable-column"
            class:q-isotype-first-column={colIndex === 0}>
            {#each newArray(val) as value, i}
              <div
                class="q-isotype-icon-container"
                class:q-isotype-lowlight={isLowlight(rowIndex - 1)}
                style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                <div
                  class="q-isotype-icon-svg"
                  style="{item.icons[rowIndex - 1].style};">
                  <svg>
                    <use xlink:href="#{item.icons[rowIndex - 1].key}" />
                  </svg>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/each}
    </div>
  {/each}
  <!-- {#each item.data.slice(1) as row, index}
    <div class="q-isotype-row" style="width: calc(50% - 24px)">
      <div class="q-isotype-row-title s-font-title-xs">{row[0]}</div>
      {#if item.options && item.options.iconsOneRow}
        <div class="q-isotype-icon-row">
          {#each row as value, currentCategoryIndex}
            {#if currentCategoryIndex > 0}
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
                          <use
                            xlink:href="#{item.icons[currentCategoryIndex - 1].key}" />
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
            {/if}
          {/each}
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
                  {#if item.icons && item.icons[currentCategoryIndex - 1]}
                    <div
                      class="q-isotype-icon-container"
                      style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                      {#if item.icons[currentCategoryIndex - 1].svg}
                        <div
                          class="q-isotype-icon-svg"
                          style="{item.icons[currentCategoryIndex - 1].style};">
                          <svg>
                            <use
                              xlink:href="#{item.icons[currentCategoryIndex - 1].key}" />
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
                      style="flex: 0 1 calc({iconContainerSize}% - 4px)">
                      <div class="q-isotype-icon-svg" style="width: 100%;">
                        <svg>
                          <use xlink:href="#no-icon-default-svg" />
                        </svg>
                      </div>
                    </div>
                  {/if}
                {/each}
              {/if}
            </div>
          {/if}
        {/each}
      {/if}
    </div>
  {/each} -->
{/if}
