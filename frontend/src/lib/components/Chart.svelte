<script lang="ts">
  import Line from "svelte-chartjs/src/Line.svelte";
  import type { DateTime } from "luxon";
  import "chartjs-adapter-luxon";

  import type { ChartOptions } from "chart.js";

  export let xData: DateTime[];
  export let yData: any[];
  export let color: string;
  export let suggestedMinMax: [number, number];
  export let units = "";

  const lightColor = "rgba(255, 255, 255, 0.6)";

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    color,

    animation: {
      duration: 0,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (value) => `${value.raw}${units}`,
        },
      },
      legend: {
        display: false,
        labels: {
          font: {
            family: "Montserrat",
          },
          color: lightColor,
        },
      },
    },

    scales: {
      x: {
        type: "time",
        ticks: {
          font: {
            family: "Montserrat",
          },
          color: lightColor,
        },
        grid: {
          color: lightColor,
        },
      },
      y: {
        suggestedMin: suggestedMinMax[0],
        suggestedMax: suggestedMinMax[1],
        ticks: {
          callback: (value) => `${value}${units}`,
          font: {
            family: "Montserrat",
          },
          color: lightColor,
        },
        grid: {
          color: lightColor,
        },
      },
    },
  };

  $: chartData = {
    labels: xData,
    datasets: [
      {
        label: "Temperature",
        backgroundColor: color,
        borderColor: color,
        data: yData,
        pointRadius: 0,
        borderWidth: 2,
        lineTension: 1,
      },
    ],
  };
</script>

<div class="chart">
  <Line options={chartOptions} data={chartData} />
</div>

<style lang="sass">
  .chart
    position: relative
    height: auto
    width: 100%
    min-height: 60%
</style>
