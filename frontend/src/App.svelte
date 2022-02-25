<script lang="ts">
  import logo from "./assets/logo.png";
  import Counter from "./lib/Counter.svelte";

  // TODO use store?
  const storeNotification = (notification) => {
    const HISTORY_KEY = "notifications";
    const HISTORY_LIMIT = 10;

    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) ?? [];
    if (history.length >= HISTORY_LIMIT) {
      history.splice(history.length - HISTORY_LIMIT - 1);
    }
    history.unshift({ ...notification, time: new Date() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  };

  // TODO registration must be done after login
  const registerWorker = async () => {
    const reg = await navigator.serviceWorker.register("sw.js");
    if (Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    navigator.serviceWorker.addEventListener("message", (ev) =>
      storeNotification(ev.data)
    );
  };

  registerWorker();
</script>

<main>
  <div class="container mx-auto">
    <img src={logo} alt="Svelte Logo" />
    <h1>Hello Typescript!</h1>

    <Counter />

    <figure
      class="md:flex bg-slate-100 rounded-xl p-8 md:p-0 dark:bg-slate-800"
    >
      <img
        class="w-24 h-24 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto"
        src="/sarah-dayan.jpg"
        alt=""
        width="384"
        height="512"
      />
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p class="text-lg font-medium">
            “Tailwind CSS is the only framework that I've seen scale on large
            teams. It’s easy to customize, adapts to any design, and the build
            size is tiny.”
          </p>
        </blockquote>
        <figcaption class="font-medium">
          <div class="text-sky-500 dark:text-sky-400">Sarah Dayan</div>
          <div class="text-slate-700 dark:text-slate-500">
            Staff Engineer, Algolia
          </div>
        </figcaption>
      </div>
    </figure>
  </div>
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
