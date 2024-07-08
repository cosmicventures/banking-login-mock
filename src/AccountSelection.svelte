<script lang="ts">
  import { onMount } from "svelte";
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
  import { DateFormatter, type DateValue } from "@internationalized/date";
  import { writable } from "svelte/store";
  import Account from "./Account.svelte";
  import {
    batchRegisterBankAccounts,
    getBankAccounts,
    type Account as AccountType,
  } from "./services/open-banking";
  import App from "./App.svelte";
  import { formattedAmount } from "$lib/utils";

  export let textColor: string;
  export let primaryColor: string;
  export let bankName: string;
  export let redirectUrl: string;
  export let bankLogo: string;

  type AccountSelection = AccountType & { selected: boolean };

  const accounts = writable<AccountSelection[]>([]);

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    bankName = params.get("bank") || "default";
    redirectUrl =
      params.get("redirect_url") || "http://yourwebsite.com/redirect_url";

    const bankAccounts = await getBankAccounts();
    accounts.set(
      bankAccounts.map((account) => ({ ...account, selected: false }))
    );
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const selectedAccounts = $accounts
      .filter((account) => account.selected)
      .map((account) => account.id);

    let status: string;
    try {
      await batchRegisterBankAccounts(
        selectedAccounts.map((acc) => {
          const account = $accounts.find((a) => a.id === acc);
          if (!account) {
            throw new Error("Account not found");
          }
          return {
            accountName: account.nickname,
            accountNumber:
              account.accountIdentifications.find(
                (id) => id.type === "ACCOUNT_NUMBER"
              )?.identification ?? "",
            bankName: bankName,
            openBankingId: account.id,
          };
        })
      );
      status = "success";
    } catch (error) {
      status = "error";
    }

    const redirectWithParams = `${redirectUrl}?status=${status}`;

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
            <Label>Select All</Label>
          </div>
        </div>
        {#each $accounts as account, index}
          <Account
            account={{
              balance: formattedAmount(account.balance, account.currency),
              iban:
                account.accountIdentifications.find(
                  (id) => id.type === "ACCOUNT_NUMBER"
                )?.identification ?? "",
              name: account.nickname,
              selected: account.selected,
            }}
            handleCheckboxChange={(state) =>
              toggleAccountSelection(index, state)}
          />
        {/each}
        <div class="flex items-center justify-between mt-4">
          <Button
            style="background-color: {primaryColor}; color: {textColor}"
            on:click={(e) => handleSubmit(e)}>Import Accounts</Button
          >
        </div>
      </div></CardContent
    >
  </Card>
</div>

<style>
</style>
