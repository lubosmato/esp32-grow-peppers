<script lang="ts">
  import { usePlant } from "../plant";
  import { plant } from "../store";
  import FanIcon from "./FanIcon.svelte";

  const { setFan } = usePlant();

  $: value = $plant.fan / 100;
</script>

<div class="fan">
  <div class="fan-level">
    <FanIcon {value} />
  </div>
  <div class="controls">
    {#if $plant.fan !== null}
      <div class="percentage">
        {$plant.fan}&nbsp;%
      </div>
      <div class="slider">
        <input
          type="range"
          min="0"
          step="1"
          max="100"
          value={$plant.fan}
          on:change={(e) => setFan(e.target.value)}
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

.fan
  @extend %panel

  padding: 1rem

  display: flex
  align-items: center
  height: calc(100% - 2rem)

  .fan-level
    width: 50%
    height: 100%

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
