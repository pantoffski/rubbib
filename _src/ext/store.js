import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    runnersLength:30,
    runners: []
  },
  getters: {
    tbl: (state) => {
      return null;
    }
  },
  mutations: {
    SOCKET_RUNNER: (state, runner) => {
      //console.log('new runner!!', runner);
      var idx = state.runners.findIndex(a => a.bibNo == runner.bibNo);
      if (idx >= 0) {
        for(var k in runner){
          state.runners[idx][k]=runner[k];
        }
      } else {
        runner.tStamp = new Date().getTime();
        state.runners = [...state.runners, runner].sort((a, b) => {
          return (a.tStamp == b.tStamp) ? 0 : ((a.tStamp > b.tStamp) ? -1 : 1)
        }).slice(0,state.runnersLength);
      }
    },
    foo(state) {
      console.log(db);
    }
  }
})
