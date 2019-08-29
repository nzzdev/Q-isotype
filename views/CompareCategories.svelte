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

<div class="q-isotype-row--compare">
  {#if data[0][1]}
    <div
      class="q-isotype-row-title s-font-title-s q-isotype-icon-block
      q-isotype-icon-block--first">
       {data[0][1]}
    </div>
  {/if}
  {#if data[0][2]}
    <div class="q-isotype-row-title s-font-title-s q-isotype-icon-block">
       {data[0][2]}
    </div>
  {/if}
</div>
<div class="q-isotype-row--compare">
  {#each item.data.slice(1) as row}
    {#each row as value, currentCategoryIndex}
      {#if currentCategoryIndex !== 0}
        <div
          class="q-isotype-icon-block"
          class:q-isotype-icon-block--first={currentCategoryIndex === 1}>
          {#each newArray(row[currentCategoryIndex]) as value, i}
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
  {/each}
</div>
