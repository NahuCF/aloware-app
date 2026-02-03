<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Send SMS"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="w-full">
        <div
          v-if="sent"
          class="flex items-center gap-2 px-3 py-2 rounded mb-3 text-sm bg-green-50 text-green-500"
        >
          <i class="el-icon-success"></i>
          <span>Message sent successfully</span>
        </div>

        <el-form :model="form" label-position="top">
          <el-form-item label="To">
            <el-input
              v-model="form.to"
              placeholder="+1234567890"
              :disabled="sending"
            >
              <template #prepend>
                <i class="el-icon-phone"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="Message">
            <el-input
              v-model="form.body"
              type="textarea"
              :rows="4"
              placeholder="Type your message..."
              :maxlength="1600"
              show-word-limit
              :disabled="sending"
            />
          </el-form-item>
        </el-form>

        <div class="flex justify-end gap-2 mt-4">
          <el-button @click="close" :disabled="sending">Cancel</el-button>
          <el-button
            type="primary"
            @click="send"
            :loading="sending"
            :disabled="!canSend"
          >
            Send
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { API } from "@/services";

export default defineComponent({
  name: "SmsComposer",
  data() {
    return {
      dialogVisible: false,
      sending: false,
      sent: false,
      form: {
        to: "",
        body: "",
      },
    };
  },
  computed: {
    canSend(): boolean {
      return this.form.to.length > 0 && this.form.body.length > 0;
    },
  },
  methods: {
    open(phoneNumber?: string) {
      this.dialogVisible = true;
      this.sent = false;
      if (phoneNumber) {
        this.form.to = phoneNumber;
      }
    },

    close() {
      this.dialogVisible = false;
      this.reset();
    },

    reset() {
      this.form.to = "";
      this.form.body = "";
      this.sent = false;
    },

    async send() {
      this.sending = true;

      try {
        await API.sms.send({
          to: this.form.to,
          body: this.form.body,
        });

        this.sent = true;
        this.form.body = "";

        setTimeout(() => {
          this.sent = false;
        }, 3000);
      } catch (error) {
        this.$message.error("Error in sms");
      } finally {
        this.sending = false;
      }
    },
  },
});
</script>
