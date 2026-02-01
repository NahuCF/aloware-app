<template>
  <el-card>
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-medium">Sign In</h2>
      <a
        href="https://github.com/NahuCF/aloware-app"
        target="_blank"
        class="text-gray-500 hover:text-gray-700"
      >
        <i class="el-icon-link"></i> Repo link
      </a>
    </div>
    <el-form :model="form" @submit.native.prevent="handleSubmit">
      <el-form-item label="Email">
        <el-input v-model="form.email" type="email" />
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        class="mb-5"
      />
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          :loading="loading"
          class="w-full"
        >
          Sign In
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API } from "@/services";

export default defineComponent({
  name: "Login",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      error: "",
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = "";

      try {
        const response = await API.auth.login(this.form);
        const { data, meta } = response.data;

        this.$store.dispatch("auth/login", {
          user: data,
          token: meta.token,
        });

        this.$router.push("/");
      } catch (err: any) {
        this.error = err.response?.data?.message || "Wtf happend?";
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>
