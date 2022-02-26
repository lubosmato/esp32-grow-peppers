<script lang="ts">
  import "reset-css";
  import "@fontsource/montserrat/300.css";
  import "@fontsource/montserrat/400.css";
  import "@fontsource/montserrat/700.css";
  import "./sass/app.sass";

  import { Router, Route } from "svelte-navigator";
  import Login from "./Login.svelte";
  import Dashboard from "./Dashboard.svelte";
</script>

<Router>
  <Route path="login">
    <Login />
  </Route>

  <Dashboard path="/" />
</Router>
