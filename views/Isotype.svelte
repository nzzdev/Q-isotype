<script>
  import ListedIsotype from "./templates/ListedIsotype.svelte";
  import ComparableIsotype from "./templates/ComparableIsotype.svelte";

  export let item;
  export let categories;
  export let isLowlight;
  export let iconContainerSize;

  function getTemplateAndData(data) {
    if (data.length === 3) {
      return {
        template: "comparable",
        data: transposeData(data) // transpose data for comparable layout
      };
    } else {
      return {
        template: "listed",
        data: item.data
      };
    }
  }

  function transposeData(data) {
    let out = [];

    for (let i = 0, l1 = data.length; i < l1; i++) {
      let row = data[i];

      for (let j = 0, l2 = row.length; j < l2; j++) {
        if (!out[j]) out[j] = [];

        out[j][i] = row[j];
      }
    }

    return out;
  }

  // this function will return an array with the amount of entries by the value of the isotype row value
  function newArray(range) {
    if (range && range > 0) {
      return new Array(range);
    }
    return new Array(0);
  }
</script>

{#if getTemplateAndData(item.data).template === 'comparable'}
  <ComparableIsotype
    {item}
    data={getTemplateAndData(item.data).data}
    {categories}
    {isLowlight}
    {newArray}
    {iconContainerSize} />
{:else}
  <ListedIsotype
    {item}
    {categories}
    options={item.options}
    {isLowlight}
    {newArray}
    {iconContainerSize} />
{/if}
