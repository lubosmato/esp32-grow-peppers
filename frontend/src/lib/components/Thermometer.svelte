<script lang="ts">
  import { DateTime } from "luxon";

  import ThermometerLevel from "./ThermometerLevel.svelte";
  import Chart from "./Chart.svelte";
  import { plant, history } from "../store";

  $: tempData = $history.filter((sample) => sample.key === "temp");
  $: xData = tempData.map((sample) => DateTime.fromMillis(sample.time));
  $: yData = tempData.map((sample) => sample.value.toFixed(1));

  $: temperature = $plant.temperature;
  $: amount = 4 * temperature - 40;
  let message = "Babies are fine 🙂";

  let color = "inherit";
  $: if (temperature <= 10) {
    color = "#269bff";
    message = "Brrrr! Babies are freezing 🥶🌶️";
  } else if (temperature >= 35) {
    color = "#ff2f00";
    message = "Too hot! Too hot! 🔥🌶️";
  } else {
    color = "inherit";
    message = "Babies are fine 🙂";
  }
</script>

<div class="thermometer">
  <div class="thermometer-level">
    <ThermometerLevel {amount} />
  </div>
  <div class="controls">
    {#if temperature !== null}
      <div class="percentage" style={`color: ${color}`}>
        {temperature.toFixed(1)}°C
      </div>
      <div class="hint">{message}</div>
    {:else}
      &nbsp;
    {/if}
    <Chart
      {xData}
      {yData}
      color="#fa403b"
      suggestedMinMax={[10, 35]}
      units="°C"
    />
  </div>
</div>

<style lang="sass">
@import "../../sass/variables"
@import "../../sass/helpers"

.thermometer
  @extend %panel

  height: calc(100% - 2rem)
  padding: 1rem

  display: flex
  align-items: center

  .thermometer-level
    width: 20%
    height: 100%
    padding: 1rem

  .controls
    min-width: 80%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    height: 100%
    
    .percentage
      font-size: clamp(2rem, 4vw, 5rem)
      line-height: clamp(1rem, 3vw, 3rem)

      font-weight: bold
      text-align: center

    .hint
      margin-top: 0.5rem
      font-size: 1rem
      font-weight: 300
      text-align: center

</style>
