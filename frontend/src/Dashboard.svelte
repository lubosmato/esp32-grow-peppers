<script lang="ts">
  import { Route } from "svelte-navigator";
  import PrivateRouteGuard from "./lib/PrivateRouteGuard.svelte";
  import { useLogout } from "./lib/user";
  import { user } from "./lib/store";

  const logout = useLogout();

  export let path;
</script>

<Route {path} let:params let:location let:navigate>
  <PrivateRouteGuard>
    <h1>Hello {$user.name}</h1>
    <button on:click={logout}>Logout</button>
  </PrivateRouteGuard>
</Route>
