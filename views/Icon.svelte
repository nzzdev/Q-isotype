<script>
  export let item;
  export let isCountable;
  export let isLowlight;
  export let currentCategoryIndex;
  export let iconContainerSize;
</script>

{#if item.icons && item.icons[currentCategoryIndex - 1]}
  <div
    class="q-isotype-icon-container q-isotype-icon-container--{item.icons[currentCategoryIndex - 1].aspectRatio || 'square'}
    {isCountable ? `q-isotype-icon-container--${item.icons[currentCategoryIndex - 1].aspectRatio || 'square'}--is-countable` : ''}"
    class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}
    style="flex: 0 1 calc({iconContainerSize}% - 4px)"
    data-container-type={item.icons[currentCategoryIndex - 1].aspectRatio || 'square'}>
    {#if item.icons[currentCategoryIndex - 1].svg}
      <div
        class="q-isotype-icon-svg q-isotype-icon-svg--{item.icons[currentCategoryIndex - 1].aspectRatio}">
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
    class="q-isotype-icon-container q-isotype-icon-container--square"
    class:q-isotype-icon-container-square--is-countable={isCountable}
    class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}
    style="flex: 0 1 calc({iconContainerSize}% - 4px)"
    data-container-type="square">
    <div
      class="q-isotype-icon-svg q-isotype-icon-svg--square"
      style="width: 100%;">
      <svg>
        <use xlink:href="#no-icon-default-svg" />
      </svg>
    </div>
  </div>
{/if}
