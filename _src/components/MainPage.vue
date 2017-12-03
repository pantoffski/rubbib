<template>
<div id='mainPage'>
  <div :style='aRunnerStyle()' class='aRunner' v-for="(runner,index) in runners" :index='index'>
    <span>{{sex(runner)}}{{bibNo(runner)}} :</span> <span> {{runner.name}}</span>
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
    return {}
  },
  methods: {
    aRunnerStyle() {
      var h = (200 / this.runnersLength);
      console.log(h);
      return {
        height: h + 'vh',
        'line-height': h + 'vh'
      }
    },
    sex(runner) {
      return runner.raceCat.slice(-1).toUpperCase()
    },
    bibNo(runner) {
      return runner.raceCat.slice(0, 2) + '-' + ("0000" + runner.bibNo).slice(-4);
    }
  },
  computed: {
    ...mapState(['runners', 'runnersLength'])
  }
}
</script>
<style lang="less">
@import "./../css/config.less";
@bibWidth: 250px;
@font-face {
    font-family: 'mono';
    src: url("./../css/mono.ttf");
}
#mainPage {
    color: @txtColor;
    column-count: 2;
    column-gap: 1vw;
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    font-family: 'mono';
    font-size: 40px;
    .aRunner {
        position: relative;
        display: block;
        width: 49.5vw;
        span {
            display: inline-block;
            position: absolute;
        }
        span:nth-of-type(1) {
            width: ~"calc(@{bibWidth} - 5px)";
            display: inline-block;
            text-align: left;
            padding-left: 5px;
        }
        span:nth-of-type(2) {
            left: @bibWidth;
            width: ~"calc(50vw - @{bibWidth})";
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}
</style>
