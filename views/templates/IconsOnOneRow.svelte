<script>
  import Icon from "./Icon.svelte";
  export let row;
  export let item;
  export let newArray;
  export let isLowlight;
  export let iconContainerSize;
</script>

{#each row as value, currentCategoryIndex}
  {#each newArray(row[currentCategoryIndex]) as value, i}
    <Icon {item} {isLowlight} {currentCategoryIndex} {iconContainerSize} />
  {/each}
{/each}
