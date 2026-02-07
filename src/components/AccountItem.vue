<template>
  <div class="account-item card">
    <div class="form-group">
      <label>Метка</label>
      <InputText
        v-model="labelsAsString"
        @blur="handleUpdate"
        placeholder="метки через ;"
        maxlength="50"
        class="w-full"
      />
      <small class="hint">Например: work;main</small>
    </div>

    <div class="form-group">
      <label>Тип записи</label>
      <Select
        v-model="localAccount.type"
        :options="typeOptions"
        optionLabel="label"
        optionValue="value"
        @change="handleTypeChange"
        class="w-full"
      />
    </div>

    <div class="form-group">
      <label>Логин *</label>
      <InputText
        v-model="localAccount.login"
        @blur="handleUpdate"
        :invalid="!!localAccount.errors?.login"
        required
        maxlength="100"
        class="w-full"
      />
      <small v-if="localAccount.errors?.login" class="error-text"
        >Поле обязательно</small
      >
    </div>

    <div class="form-group" v-if="localAccount.type === 'LOCAL'">
      <label>Пароль *</label>
      <Password
        v-model="localAccount.password"
        @blur="handleUpdate"
        :invalid="!!localAccount.errors?.password"
        toggleMask
        :feedback="false"
        class="w-full"
        inputClass="w-full"
      />
      <small v-if="localAccount.errors?.password" class="error-text"
        >Поле обязательно</small
      >
    </div>

    <div class="actions">
      <Button
        icon="pi pi-trash"
        label="Удалить"
        severity="danger"
        text
        @click="emitRemove"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Account, LabelItem } from "@/types/account";

import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Password from "primevue/password";
import Button from "primevue/button";

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  (e: "update-account", account: Account): void;
  (e: "remove-account", id: string): void;
}>();

const localAccount = ref<Account>({ ...props.account });

const typeOptions = [
  { label: "Локальная", value: "LOCAL" },
  { label: "LDAP", value: "LDAP" },
];

watch(
  () => props.account,
  (newAccount) => {
    localAccount.value = { ...newAccount };
  },
  { deep: true }
);

const labelsAsString = computed({
  get: () => localAccount.value.labels.map((l) => l.text).join(";"),
  set: (value: string) => {
    const labels: LabelItem[] = value
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((text) => ({ text }));
    localAccount.value.labels = labels;
  },
});

const validate = (): boolean => {
  const errors: { login?: boolean; password?: boolean } = {};
  let isValid = true;

  if (!localAccount.value.login?.trim()) {
    errors.login = true;
    isValid = false;
  }

  if (localAccount.value.type === "LOCAL") {
    if (!localAccount.value.password?.trim()) {
      errors.password = true;
      isValid = false;
    }
  }

  localAccount.value.errors = errors;
  return isValid;
};

const handleUpdate = () => {
  validate();
  emit("update-account", localAccount.value);
};

const handleTypeChange = () => {
  if (localAccount.value.type === "LDAP") {
    localAccount.value.password = null;
  }
  handleUpdate();
};

const emitRemove = () => {
  emit("remove-account", localAccount.value.id);
};
</script>

<style scoped>
.account-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1rem;
  align-items: start;
  background: #fff;
  transition: box-shadow 0.2s;
}

.account-item:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.hint {
  font-size: 0.75rem;
  color: #9ca3af;
}

.error-text {
  color: #ef4444;
  font-size: 0.75rem;
}

.actions {
  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 1.6rem;
}

@media (max-width: 1024px) {
  .account-item {
    grid-template-columns: 1fr;
  }
  .actions {
    padding-top: 0;
    justify-content: flex-end;
  }
}

.w-full {
  width: 100%;
}
</style>
