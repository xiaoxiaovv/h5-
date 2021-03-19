<template>
  <div class="pagekeyboard">
    <div class="keyboard">
      <div class="keyboardli" @click="keyUp(1, 1)">1</div>
      <div class="keyboardli" @click="keyUp(1, 2)">2</div>
      <div class="keyboardli" @click="keyUp(1, 3)">3</div>
      <div class="keyboardli" @click="keyUp(1, 4)">4</div>
      <div class="keyboardli" @click="keyUp(1, 5)">5</div>
      <div class="keyboardli" @click="keyUp(1, 6)">6</div>
      <div class="keyboardli" @click="keyUp(1, 7)">7</div>
      <div class="keyboardli" @click="keyUp(1, 8)">8</div>
      <div class="keyboardli" @click="keyUp(1, 9)">9</div>
      <div class="keyboardli" @click="keyUp(2, '.')">.</div>
      <div class="keyboardli" @click="keyUp(1, 0)">0</div>
      <div class="keyboardli" @click="keyUp(3)">
        <img src="@/assets/iconimg/icon-del.png" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'keyboard',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    maxPrice: {
      type: [Number, String],
      default: 99999999
    }
  },
  watch: {
    value(val, oldVal) {
      this.newVal = val + ''
    }
  },
  created() {
    this.newVal = this.value
  },
  data () {
    return {
      newVal: ''
    }
  },
  methods: {
    /**
     *
     * @param type 1--数字，2--点，3--删除
     * @param val 数值
     */
    keyUp(type, val) {
      let priceval = this.newVal
      if (type === 1 || type === 2) {
        priceval = priceval + '' + val
      } else if (type === 3) {
        let length = priceval.length
        if (length > 1) {
          priceval = priceval.slice(0, length-1)
        } else {
          priceval = ''
        }
      }
      let priceArr = priceval.split('.')
      if (priceArr.length <= 2) {
        let maxPrice = Number(this.maxPrice + '9')
        if (priceval > maxPrice) {
          return
        } else {
          if (priceArr[1]) {
            if (priceArr[1].length > 2) {
              return
            }
          }
        }
      }
      this.$emit('input', priceval)
    }
  }
}
</script>

<style scoped>
  /*键盘*/
  .pagekeyboard {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 3;
  }
  .keyboard {
    display: flex;
    flex-flow:row wrap;
    background-color: #fff;
    border-top: 1px solid #E3E6ED;
  }
  .keyboardli {
    flex: 1 calc(33.33% - 1px);
    width: calc(33.33% - 1px);
    height: 2.827rem;
    line-height: 2.827rem;
    font-size: 1.493rem;
    color: #030303;
    font-weight: 500;
    border-bottom: 1px solid #E3E6ED;
    border-right: 1px solid #E3E6ED;
    text-align: center;
  }
  .keyboardli:nth-child(3n + 3) {
    border-right: 0;
  }
  .keyboardli:last-child {
    background-color: #E3E6ED;
  }
  .keyboardli:last-child img {
    width: 1.227rem;
    height: 0.907rem;
    margin-top: 0.907rem;
  }
</style>
