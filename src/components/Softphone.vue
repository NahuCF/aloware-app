<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Softphone"
      width="320px"
      :close-on-click-modal="false"
      :close-on-press-escape="!activeCall"
      :show-close="!activeCall && !incomingCall"
    >
      <div class="w-full">
        <div
          class="flex items-center gap-2 px-3 py-2 rounded mb-3 text-sm"
          :class="statusClasses"
        >
          <i :class="statusIcon"></i>
          <span>{{ statusText }}</span>
        </div>

        <div v-if="incomingCall" class="text-center">
          <div class="flex items-center gap-3 mb-4">
            <i class="el-icon-phone-outline text-3xl text-yellow-500"></i>
            <div>
              <div class="text-lg font-medium">
                {{ incomingCall.parameters.From || "Unknown" }}
              </div>
              <div class="text-xs text-gray-400">Incoming Call</div>
            </div>
          </div>
          <div class="flex justify-center gap-4">
            <el-button type="success" circle @click="acceptCall">
              <i class="el-icon-phone"></i>
            </el-button>
            <el-button type="danger" circle @click="rejectCall">
              <i class="el-icon-close"></i>
            </el-button>
          </div>
        </div>

        <div v-if="activeCall" class="text-center">
          <div class="mb-4">
            <div class="text-base font-medium">{{ callNumber }}</div>
            <div class="text-2xl font-semibold text-red-500 font-mono">
              {{ formattedDuration }}
            </div>
          </div>
          <div class="flex justify-center gap-4">
            <el-button
              :type="isMuted ? 'warning' : 'default'"
              circle
              @click="toggleMute"
            >
              <i
                :class="
                  isMuted ? 'el-icon-microphone' : 'el-icon-turn-off-microphone'
                "
              ></i>
            </el-button>
            <el-button type="danger" circle @click="hangup">
              <i class="el-icon-phone"></i>
            </el-button>
          </div>
        </div>

        <div
          v-if="!activeCall && !incomingCall && deviceReady"
          class="flex gap-2"
        >
          <el-input
            v-model="dialNumber"
            placeholder="+1234567890"
            class="flex-1"
            @keyup.enter="makeCall"
          >
            <template #prepend>
              <i class="el-icon-phone"></i>
            </template>
          </el-input>
          <el-button type="success" :disabled="!dialNumber" @click="makeCall">
            Call
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Device, Call } from "@twilio/voice-sdk";
import { API } from "@/services";

export default defineComponent({
  name: "Softphone",
  emits: ["status-change"],
  data() {
    return {
      device: null as Device | null,
      deviceReady: false,
      activeCall: null as Call | null,
      incomingCall: null as Call | null,
      isMuted: false,
      dialNumber: "",
      callDuration: 0,
      callTimer: null as ReturnType<typeof setInterval> | null,
      dialogVisible: false,
    };
  },
  computed: {
    statusClasses(): string {
      if (this.activeCall) return "bg-red-50 text-red-500";
      if (this.incomingCall)
        return "bg-yellow-50 text-yellow-500 animate-pulse";
      if (this.deviceReady) return "bg-green-50 text-green-500";
      return "bg-gray-100 text-gray-400";
    },
    statusIcon(): string {
      if (this.activeCall) return "el-icon-phone";
      if (this.incomingCall) return "el-icon-bell";
      if (this.deviceReady) return "el-icon-success";
      return "el-icon-warning";
    },
    statusText(): string {
      if (this.activeCall) return "On Call";
      if (this.incomingCall) return "Incoming Call";
      if (this.deviceReady) return "Ready";
      return "Connecting (i hope)...";
    },
    callNumber(): string {
      if (this.activeCall) {
        const params = this.activeCall.parameters;
        return params.From || params.To || "idk what happend";
      }
      return "";
    },
    formattedDuration(): string {
      const mins = Math.floor(this.callDuration / 60);
      const secs = this.callDuration % 60;
      return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    },
    indicatorStatus(): string {
      if (this.activeCall) return "active";
      if (this.incomingCall) return "ringing";
      if (this.deviceReady) return "ready";
      return "offline";
    },
  },
  watch: {
    indicatorStatus: {
      immediate: true,
      handler(newStatus: string) {
        this.$emit("status-change", newStatus);
      },
    },
  },
  async mounted() {
    await this.initDevice();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    open() {
      this.dialogVisible = true;
    },

    close() {
      if (!this.activeCall && !this.incomingCall) {
        this.dialogVisible = false;
      }
    },

    async initDevice() {
      try {
        const response = await API.voice.getToken();
        const { token } = response.data;

        this.device = new Device(token, {
          logLevel: 1,
          codecPreferences: [Call.Codec.Opus, Call.Codec.PCMU],
        });

        this.device.on("registered", () => {
          this.deviceReady = true;
        });

        this.device.on("error", () => {
          this.deviceReady = false;
        });

        this.device.on("tokenWillExpire", async () => {
          await this.refreshToken();
        });

        this.device.on("incoming", (call: Call) => {
          this.incomingCall = call;
          this.dialogVisible = true;

          call.on("cancel", () => {
            this.incomingCall = null;
          });

          call.on("disconnect", () => {
            this.handleCallEnd();
          });
        });

        await this.device.register();
      } catch (error) {
        this.$message.error("Failed to initialize softphone");
      }
    },

    async refreshToken() {
      if (!this.device) return;

      try {
        const response = await API.voice.getToken();
        const { token } = response.data;
        this.device.updateToken(token);
      } catch (error) {
        this.$message.error("Refresh token failed. Again...");
      }
    },

    acceptCall() {
      if (this.incomingCall) {
        this.incomingCall.accept();
        this.activeCall = this.incomingCall;
        this.incomingCall = null;
        this.startCallTimer();
      }
    },

    rejectCall() {
      if (this.incomingCall) {
        this.incomingCall.reject();
        this.incomingCall = null;
      }
    },

    async makeCall() {
      if (!this.device || !this.dialNumber) return;

      try {
        const call = await this.device.connect({
          params: {
            To: this.dialNumber,
          },
        });

        this.activeCall = call;
        this.dialNumber = "";
        this.startCallTimer();

        call.on("disconnect", () => {
          this.handleCallEnd();
        });
      } catch (error) {
        this.$message.error("In gonna kill someone if this keeps failing...");
      }
    },

    hangup() {
      if (this.activeCall) {
        this.activeCall.disconnect();
      }
    },

    toggleMute() {
      if (this.activeCall) {
        this.isMuted = !this.isMuted;
        this.activeCall.mute(this.isMuted);
      }
    },

    startCallTimer() {
      this.callDuration = 0;
      this.callTimer = setInterval(() => {
        this.callDuration++;
      }, 1000);
    },

    handleCallEnd() {
      this.activeCall = null;
      this.isMuted = false;
      if (this.callTimer) {
        clearInterval(this.callTimer);
        this.callTimer = null;
      }
      this.callDuration = 0;
    },

    cleanup() {
      if (this.device) {
        this.device.destroy();
      }
      if (this.callTimer) {
        clearInterval(this.callTimer);
      }
    },
  },
});
</script>
