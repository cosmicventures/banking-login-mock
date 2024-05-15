<script lang="ts">
  import Login from "./Login.svelte";
  import AccountSelection from "./AccountSelection.svelte";
  import banks from "./banks.json";

  function getContrast(hexcolor: string): string {
    hexcolor = hexcolor.replace("#", "");
    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "black" : "white";
  }

  function getColors(primaryColor: string): [string, string] {
    const textColor = getContrast(primaryColor);
    return [primaryColor, textColor];
  }

  const urlParams = new URLSearchParams(window.location.search);
  const urlBank = urlParams.get("bank") || "default";
  const redirectUrl =
    urlParams.get("redirect_url") || "http://yourwebsite.com/redirect_url";

  const defaultBank = {
    name: "default",
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
    },
  };

  const bank = banks.find((bank) => bank.name === urlBank) ?? defaultBank;

  const [primaryColor, textColor] = getColors(bank.colors.primary);

  let page: "login" | "account-selection" = "login";

  function setPage(newPage: "login" | "account-selection") {
    page = newPage;
  }

  $: {
    const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (path.includes("account-selection")) {
      page = "account-selection";
    } else {
      page = "login";
    }
  }
</script>

<main>
  {#if page === "login"}
    <Login
      bankLogo={"/bank-test.svg"}
      bankName={bank.name}
      {primaryColor}
      {redirectUrl}
      {textColor}
    />
  {:else if page === "account-selection"}
    <AccountSelection
      bankLogo={"/bank-test.svg"}
      bankName={bank.name}
      {primaryColor}
      {redirectUrl}
      {textColor}
    />
  {/if}
</main>
