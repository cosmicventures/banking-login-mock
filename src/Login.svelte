<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import { Button } from "$lib/components/ui/button";

  export let textColor: string;
  export let primaryColor: string;
  export let bankName: string;
  export let redirectUrl: string;
  export let bankLogo: string;

  function handleSubmit(event: Event) {
    event.preventDefault();
    const encodedRedirectUrl = encodeURIComponent(redirectUrl);
    window.location.href = `/account-selection?bank=${bankName}&redirect_url=${encodedRedirectUrl}`;
  }
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
  <div class="flex flex-col items-center justify-center space-y-4">
    <Card class="w-full max-w-md bg-slate-50">
      <CardHeader class="flex flex-col items-center">
        <img
          alt="Bank Logo"
          class="rounded-full"
          src="https://imgs.search.brave.com/c2k6Jrbpq2vg5bEnIYk18lx5in9s7KG-RZnSAOiSrQU/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9hc3Nl/dHMuc3RpY2twbmcu/Y29tL2ltYWdlcy82/MDk1MWVmNjUzYThi/ZjAwMDQwZmYzYTAu/cG5n"
          style="object-fit: cover; width: 60%;"
        />
        <CardTitle class="text-2xl mt-4">Login</CardTitle>
        <CardDescription
          >Enter your credentials to access your account.</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form class="grid gap-4">
          <div class="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              type="text"
            />
          </div>
          <div class="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
          <Button
            style="background-color: {primaryColor}; color: {textColor}"
            on:click={(e) => handleSubmit(e)}
            class="w-full"
            type="submit">Login</Button
          >
        </form>
      </CardContent>
    </Card>
  </div>
</div>

<style>
  :global(body) {
    font-family: Inter, sans-serif;
    margin: 0;
    padding: 0;
    color: var(--secondary-color);
  }
</style>
