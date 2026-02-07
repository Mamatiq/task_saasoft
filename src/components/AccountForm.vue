<template>
  <div class="account-form-container">
    <header class="form-header">
      <div class="header-content">
        <h1>Учетные записи</h1>
        <p class="subtitle">Управление учетными записями пользователей</p>
      </div>
      <!-- Кнопка PrimeVue -->
      <Button
        icon="pi pi-plus"
        label="Добавить запись"
        @click="addNewAccount"
        severity="primary"
      />
    </header>

    <div class="accounts-list">
      <div v-if="accounts.length === 0" class="empty-state">
        Нет учетных записей. Добавьте новую.
      </div>

      <AccountItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @update-account="updateExistingAccount"
        @remove-account="removeExistingAccount"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/accounts";
import AccountItem from "./AccountItem.vue";
import Button from "primevue/button"; // Импорт кнопки

import type { Account } from "@/types/account";

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);

const addNewAccount = () => {
  accountsStore.addAccount();
};

const updateExistingAccount = (account: Account) => {
  accountsStore.updateAccount(account);
};

const removeExistingAccount = (id: string) => {
  accountsStore.removeAccount(id);
};
</script>

<style scoped>
.account-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: var(--font-family, sans-serif);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.header-content h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #9ca3af;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
}
</style>
