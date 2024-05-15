<script lang="ts">
  import { onMount } from "svelte";
  import CalendarIcon from "lucide-svelte/icons/calendar";
  import "flatpickr/dist/flatpickr.css";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Button } from "$lib/components/ui/button";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { Calendar } from "$lib/components/ui/calendar";
  import { cn } from "$lib/utils";
  import {
    DateFormatter,
    getLocalTimeZone,
    type DateValue,
  } from "@internationalized/date";
  import Account from "./Account.svelte";
  import { writable } from "svelte/store";

  export let textColor: string;
  export let primaryColor: string;
  export let bankName: string;
  export let redirectUrl: string;
  export let bankLogo: string;

  const accounts = writable([
    {
      iban: "DE12345678901234567890",
      balance: "€ 1,234.56",
      selected: false,
      name: "Checking Account",
    },
    {
      iban: "DE09876543210987654321",
      balance: "€ 9,876.54",
      selected: false,
      name: "Savings Account",
    },
  ]);
  let accessUntil: Date | null = null;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    bankName = params.get("bank") || "default";
    redirectUrl =
      params.get("redirect_url") || "http://yourwebsite.com/redirect_url";
  });

  function handleSubmit(event: Event) {
    event.preventDefault();
    const selectedAccounts = $accounts
      .filter((account) => account.selected)
      .map((account) => account.iban);

    const token = "mock_token"; // This would be generated dynamically
    const redirectWithParams = `${redirectUrl}?token=${token}&accounts=${selectedAccounts.join(",")}&access_until=${accessUntil?.toISOString().split("T")[0]}`;
    window.location.href = redirectWithParams;
  }

  function toggleAccountSelection(index: number, value: boolean) {
    // Get the current state of the accounts
    const currentAccounts = $accounts; // Toggle the selected state of the account at the given index
    currentAccounts[index].selected = value; // Update the accounts store with the new state
    accounts.set(currentAccounts);
  }

  const df = new DateFormatter("en-US", {
    dateStyle: "long",
  });

  let value: DateValue | undefined = undefined;
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
  <Card class="w-[75%] max-w-[670px] bg-slate-50">
    <CardHeader>
      <CardTitle>Your Bank Accounts</CardTitle>
      <CardDescription
        >Manage your bank accounts and import new ones.</CardDescription
      >
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Checkbox
              class="bg-white"
              id="select-all"
              checked={$accounts.every((account) => account.selected)}
              on:click={() => {
                const allSelected = $accounts.every(
                  (account) => account.selected
                );
                const newAccounts = $accounts.map((account) => ({
                  ...account,
                  selected: !allSelected,
                }));
                accounts.set(newAccounts);
              }}
            />
            <Label class="font-medium" htmlFor="select-all">Select All</Label>
          </div>
        </div>
        {#each $accounts as account, index}
          <Account
            {account}
            handleCheckboxChange={(state) =>
              toggleAccountSelection(index, state)}
          />
        {/each}
        <div class="flex items-center justify-between mt-4">
          <Button
            style="background-color: {primaryColor}; color: {textColor}"
            on:click={(e) => handleSubmit(e)}>Import Accounts</Button
          >
          <Popover>
            <PopoverTrigger asChild let:builder>
              <Button
                variant="outline"
                class={cn(
                  "w-[280px] justify-start text-left font-normal bg-white",
                  !value && "text-muted-foreground"
                )}
                builders={[builder]}
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {value
                  ? df.format(value.toDate(getLocalTimeZone()))
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar class="bg-white" bind:value initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div></CardContent
    >
  </Card>
</div>

<style>
</style>
