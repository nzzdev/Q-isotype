<script>
  import Groups from "./Groups.svelte";
  import CompareGroups from "./CompareGroups.svelte";

  export let item;
  export let categories;
  export let isLowlight;
  export let maxAmount;
  export let iconContainerSize = getIconContainerSize(
    maxAmount,
    item.data.length
  );

  function getIconContainerSize(maxAmount, amountOfGroups) {
    if (amountOfGroups === 3) {
      if (maxAmount < 5) {
        return 100 / maxAmount;
      } else {
        return 20; // maxIconContainerSize will be 20% because there are at least 5 icons (100/5=20)
      }
    } else {
      if (maxAmount < 10 || maxAmount >= 50) {
        return 100 / maxAmount;
      } else {
        return 10; // maxIconContainerSize will be 10% because there are at least 10 icons (100/10=10)
      }
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

{#if item.data.length === 3}
  <CompareGroups
    {item}
    data={transposeData(item.data)}
    {categories}
    {isLowlight}
    {newArray}
    {iconContainerSize} />
{:else}
  <Groups
    {item}
    data={item.data}
    {categories}
    {isLowlight}
    {newArray}
    {iconContainerSize} />
{/if}
