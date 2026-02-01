import type { Module } from "vuex";
import type { User } from "@/types";

export interface AuthState {
  user: User | null;
  token: string;
}

const auth: Module<AuthState, unknown> = {
  namespaced: true,

  state: {
    user: null,
    token: "",
  },

  getters: {
    isAuthenticated(state: AuthState): boolean {
      return !!state.user && !!state.token;
    },
    currentUser(state: AuthState): User | null {
      return state.user;
    },
  },

  mutations: {
    setSession(state: AuthState, { user, token }: { user: User; token: string }) {
      state.user = user;
      state.token = token;
    },

    logout(state: AuthState) {
      state.user = null;
      state.token = "";
    },
  },

  actions: {
    login({ commit }, payload: { user: User; token: string }) {
      commit("setSession", payload);
    },

    logout({ commit }) {
      commit("logout");
    },
  },
};

export default auth;
