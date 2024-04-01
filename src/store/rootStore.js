const State = {
  videoInfo: {}
};
const getters = {};
const mutations = {
  setVideoInfo(state, data) {
    state.videoInfo = data;
  },
};

const actions = {
  
};

export default {
  namespaced: true,
  state: State,
  mutations,
  actions,
  getters,
};
