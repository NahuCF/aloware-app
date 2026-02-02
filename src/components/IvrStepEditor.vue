<template>
  <div class="ivr-steps">
    <div
      v-for="(step, index) in value"
      :key="index"
      class="ivr-step"
      :style="{ marginLeft: depth * 24 + 'px' }"
    >
      <div class="mb-2 p-3 border rounded bg-gray-50">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-500 text-sm">When caller press</span>
          <el-select
            :value="step.digit"
            placeholder="Digit"
            style="width: 70px"
            size="small"
            @input="updateStep(index, 'digit', $event)"
          >
            <el-option v-for="d in digits" :key="d" :label="d" :value="d" />
          </el-select>
          <span class="text-gray-500 text-sm">then</span>
          <el-select
            :value="step.action_type"
            placeholder="Action"
            style="width: 140px"
            size="small"
            @input="updateActionType(index, $event)"
          >
            <el-option label="Sub-menu" value="menu" />
            <el-option label="Route by Skill" value="route_to_skill" />
            <el-option label="Call User" value="route_to_user" />
            <el-option label="Route to Line" value="route_to_line" />
          </el-select>

          <el-select
            v-if="step.action_type === 'route_to_line'"
            :value="step.target_id"
            placeholder="Line"
            style="width: 140px"
            size="small"
            @input="updateStep(index, 'target_id', $event)"
          >
            <el-option
              v-for="line in availableLines"
              :key="line.id"
              :label="line.name"
              :value="line.id"
            />
          </el-select>

          <el-select
            v-if="step.action_type === 'route_to_user'"
            :value="step.target_id"
            placeholder="User"
            style="width: 140px"
            size="small"
            @input="updateStep(index, 'target_id', $event)"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>

          <el-button
            v-if="step.action_type === 'menu'"
            size="small"
            @click="addSubStep(index)"
          >
            Add Sub-option
          </el-button>

          <el-button
            size="small"
            type="text"
            class="text-red-500"
            @click="removeStep(index)"
          >
            <i class="el-icon-delete"></i>
          </el-button>
        </div>

        <div class="flex items-center gap-2 mb-2">
          <span class="text-gray-500 text-sm">Say:</span>
          <el-input
            :value="step.label"
            placeholder="Text to speech"
            style="width: 250px"
            size="small"
            @input="updateStep(index, 'label', $event)"
          />
        </div>

        <div
          v-if="step.action_type === 'route_to_skill'"
          class="flex items-center gap-2 text-sm"
        >
          <span class="text-gray-500">Route to agents with:</span>
          <el-select
            :value="step.context && step.context.language_id"
            placeholder="Language"
            style="width: 120px"
            size="mini"
            clearable
            @input="updateContextField(index, 'language_id', $event)"
          >
            <el-option
              v-for="lang in languages"
              :key="lang.id"
              :label="lang.name"
              :value="lang.id"
            />
          </el-select>
          <el-select
            :value="step.context && step.context.skill_ids"
            placeholder="Skills"
            style="width: 160px"
            size="mini"
            multiple
            clearable
            @input="updateContextField(index, 'skill_ids', $event)"
          >
            <el-option
              v-for="skill in skills"
              :key="skill.id"
              :label="skill.name"
              :value="skill.id"
            />
          </el-select>
        </div>
      </div>

      <ivr-step-editor
        v-if="
          step.action_type === 'menu' &&
          step.sub_steps &&
          step.sub_steps.length > 0
        "
        :value="step.sub_steps"
        :users="users"
        :lines="lines"
        :current-line-id="currentLineId"
        :languages="languages"
        :skills="skills"
        :depth="depth + 1"
        @input="updateSubSteps(index, $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { IvrStep, User, Line, Language, Skill } from "@/types";

export default defineComponent({
  name: "IvrStepEditor",
  props: {
    value: {
      type: Array as PropType<IvrStep[]>,
      required: true,
    },
    users: {
      type: Array as PropType<User[]>,
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
    languages: {
      type: Array as PropType<Language[]>,
      required: true,
    },
    skills: {
      type: Array as PropType<Skill[]>,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  emits: ["input"],
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
    emitUpdate(newSteps: IvrStep[]) {
      this.$emit("input", newSteps);
    },
    updateStep(index: number, field: keyof IvrStep, value: unknown) {
      const newSteps = this.value.map((step, i) =>
        i === index ? { ...step, [field]: value } : step,
      );
      this.emitUpdate(newSteps);
    },
    updateActionType(index: number, actionType: string) {
      const step = this.value[index];
      const updatedStep: IvrStep = {
        ...step,
        action_type: actionType as IvrStep["action_type"],
        target_id: undefined,
        context: step.context || {},
        sub_steps:
          actionType === "menu" ? step.sub_steps || [] : step.sub_steps,
      };

      const newSteps = this.value.map((s, i) =>
        i === index ? updatedStep : s,
      );

      this.emitUpdate(newSteps);
    },
    updateContextField(index: number, field: string, value: unknown) {
      const step = this.value[index];
      const updatedStep: IvrStep = {
        ...step,
        context: {
          ...step.context,
          [field]: value,
        },
      };

      const newSteps = this.value.map((s, i) =>
        i === index ? updatedStep : s,
      );

      this.emitUpdate(newSteps);
    },
    updateSubSteps(index: number, subSteps: IvrStep[]) {
      const newSteps = this.value.map((step, i) =>
        i === index ? { ...step, sub_steps: subSteps } : step,
      );

      this.emitUpdate(newSteps);
    },
    addSubStep(index: number) {
      const step = this.value[index];
      const newSubStep: IvrStep = {
        digit: "",
        label: "",
        action_type: "menu",
        context: {},
        sub_steps: [],
      };

      const updatedStep: IvrStep = {
        ...step,
        sub_steps: [...(step.sub_steps || []), newSubStep],
      };

      const newSteps = this.value.map((s, i) =>
        i === index ? updatedStep : s,
      );

      this.emitUpdate(newSteps);
    },
    removeStep(index: number) {
      const newSteps = this.value.filter((_, i) => i !== index);
      this.emitUpdate(newSteps);
    },
  },
});
</script>
