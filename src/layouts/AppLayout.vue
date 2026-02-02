<template>
  <div class="min-h-screen flex">
    <aside class="w-52 bg-white border-r border-gray-200">
      <el-menu :default-active="$route.path" class="border-r-0">
        <el-menu-item index="/lines" @click="$router.push('/lines')">
          <i class="el-icon-phone"></i>
          <span>Lines</span>
        </el-menu-item>
        <el-menu-item index="/users" @click="$router.push('/users')">
          <i class="el-icon-user"></i>
          <span>Users</span>
        </el-menu-item>
        <el-menu-item @click="openSoftphone">
          <i class="el-icon-headset"></i>
          <span>Softphone</span>
          <span
            v-if="softphoneStatus"
            class="w-2 h-2 rounded-full inline-block ml-2"
            :class="{
              'bg-green-500': softphoneStatus === 'ready',
              'bg-yellow-500 animate-pulse': softphoneStatus === 'ringing',
              'bg-red-500': softphoneStatus === 'active',
              'bg-gray-400': softphoneStatus === 'offline',
            }"
          ></span>
        </el-menu-item>
      </el-menu>
    </aside>
    <main class="flex-1 bg-gray-100 p-5">
      <router-view />
    </main>
    <Softphone ref="softphone" @status-change="onSoftphoneStatus" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Softphone from "@/components/Softphone.vue";

export default defineComponent({
  name: "AppLayout",
  components: { Softphone },
  data() {
    return {
      softphoneStatus: "" as string,
    };
  },
  methods: {
    openSoftphone() {
      (this.$refs.softphone as InstanceType<typeof Softphone>).open();
    },
    onSoftphoneStatus(status: string) {
      this.softphoneStatus = status;
    },
  },
});
</script>
