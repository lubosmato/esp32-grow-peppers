<script lang="ts">
  import WaterLevel from "./WaterLevel.svelte";
  import { plant, history } from "../store";

  import { DateTime } from "luxon";
  import Chart from "./Chart.svelte";

  $: waterData = $history
    .filter((sample) => sample.key === "water")
    .filter((_, i) => i % 8 === 0)

  $: xData = waterData.map((sample) => DateTime.fromMillis(sample.time));
  $: yData = waterData.map((sample) => sample.value.toFixed(0));

  const LOW_WATER_THRESH = 10;
  const MESSAGE_UNKNOWN = "Hard to guess when plants will be thirsty 🤷‍♂️";
  let message = "";

  $: {
    message = "";

    const numberOfUsedSamples = 6 * 5;

    if (waterData.length <= numberOfUsedSamples) {
      message = MESSAGE_UNKNOWN;
    } else {
      const selectedWaterData = waterData.slice(
        waterData.length - numberOfUsedSamples,
        waterData.length
      );

      const offsetFrom = selectedWaterData[0].time;
      const xData = selectedWaterData.map((s) =>
        Math.floor((s.time - offsetFrom) / 1000)
      );
      const yData = selectedWaterData.map((sample) => Math.round(sample.value));

      const meanX = xData.reduce((acc, x) => acc + x) / xData.length;
      const meanY = yData.reduce((acc, y) => acc + y) / yData.length;
      const sumXYError = xData.reduce(
        (acc, x, i) => acc + (x - meanX) * (yData[i] - meanY)
      );
      const sumXErrorSquared = xData.reduce((acc, x) => acc + (x - meanX) ** 2);

      const k = sumXYError / sumXErrorSquared;
      const q = meanY - k * meanX;

      if (k >= 0) {
        // line is "raising"
        message = MESSAGE_UNKNOWN;
      } else {
        // line is "falling"
        const prediction = ((LOW_WATER_THRESH - q) / k) * 1000 + offsetFrom;
        if (!isFinite(prediction) || isNaN(prediction)) {
          message = MESSAGE_UNKNOWN;
        } else {
          const predictedDateTime = DateTime.fromMillis(prediction);
          message = `Plants will be thirsty ${predictedDateTime.toRelative()}`;
        }
      }
    }
  }
</script>

<div class="water">
  <div class="water-level">
    <WaterLevel amount={$plant.water} />
  </div>
  <div class="controls">
    {#if $plant.water !== null}
      <div class="percentage">
        {$plant.water}&nbsp;%
      </div>
      <div class="hint">
        {#if $plant.water < LOW_WATER_THRESH}
          Plants are thirsty. 🔥 Give them some water!
        {:else}
          {message}
        {/if}
      </div>
    {:else}
      &nbsp;
    {/if}

    <Chart
      {xData}
      {yData}
      color="#3083ff"
      suggestedMinMax={[0, 100]}
      units="%"
    />
  </div>
</div>

<style lang="sass">
@import "../../sass/variables"
@import "../../sass/helpers"

// TODO mixin/placeholder (it repeats a lot) or just deploy it and be happy for now :)
.water
  @extend %panel

  padding: 1rem

  display: flex
  align-items: center
  height: calc(100% - 2rem)

  .water-level
    width: 30%
    height: 100%
    padding: 1rem

  .controls
    width: 70%
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-around
    height: 100%
    
    .percentage
      font-size: clamp(2rem, 4vw, 4rem)
      line-height: clamp(1rem, 3vw, 3rem)

      font-weight: bold
      text-align: center

    .hint
      margin-top: 0.5rem
      font-size: 1rem
      font-weight: 300
      text-align: center

</style>
