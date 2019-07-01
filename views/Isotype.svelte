<script>
  import Groups from "./Groups.svelte";
  import CompareGroups from "./CompareGroups.svelte";
  import CompareCategories from "./CompareCategories.svelte";

  export let item;
  export let categories;
  export let isLowlight;
  export let maxAmount;

  function getIconContainerSize(maxAmount, amountOfGroups) {
    if (amountOfGroups === 3) {
      // 2 groups (compare-layout)
      if (maxAmount < 10 || maxAmount > 100) {
        return 100 / maxAmount;
      } else {
        if (maxAmount > 10) {
          return 10; // IconContainerSize is 10% if there are more than 10 items in the compare-tempalte
        } else {
          return 20; // IconContainerSize is 20% if there are at least 5 icons (100/5=20)
        }
      }
    } else if (amountOfGroups == 2) {
      // single group layout (groups-layout)
      if (maxAmount < 10 || maxAmount > 30) {
        return 100 / maxAmount;
      } else {
        if (maxAmount > 10) {
          return 10; // IconContainerSize is 10% if there are more than 10 items in the compare-tempalte
        } else {
          return 20; // IconContainerSize is 20% if there are at least 5 icons (100/5=20)
        }
      }
    } else {
      // more than 3 groups (groups-layout)
      if (maxAmount < 10 || maxAmount > 100) {
        return 100 / maxAmount;
      } else {
        return 10; // IconContainerSize is 10% if there are at least 10 icons (100/10=10)
      }
    }
  }

  function getIsCountable(maxAmount, amountOfGroups) {
    if (amountOfGroups === 2) {
      // group-layout
      return maxAmount < 30;
    } else {
      // compare-layout
      return maxAmount < 100;
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

{#if item.data && item.data.length === 3}
  <CompareGroups
    {item}
    data={transposeData(item.data)}
    {categories}
    isCountable={getIsCountable(maxAmount, item.data.length)}
    {isLowlight}
    {newArray}
    iconContainerSize={getIconContainerSize(maxAmount, item.data.length)} />
{:else if item.data.length === 2 && item.data[0].length === 3}
  <CompareCategories
    {item}
    data={item.data}
    {categories}
    isCountable={getIsCountable(maxAmount, item.data[0].length)}
    {isLowlight}
    {newArray}
    iconContainerSize={getIconContainerSize(maxAmount, item.data[0].length)} />
{:else}
  <Groups
    {item}
    data={item.data}
    {categories}
    isCountable={getIsCountable(maxAmount, item.data.length)}
    {isLowlight}
    {newArray}
    iconContainerSize={getIconContainerSize(maxAmount, item.data.length)} />
{/if}
