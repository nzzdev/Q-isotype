<script>
  export let item;
  export let linkToCSV;
</script>

<div class="s-q-item__footer">
  {#if item.notes}
    {item.notes}
    {#if item.sources > 0}–{/if}
  {/if}
  {#if item.sources}
    {#if item.sources.length > 1}Quellen:{:else}Quelle:{/if}
    {#each item.sources as source, index}
      {#if source.text !== ''}
        {#if source.link && source.link.url && source.link.isValid}
          <a href={source.link.url} target="blank" rel="noopener noreferrer">{source.text}</a>{:else}{source.text}{/if}{#if index !== item.sources.length - 1 && item.sources[index + 1] !== ''},&nbsp;
        {/if}
      {/if}
    {/each}
  {/if}
  {#if item.acronym}
    {#if item.notes || item.sources}&nbsp;&ndash;&nbsp;{/if}
    Grafik: {item.acronym}
  {/if}
  {#if item.allowDownloadData}
    <br />
    <a href={linkToCSV}>Daten herunterladen</a>
  {/if}
</div>
