<script>
  import NoIconDefaultSVG from "./no-icon-default-svg.html";
  export let item;
  export let categories;
  export let isLowlight;
</script>

<div
  class="q-isotype-legend s-font-note"
  class:q-isotype-hidden-legend={item.options && item.options.hideLegend}>
  {#each categories as category, index}
    {#if item.icons && item.icons[index]}
      <div class="q-isotype-legend-container">
        {#if item.icons[index].svg}
          <div
            class="q-isotype-legend-svg"
            class:q-isotype-lowlight={isLowlight(index + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg">
              <symbol id={item.icons[index].key}>
                {@html item.icons[index].svg}
              </symbol>
              <svg>
                <use xlink:href="#{item.icons[index].key}" />
              </svg>
            </svg>
          </div>
        {:else}
          <div
            class="q-isotype-legend-png"
            class:q-isotype-lowlight={isLowlight(index + 1)}
            style="background-image: url('{item.icons[index].url}')" />
        {/if}
        <div class="q-isotype-legend-category">{category || ''}</div>
      </div>
    {:else}
      <div class="q-isotype-legend-container">
        <div
          class="q-isotype-legend-svg"
          class:q-isotype-lowlight={isLowlight(index + 1)}>
          <NoIconDefaultSVG />
        </div>
        <div class="q-isotype-legend-category">{category || ''}</div>
      </div>
    {/if}
  {/each}
</div>
