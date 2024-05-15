<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox";

  export let handleCheckboxChange: (state: boolean) => void;

  export let account = {
    iban: "",
    balance: "",
    selected: false,
    name: "",
  };
</script>

<div class="flex items-center justify-between">
  <div class="flex items-center gap-2">
    <Checkbox
      class="bg-white"
      checked={account.selected}
      on:click={() => handleCheckboxChange(!account.selected)}
    />
    <div>
      <p class="font-medium">{account.name}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {account.iban}
      </p>
    </div>
  </div>
  <p class="font-medium">{account.balance}</p>
</div>
