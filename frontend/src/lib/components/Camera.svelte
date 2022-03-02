<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Fa from "svelte-fa";
  import { faSpinner } from "@fortawesome/free-solid-svg-icons";
  import { camera } from "../store";
  import { DateTime } from "luxon";
  import { usePlant } from "../plant";
  import { writable } from "svelte/store";

  const { setFlashlight } = usePlant();

  const lastUpdated = writable<string>("");

  let newImageButtonDisabled = false;
  let cameraImageUrl = `/api/v1/plants/camera?t=${Date.now()}`;

  camera.subscribe(() => {
    cameraImageUrl = `/api/v1/plants/camera?t=${Date.now()}`;
    newImageButtonDisabled = false;
  });

  const askForNewImage = async () => {
    if (newImageButtonDisabled) return;

    newImageButtonDisabled = true;

    await fetch("/api/v1/plants/camera", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
  };

  let dateTimeUpdateInterval: number | null = null;
  onMount(() => {
    dateTimeUpdateInterval = setInterval(() => {
      if ($camera.imageDate === null) return;

      lastUpdated.set(
        DateTime.fromISO($camera.imageDate?.replace("Z", "")).toRelative()
      );
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(dateTimeUpdateInterval);
  });
</script>

<div class="camera">
  <div class="controls">
    <button on:click={askForNewImage} disabled={newImageButtonDisabled}>
      Refresh
      {#if newImageButtonDisabled}
        &nbsp;<Fa icon={faSpinner} spin />
      {/if}
    </button>
    <label
      ><input
        type="checkbox"
        checked={$camera.isFlashlightEnabled}
        on:change={(e) => setFlashlight(e.target.checked)}
      /> Flashlight</label
    >
    <div>{$lastUpdated}</div>
  </div>
  <img class="image" src={cameraImageUrl} alt="Camera" />
</div>

<style lang="sass">
@import "../../sass/variables"
@import "../../sass/helpers"

$panel-opacity: 0.2
$controls-height: 80px

.camera
  display: flex
  flex-direction: column
  height: 100%
  
  @extend %panel

  .image
    height: calc(100% - $controls-height)
    background: #000000ff
    object-fit: contain
    border-radius: 0 0 $border-radius $border-radius

  .controls
    display: flex
    align-items: center
    justify-content: center
    
    height: calc($controls-height - 4rem)
    padding: 2rem

    @media only screen and (max-width: $breakpoint-tablet)
      padding: 1rem

    label
      display: flex
      align-items: center
      margin: 2rem

      @media only screen and (max-width: $breakpoint-tablet)
        margin: 1rem

      input
        margin-right: 0.5rem

    div
      @media only screen and (max-width: $breakpoint-tablet)
        display: none
</style>
