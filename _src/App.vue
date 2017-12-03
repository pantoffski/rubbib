
<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
import {
  mapState
} from 'vuex';
export default {
  name: 'app',
  data() {
    return {}
  },
  methods: {
    toggleNav() {
      var leftNavState = this.isLeftNavOpen;
      if (leftNavState)
        this.$store.commit('closeLeftNav');
      else
        this.$store.commit('openLeftNav');

      console.log('toggleing ' + this.isLeftNavOpen);
    }
  },
  computed: {
    foo() {
      return 'bar'
    },
    ...mapState({
      isLeftNavOpen: state => state.isLeftNavOpen
    })
  },
  components: {
  }
}
</script>

<style lang='less'>
@import "./css/config.less";
</style>
