<template>
<div id='mainPage'>
  <div class='aRunner' v-for="(runner,index) in runners" :index='index'>
    <span>{{sex(runner)}}</span> <span>{{bibNo(runner)}} : {{runner.name}}</span>
  </div>
</div>
</template>

<script>
import {
  mapState

} from 'vuex';
export default {
  name: 'mainPage',
  data() {
    return {
      sortIdx: 0,
      di: -1
    }
  },
  methods: {
    sex(runner) {
      return runner.raceCat.slice(-1).toUpperCase()
    },
    bibNo(runner) {
      return runner.raceCat.slice(0, 2) + '-' + ("0000" + runner.bibNo).slice(-4);
    }
  },
  computed: {
    ...mapState(['runners'])
  }
}
</script>
<style lang="less">
@font-face {
    font-family: 'mono';
    src: url("./../css/mono.ttf");
}
#mainPage {
    column-count: 2;
    column-gap: 6vw;
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px;
    font-family: 'mono';
    .aRunner {
        display: block;
        height: 60px;
        width:47vw;
        span:nth-of-type(1) {
            width: 40px;
            display: inline-block;
            text-align: right;
        }
    }
}
</style>
