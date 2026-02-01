<template>
  <div class="ivr-steps">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="ivr-step"
      :style="{ marginLeft: depth * 24 + 'px' }"
    >
      <div class="mb-2 p-3 border rounded bg-gray-50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-500 text-sm">When caller press</span>
          <el-select v-model="step.digit" placeholder="Digit" style="width: 70px" size="small">
            <el-option v-for="d in digits" :key="d" :label="d" :value="d" />
          </el-select>
          <span class="text-gray-500 text-sm">then</span>
          <el-select v-model="step.action_type" placeholder="Action" style="width: 140px" size="small" @change="onActionChange(step)">
            <el-option label="Sub-menu" value="menu" />
            <el-option label="Route to Line" value="route_to_line" />
          </el-select>

          <el-select
            v-if="step.action_type === 'route_to_line'"
            v-model="step.target_id"
            placeholder="Line"
            style="width: 140px"
            size="small"
          >
            <el-option v-for="line in availableLines" :key="line.id" :label="line.name" :value="line.id" />
          </el-select>

          <el-button
            v-if="step.action_type === 'menu'"
            size="small"
            @click="addSubStep(step)"
          >
            Add Sub-option
          </el-button>

          <el-button size="small" type="text" class="text-red-500" @click="$emit('remove', steps, index)">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>

        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-500 text-sm">Say:</span>
          <el-input
            v-model="step.label"
            placeholder="Text to speak (e.g. Sales)"
            style="width: 250px"
            size="small"
          />
        </div>
      </div>

      <ivr-step-editor
        v-if="step.action_type === 'menu' && step.sub_steps && step.sub_steps.length > 0"
        :steps="step.sub_steps"
        :lines="lines"
        :current-line-id="currentLineId"
        :depth="depth + 1"
        @add="(s) => $emit('add', s)"
        @remove="(s, i) => $emit('remove', s, i)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IvrStep, Line } from "@/types";

export default defineComponent({
  name: "IvrStepEditor",
  props: {
    steps: {
      type: Array as PropType<IvrStep[]>,
      required: true,
    },
    lines: {
      type: Array as PropType<Line[]>,
      required: true,
    },
    currentLineId: {
      type: Number as PropType<number | null>,
      default: null,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  emits: ["add", "remove"],
  data() {
    return {
      digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "#"],
    };
  },
  computed: {
    availableLines(): Line[] {
      if (!this.currentLineId) return this.lines;
      return this.lines.filter((line) => line.id !== this.currentLineId);
    },
  },
  methods: {
    onActionChange(step: IvrStep) {
      this.$set(step, "target_id", undefined);
      if (step.action_type === "menu" && !step.sub_steps) {
        this.$set(step, "sub_steps", []);
      }
    },
    addSubStep(step: IvrStep) {
      if (!step.sub_steps) {
        this.$set(step, "sub_steps", []);
      }
      step.sub_steps.push({
        digit: "",
        label: "",
        action_type: "menu",
        sub_steps: [],
      });
    },
  },
});
</script>
