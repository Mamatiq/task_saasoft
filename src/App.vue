<template>
  <main>
    <AccountForm />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAccountsStore } from "./stores/accounts";
import AccountForm from "./components/AccountForm.vue";

const accountsStore = useAccountsStore();

onMounted(() => {
  accountsStore.load();
});
</script>

<style></style>
