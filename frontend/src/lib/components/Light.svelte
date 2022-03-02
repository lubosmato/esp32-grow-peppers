<script lang="ts">
  import { usePlant } from "../plant";
  import { plant } from "../store";
  import LightBulp from "./LightBulp.svelte";

  const { setLight } = usePlant();

  $: opacity = $plant.light / 100;
</script>

<div class="light">
  <div class="light-level">
    <LightBulp {opacity} />
  </div>
  <div class="controls">
    {#if $plant.light !== null}
      <div class="percentage">
        {$plant.light}&nbsp;%
      </div>
      <div class="slider">
        <input
          type="range"
          min="0"
          step="1"
          max="100"
          value={$plant.light}
          on:change={(e) => setLight(e.target.value)}
        />
      </div>
    {:else}
      &nbsp;
    {/if}
  </div>
</div>

<style lang="sass">
@import "../../sass/variables"
@import "../../sass/helpers"

.light
  @extend %panel

  padding: 1rem

  display: flex
  align-items: center
  height: calc(100% - 2rem)

  .light-level
    width: 50%
    height: 100%
    padding: 1rem

  .controls
    width: 50%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    height: 100%
    
    .percentage
      font-size: clamp(2rem, 4vw, 5rem)
      line-height: clamp(1rem, 3vw, 3rem)

      font-weight: bold
      text-align: center
      margin-bottom: 2rem

</style>
