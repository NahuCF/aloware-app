<template>
  <div>
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-medium">Users</h2>
      <el-button type="primary" size="small" @click="openCreate"
        >Add User</el-button
      >
    </div>
    <el-table :data="users" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Languages">
        <template #default="{ row }">
          {{ formatLanguages(row) }}
        </template>
      </el-table-column>
      <el-table-column label="Skills">
        <template #default="{ row }">
          {{ formatSkills(row) }}
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="openEdit(row)"
            >Edit</el-button
          >
          <el-button type="text" size="small" @click="handleDelete(row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="editingId ? 'Edit User' : 'New User'"
      :visible.sync="showDialog"
      width="500px"
      @close="resetForm"
    >
      <el-form label-position="top">
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="Full name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="Email address"
          />
        </el-form-item>
        <el-form-item v-if="!editingId" label="Password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Password"
            show-password
          />
        </el-form-item>
        <el-form-item label="Languages">
          <el-checkbox-group v-model="form.language_ids">
            <el-checkbox
              v-for="lang in languages"
              :key="lang.id"
              :label="lang.id"
            >
              {{ lang.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="Skills">
          <el-checkbox-group v-model="form.skill_ids">
            <el-checkbox
              v-for="skill in skills"
              :key="skill.id"
              :label="skill.id"
            >
              {{ skill.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showDialog = false">Cancel</el-button>
        <el-button type="primary" :loading="crudLoading" @click="handleSave"
          >Save</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API } from "@/services";
import { createCrudMixin } from "@/mixins/crudMixin";
import type { User, Language, Skill } from "@/types";

export default defineComponent({
  name: "users-view",
  mixins: [createCrudMixin({ api: API.user, fetchMethod: "fetchData" })],
  data() {
    return {
      users: [] as User[],
      languages: [] as Language[],
      skills: [] as Skill[],
      loading: false,
      showDialog: false,
      editingId: null as number | null,
      form: {
        name: "",
        email: "",
        password: "",
        language_ids: [] as number[],
        skill_ids: [] as number[],
      },
    };
  },
  async mounted() {
    await this.fetchData();
    await this.fetchOptions();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await API.user.index();
        this.users = response.data.data;
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOptions() {
      try {
        const [langRes, skillRes] = await Promise.all([
          API.language.index(),
          API.skill.index(),
        ]);
        this.languages = langRes.data.data;
        this.skills = skillRes.data.data;
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    },
    formatLanguages(user: User) {
      return user.languages?.map((l) => l.name).join(", ") || "-";
    },
    formatSkills(user: User) {
      return user.skills?.map((s) => s.name).join(", ") || "-";
    },
    resetForm() {
      this.editingId = null;
      this.form = {
        name: "",
        email: "",
        password: "",
        language_ids: [],
        skill_ids: [],
      };
    },
    openCreate() {
      this.resetForm();
      this.showDialog = true;
    },
    async openEdit(user: User) {
      this.editingId = user.id;
      try {
        const response = await API.user.show(user.id);
        const data = response.data.data;
        this.form = {
          name: data.name,
          email: data.email,
          password: "",
          language_ids: data.languages?.map((l: Language) => l.id) || [],
          skill_ids: data.skills?.map((s: Skill) => s.id) || [],
        };
        this.showDialog = true;
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    },
    handleSave() {
      const data: any = {
        id: this.editingId || undefined,
        name: this.form.name,
        email: this.form.email,
        language_ids: this.form.language_ids,
        skill_ids: this.form.skill_ids,
      };

      if (!this.editingId && this.form.password) {
        data.password = this.form.password;
      }

      // This is why i dont like options api, it does not
      // work well with typescript
      (this as any).crudCreateOrUpdate(data, () => {
        this.showDialog = false;
      });
    },
    handleDelete(user: User) {
      (this as any).crudRemove(user.id);
    },
  },
});
</script>
