<script lang="ts">
  import { useLogout } from "../user";
  import { user, plant, camera } from "../store";

  const logout = useLogout();
</script>

<div class="user">
  <div>
    <div class="title">Hello {$user.name.split(" ")[0]}!</div>
    See your spicy babies! 🌶️
  </div>
  <div class="info">
    <div class={`buble ${$plant.isOnline ? "" : "danger"}`}>
      Grow ID <strong>{$user.plantId}</strong>
      {#if !$plant.isOnline}
        <i>(disconnected)</i>
      {/if}
    </div>

    <div class={`buble ${$camera.isOnline ? "" : "danger"}`}>
      Camera ID <strong>{$user.camId}</strong>
      {#if !$camera.isOnline}
        <i>(disconnected)</i>
      {/if}
    </div>
  </div>
  <div class="logout">
    <button on:click={logout}>Logout</button>
  </div>
</div>

<style lang="sass">
@import "../../sass/helpers"

.user
  @extend %panel
  display: flex
  flex-direction: column
  justify-content: space-between

  padding: 2rem
  height: calc(100% - 4rem)

  .title
    font-size: clamp(2rem, 2.5vw, 3rem)
    line-height: clamp(1rem, 2.5vw, 3rem)
    font-weight: 700
    padding-top: 0
    padding-bottom: 0.2em

  .info
    margin-top: 1em

    .buble
      @include buble($success-color)
      padding: 0.5em
      font-size: 0.8rem

    .buble.danger
      @include buble($danger-color)
      padding: 0.5em
      

  .logout
    flex-grow: 1
    display: flex
    flex-direction: column
    justify-content: flex-end

    button
      width: 100%

</style>
