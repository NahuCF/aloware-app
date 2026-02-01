<template>
  <div class="min-h-screen flex">
    <aside class="w-52 bg-white border-r border-gray-200">
      <el-menu :default-active="$route.path" router class="border-r-0">
        <el-menu-item index="/lines">
          <i class="el-icon-phone"></i>
          <span>Lines</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span>Users</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <main class="flex-1 bg-gray-100 p-5">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppLayout",
});
</script>
