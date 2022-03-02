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
            name="email"
            placeholder="chilli@peppers.com"
          />
        </div>

        <div class="field">
          <span>Password</span>
          <input
            bind:value={password}
            type="password"
            name="password"
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
@import "./sass/variables"
@import "./sass/helpers"

.login-page
  width: 100%
  height: 100%

  display: flex
  flex-direction: row
  align-items: center
  justify-content: center

  form
    @extend %panel

    width: min(100%, 600px)
    display: flex
    flex-direction: column
    
    margin: 2rem
    padding: 2rem
    
    @media only screen and (max-width: $breakpoint-mobile) 
      margin: 0.5rem
      padding: 1rem

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
        @include buble($danger-color)

</style>
