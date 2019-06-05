<script>
  export let notes;
  export let sources;
  export let acronym;
  export let allowDownloadData;
  export let linkToCSV;
</script>

<div class="s-q-item__footer">
  {#if notes}
    {notes}
    {#if sources !== undefined && sources.length > 0}–{/if}
  {/if}
  {#if sources !== undefined && sources.length > 0}
    {#if sources.length > 1}Quellen:{:else}Quelle:{/if}
    {#each sources as source, index}
      {#if source.text !== ''}
        {#if source.link && source.link.url && source.link.isValid}
          <a href={source.link.url} target="blank" rel="noopener noreferrer">
             {source.text}
          </a>
        {:else}{source.text}{/if}
        {#if index !== sources.length - 1 && sources[index + 1] !== ''}, {/if}
      {/if}
    {/each}
  {/if}
  {#if acronym}
    {#if notes || sources.length > 0} – {/if}
    Grafik: {acronym}
  {/if}
  {#if allowDownloadData}
    <br />
    <a href={linkToCSV}>Daten herunterladen</a>
  {/if}
</div>
