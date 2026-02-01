import { Message } from "element-ui";
import type { Vue } from "vue/types/vue";

// This is allows us to handle basic CRUD operations
// without repeating ourself, it handles errors, loading
// and success messages

interface CrudApi {
  store?: (data: any) => Promise<any>;
  update?: (id: number, data: any) => Promise<any>;
  destroy?: (id: number) => Promise<any>;
}

interface CrudMixinOptions {
  api: CrudApi;
  fetchMethod: string;
  messages?: {
    created?: string;
    updated?: string;
    deleted?: string;
  };
}

export interface CrudMixin extends Vue {
  crudLoading: boolean;
  crudCreateOrUpdate(item: any, onSuccess?: () => void): Promise<void>;
  crudRemove(id: number, onSuccess?: () => void): Promise<void>;
}

export function createCrudMixin(options: CrudMixinOptions) {
  const messages = {
    created: options.messages?.created || "Created successfully",
    updated: options.messages?.updated || "Updated successfully",
    deleted: options.messages?.deleted || "Deleted successfully",
  };

  return {
    data() {
      return {
        crudLoading: false,
      };
    },
    methods: {
      async crudCreateOrUpdate(item: any, onSuccess?: () => void) {
        (this as any).crudLoading = true;
        try {
          if (item.id) {
            if (!options.api.update) {
              console.warn("Update operation is not available.");
              return;
            }
            await options.api.update(item.id, item);
            Message.success(messages.updated);
          } else {
            if (!options.api.store) {
              console.warn("Create operation is not available.");
              return;
            }
            await options.api.store(item);
            Message.success(messages.created);
          }
          (this as any)[options.fetchMethod]();
          onSuccess?.();
        } catch (error: any) {
          Message.error(error.response?.data?.message || "Operation failed");
        } finally {
          (this as any).crudLoading = false;
        }
      },
      async crudRemove(id: number, onSuccess?: () => void) {
        if (!options.api.destroy) {
          console.warn("Delete operation is not available.");
          return;
        }

        (this as any).crudLoading = true;
        try {
          await options.api.destroy(id);
          Message.success(messages.deleted);
          (this as any)[options.fetchMethod]();
          onSuccess?.();
        } catch (error: any) {
          Message.error(error.response?.data?.message || "Delete failed");
        } finally {
          (this as any).crudLoading = false;
        }
      },
    },
  };
}
