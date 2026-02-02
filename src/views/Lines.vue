<template>
  <div>
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-medium">Lines</h2>
      <el-button type="primary" size="small" @click="openCreate"
        >Add Line</el-button
      >
    </div>
    <el-table :data="lines" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="phone_number" label="Phone Number" />
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
      :title="editingId ? 'Edit Line' : 'New Line'"
      :visible.sync="showDialog"
      width="700px"
      @close="resetForm"
    >
      <el-form label-position="top">
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="Name">
            <el-input v-model="form.name" placeholder="Name" />
          </el-form-item>
          <el-form-item label="Phone Number">
            <el-input v-model="form.phone_number" placeholder="+541123487090" />
          </el-form-item>
        </div>

        <div class="mt-4">
          <div class="flex justify-between items-center mb-3">
            <span class="text-sm font-medium text-gray-700">IVR Options</span>
            <el-button size="mini" @click="addStep">Add Option</el-button>
          </div>

          <div v-if="form.ivr_steps.length === 0" class="text-gray-500 text-sm">
            Add an IVR option
          </div>

          <ivr-step-editor
            v-else
            v-model="form.ivr_steps"
            :users="users"
            :lines="lines"
            :current-line-id="editingId"
            :languages="languages"
            :skills="skills"
          />
        </div>
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
import type { Line, IvrStep, User, Language, Skill } from "@/types";
import IvrStepEditor from "@/components/IvrStepEditor.vue";

export default defineComponent({
  name: "LinesView",
  components: { IvrStepEditor },
  mixins: [createCrudMixin({ api: API.line, fetchMethod: "fetchData" })],
  data() {
    return {
      lines: [] as Line[],
      users: [] as User[],
      languages: [] as Language[],
      skills: [] as Skill[],
      loading: false,
      showDialog: false,
      editingId: null as number | null,
      form: {
        name: "",
        phone_number: "",
        ivr_steps: [] as IvrStep[],
      },
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [linesRes, usersRes, langRes, skillRes] = await Promise.all([
          API.line.index(),
          API.user.index(),
          API.language.index(),
          API.skill.index(),
        ]);
        this.lines = linesRes.data.data;
        this.users = usersRes.data.data;
        this.languages = langRes.data.data;
        this.skills = skillRes.data.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.editingId = null;
      this.form = {
        name: "",
        phone_number: "",
        ivr_steps: [],
      };
    },
    openCreate() {
      this.resetForm();
      this.showDialog = true;
    },
    async openEdit(line: Line) {
      this.editingId = line.id;
      try {
        const response = await API.line.show(line.id);
        const data = response.data.data;
        this.form = {
          name: data.name,
          phone_number: data.phone_number,
          ivr_steps: data.ivr_steps || [],
        };
        this.showDialog = true;
      } catch (error) {
        console.error("Failed to fetch line:", error);
      }
    },
    addStep() {
      this.form.ivr_steps = [
        ...this.form.ivr_steps,
        {
          digit: "",
          label: "",
          action_type: "menu",
          context: {},
          sub_steps: [],
        },
      ];
    },
    handleSave() {
      const data = {
        id: this.editingId || undefined,
        name: this.form.name,
        phone_number: this.form.phone_number,
        ivr_steps: this.form.ivr_steps.length > 0 ? this.form.ivr_steps : null,
      };

      (this as any).crudCreateOrUpdate(data, () => {
        this.showDialog = false;
      });
    },
    handleDelete(line: Line) {
      (this as any).crudRemove(line.id);
    },
  },
});
</script>
