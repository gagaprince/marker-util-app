import Vue from 'vue';
import Vuex from 'vuex';
import rootStore from './rootStore';

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state: rootStore.state,
  getters: rootStore.getters,
  mutations: rootStore.mutations,
  actions: rootStore.actions,
  modules: {
    
  },
});
