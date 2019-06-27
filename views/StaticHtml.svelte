<script>
  import Header from "./Header.svelte";
  import Legend from "./Legend.svelte";
  import Isotype from "./Isotype.svelte";
  import Footer from "./Footer.svelte";

  export let id;
  export let item;
  export let categories;
  export let maxAmount;
  export let linkToCSV;
  export let displayOptions;

  function isLowlight(index) {
    return (
      item.options &&
      item.options.highlightColumn !== null &&
      item.options.highlightColumn !== undefined &&
      item.options.highlightColumn !== index
    );
  }
</script>

<div class="s-q-item q-isotype" style="opacity: 0;" {id}>
  <Header {item} {displayOptions} />
  <Legend {item} {categories} {isLowlight} />
  <Isotype {item} {categories} {isLowlight} {maxAmount} />
  <Footer {item} {linkToCSV} />
</div>
