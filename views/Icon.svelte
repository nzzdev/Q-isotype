<script>
  export let item;
  export let isLowlight;
  export let currentCategoryIndex;
  export let iconContainerSize;
</script>

{#if item.icons && item.icons[currentCategoryIndex - 1]}
  <div
    class="q-isotype-icon-container"
    class:q-isotype-lowlight={isLowlight(currentCategoryIndex)}
    style="flex: 0 1 calc({iconContainerSize}% - 4px)">
    <div
      class="q-isotype-icon-svg"
      style="{item.icons[currentCategoryIndex - 1].style};">
      <svg>
        <use xlink:href="#{item.icons[currentCategoryIndex - 1].key}" />
      </svg>
    </div>
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
