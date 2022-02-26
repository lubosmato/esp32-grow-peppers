<script lang="ts">
  import { useNavigate, useLocation, useFocus } from "svelte-navigator";
  import { useLogin } from "./lib/user";
  import { user } from "./lib/store";

  const navigate = useNavigate();
  const location = useLocation();

  $: if ($user) {
    navigate("/", {
      state: { from: $location.pathname },
      replace: true,
    });
  }

  const emailFocus = useFocus();
  const login = useLogin();

  let email = "";
  let password = "";
  let errorMessage = "";

  async function handleLogin() {
    errorMessage = "";
    try {
      await login(email, password);
      const from = ($location.state && $location.state.from) || "/";
      navigate(from, { replace: true });
    } catch (e) {
      errorMessage = "Whoops! 🤔 We could not find this account. 🤷‍♂️";
    }
  }
</script>

<div class="login-page">
  <form on:submit|preventDefault={handleLogin}>
    <div class="form">
      <h2>Grow Peppers! Grow!</h2>
      <h4>🌶️ Please login in order to check your babies 🌶️</h4>

      <div class="fields">
        <div class="field">
          <span>Email</span>
          <input
            use:emailFocus
            bind:value={email}
            type="email"
            placeholder="chilli@peppers.com"
          />
        </div>

        <div class="field">
          <span>Password</span>
          <input
            bind:value={password}
            type="password"
            placeholder="Your password"
          />
        </div>

        {#if errorMessage}
          <div class="error">{errorMessage}</div>
        {/if}

        <div class="buttons">
          <button>See my babies</button>
        </div>
      </div>
    </div>
  </form>
</div>

<style lang="sass">
$breakpoint-mobile: 600px
$border-radius: 12px

.login-page
  background-image: url("login-bg.jpg")
  background-size: cover
  background-repeat: no-repeat
  background-position: center
  width: 100vw
  height: 100vh

  display: flex
  flex-direction: row
  align-items: center
  justify-content: center

  .form
    display: flex
    flex-direction: column
    
    background: rgba(255, 255, 255, 0.1)
    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1)
    backdrop-filter: blur(14px)
    -webkit-backdrop-filter: blur(6.5px)
    border-radius: $border-radius
    border: 1px solid rgba(255, 255, 255, 0.18)
    
    margin: 2rem
    padding: 2rem
    
    @media only screen and (max-width: $breakpoint-mobile)
      margin: 0.5rem
      padding: 1rem

    width: min(100%, 600px)

    color: white

    h2
      text-align: center

    h4
      font-weight: 300
      padding: 0 0 2rem 0
      text-align: center

    .fields
      height: 100%

      display: flex
      flex-direction: column
      justify-content: space-around
      align-items: center

      .field
        width: 100%
        display: flex
        flex-direction: column
        margin: 1rem

      .error
        background: rgba(255, 0, 0, 0.4)
        box-shadow: 0 8px 32px 0 rgba(255, 0, 0, 0.3)
        backdrop-filter: blur(14px)
        -webkit-backdrop-filter: blur(6.5px)
        border-radius: $border-radius
        border: 1px solid rgba(255, 0, 0, 0.6)
        padding: 1rem
        margin: 0 0 0.8rem 0

input[type="email"], input[type="password"]
  color: white
  margin: 0.5em 0
  padding: 0.8em
  font-size: 1rem
  font-family: inherit

  background: rgba(255, 255, 255, 0.1)
  box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1)
  backdrop-filter: blur(14px)
  -webkit-backdrop-filter: blur(6.5px)
  border-radius: $border-radius
  border: 1px solid rgba(255, 255, 255, 0.18)

  transition: box-shadow 0.2s

  &:hover
    border: 1px solid rgba(255, 255, 255, 0.2)
    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1), 0 0 6px 3px rgba(255, 255, 255, 0.1)

  &:focus
    outline: none
    border: 1px solid rgba(255, 255, 255, 0.4)
    box-shadow: 0 8px 32px 0 rgba(255, 255, 255, 0.1), 0 0 6px 3px rgba(255, 255, 255, 0.2)

  &::placeholder
    color: rgb(255, 255, 255, 0.3)

button
  cursor: pointer
  color: white
  margin: 0.5em 0
  padding: 0.6em 0.8em
  font-size: 1rem
  font-family: inherit

  background: rgba(250, 64, 59, 0.1)
  box-shadow: 0 8px 32px 0 rgba(250, 64, 59, 0.1)
  backdrop-filter: blur(14px)
  -webkit-backdrop-filter: blur(6.5px)
  border-radius: $border-radius
  border: 1px solid rgba(250, 64, 59, 0.18)

  transition: box-shadow 0.2s, background 0.1s

  &:hover
    border: 1px solid rgba(250, 64, 59, 0.2)
    box-shadow: 0 8px 32px 0 rgba(250, 64, 59, 0.1), 0 0 6px 3px rgba(250, 64, 59, 0.1)
    background: rgba(250, 64, 59, 0.2)

  &:active
    background: rgba(250, 64, 59, 0.0)

  &:focus
    outline: none
    border: 1px solid rgba(250, 64, 59, 0.4)
    box-shadow: 0 8px 32px 0 rgba(250, 64, 59, 0.1), 0 0 6px 3px rgba(250, 64, 59, 0.2)

</style>
