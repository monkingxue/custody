<template>
  <div class="din">
    <div
      v-if="!displayOnly"
      class="amount-input flex-all"
    >
      <div
        class="action touch right-border flex-all"
        :class="{disabled: value === 0}"
        @click="onSubtract"
      >
        -
      </div>
      <div class="input">
        <input
          v-model="value"
          type="number"
        >
      </div>
      <div
        class="action touch left-border flex-all"
        @click="onAdd"
      >
        +
      </div>
    </div>
    <div
      v-else
      class="display"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
const fix = i => parseInt(i / 100) * 100
export default {
  props: {
    displayOnly: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number
    }
  },
  data() {
    return {
      value: 0
    }
  },
  watch: {
    amount: {
      immediate: true,
      handler(val) {
        if (val >= 0 && this.value !== val) {
          this.value = val
        }
      }
    },
    value: {
      handler(val) {
        if (val >= 0 && val !== this.amount) {
          this.$emit('change', Number(val))
        }
      }
    }
  },
  methods: {
    onAdd() {
      this.value = fix(this.value + 100)
    },
    onSubtract() {
      if (this.value <= 100) {
        this.value = 0
        return
      }
      this.value = fix(this.value - 100)
    }
  }
}
</script>
<style lang="less" scoped>
.display {
  border: 1px solid #FFF;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
}
.amount-input {
  background: #FFFFFF;
  border: 1px solid #DDDDDD;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.06);
  border-radius: 4px;
  .action {
    width: 40px;
    height: 40px;
    text-align: center;
    justify-content: center;
    align-items: end;
    color: #222222;
    font-size: 28px;
  }
  .disabled {
    opacity: .6;
    color: #666;
    background: #eee;
  }
  .input {
    width: 120px;
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    input {
      width: 100%;
      border:none;
      background-image:none;
      background-color:transparent;
      box-shadow: none;
      text-align: center;
    }
  }
  .right-border {
    border-right: 1px solid #DDDDDD;
  }
  .left-border {
    border-left: 1px solid #DDDDDD;
  }
}
</style>
