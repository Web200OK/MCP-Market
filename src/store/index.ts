import { createStore } from 'vuex'

interface State {
  isAuthenticated: boolean
}

export default createStore<State>({
  state: {
    isAuthenticated: false
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true
    },
    logout(state) {
      state.isAuthenticated = false
    }
  },
  actions: {
    login({ commit }) {
      commit('login')
    },
    logout({ commit }) {
      commit('logout')
    }
  }
})
