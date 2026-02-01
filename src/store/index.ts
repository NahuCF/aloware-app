import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import auth, { type AuthState } from "./auth";

Vue.use(Vuex);

export interface RootState {
  auth: AuthState;
}

export default new Vuex.Store<RootState>({
  modules: {
    auth,
  },
  plugins: [
    createPersistedState({
      key: "contact_center_aloware_session",
      paths: ["auth.user", "auth.token"],
    }),
  ],
});
