<script lang="ts">
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./lib/components/PrivateRouteGuard.svelte";
  import Camera from "./lib/components/Camera.svelte";
  import Water from "./lib/components/Water.svelte";
  import User from "./lib/components/User.svelte";
  import Thermometer from "./lib/components/Thermometer.svelte";
  import Light from "./lib/components/Light.svelte";
  import { onDestroy, onMount } from "svelte";

  export let path;
</script>

<Route {path} let:params let:location let:navigate>
  <PrivateRouteGuard>
    <div class="grid">
      <div class="user">
        <User />
      </div>
      <div class="water">
        <Water />
      </div>
      <div class="thermo">
        <Thermometer />
      </div>
      <div class="light">
        <Light />
      </div>
      <div class="camera">
        <Camera />
      </div>
    </div>
  </PrivateRouteGuard>
</Route>

<style lang="sass">
@import "./sass/helpers"

$grid-gap: 1rem

.grid
  height: calc(100% - $grid-gap * 2)
  padding: $grid-gap

  display: grid 
  grid-template-columns: repeat(4, minmax(0, 1fr))
  grid-template-rows: repeat(3, minmax(0, 1fr))
  gap: $grid-gap
  // grid-template-areas: ". light thermo thermo" ". . camera camera" ". . camera camera" 
  grid-template-areas: "water water thermo thermo" "light camera camera camera" "user camera camera camera" 

  @media only screen and (max-width: $breakpoint-desktop)
    grid-template-columns: repeat(3, minmax(0, 1fr))
    grid-template-rows: repeat(3, minmax(0, 1fr))
    grid-template-areas: "water thermo thermo" "light camera camera" "user camera camera"

  @media only screen and (max-width: $breakpoint-tablet)
    height: auto
    grid-template-columns: repeat(2, minmax(0, 1fr))
    grid-template-rows: repeat(2, minmax(0, 1fr))
    grid-template-areas: "water thermo" "thermo camera"

  @media only screen and (max-width: $breakpoint-mobile) 
    height: auto
    grid-template-columns: repeat(1, minmax(0, 1fr))
    grid-template-rows: repeat(4, minmax(0, 1fr))
    grid-template-areas: "water" "thermo" "light" "camera" "user"

  .camera
    width: 100%
    height: 100%
    grid-area: camera

  .thermo
    grid-area: thermo
    
  .light
    grid-area: light
    
  .water
    grid-area: water

  .user
    grid-area: user

</style>
