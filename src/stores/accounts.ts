import { defineStore } from "pinia";
import type { Account } from "@/types/account";

const STORAGE_KEY = "accounts";

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    accounts: [] as Account[],
  }),

  actions: {
    load() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.accounts = JSON.parse(data);
      }
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts));
    },

    addAccount() {
      this.accounts.push({
        id: Date.now().toString() + Math.random().toString(),
        labels: [],
        type: "LOCAL",
        login: "",
        password: "",
        errors: {},
      });
      this.save();
    },

    updateAccount(account: Account) {
      const idx = this.accounts.findIndex((a) => a.id === account.id);
      if (idx !== -1) {
        this.accounts[idx] = account;
        this.save();
      }
    },

    removeAccount(id: string) {
      this.accounts = this.accounts.filter((a) => a.id !== id);
      this.save();
    },
  },
});
