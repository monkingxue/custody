<template>
  <van-popup
    v-model="showPicker"
    position="bottom"
  >
    <van-picker
      ref="picker"
      show-toolbar
      :columns="columns"
      value-key="k"
      @cancel="showPicker = false"
      @confirm="onConfirm"
      @change="onChange"
    />
  </van-popup>
</template>

<script>
const c = (k,v) => ({ k,v })
const d = i => i === 1 ? '' : i
const day = '按天'
const week = '按周'
const month = '按月'
const dayC0 = c(day, 1)
const weekC0 = c(week, 2)
const monthC0 = c(month, 3)
const dayC1 = []
for (let i = 1; i <= 30; i++) {
  dayC1.push(c(`每${d(i)}天`,i))
}
const dayC2 = []
const weekC1 = []
const cn = ['','二','三','四','五','六','七','八','九','十','十一', '十二']
for (let i = 1; i <= 12; i++) {
  weekC1.push(c(`每${d(cn[i - 1 ])}周`,i))
}
const weekC2 = [];
['一','二','三','四','五','六','日'].forEach((v, i) => {
  weekC2.push(c(`周${v}`, i + 1))
})
const monthC1 = []
for (let i = 1; i <= 12; i++) {
  monthC1.push(c(`每${d(i)}月`,i))
}
const monthC2 = []
for (let i = 1; i <= 28; i++) {
  monthC2.push(c(`${i}日`,i))
}
const col0 =  [dayC0, weekC0, monthC0]
let col1
let col2
export default {
  props: {
    pickValue: {
      type: Array
    }
  },
  data() {
    return {
      showPicker: false,
      columns: [
        {
          values: col0
        },
        {
          values: dayC1
        },
        {
          values: dayC2
        }
      ]
    }
  },
  methods: {
    onOpen() {
      this.showPicker = true
      this.$nextTick(() => {
        const picker = this.$refs.picker
        picker.setColumnIndex(0, col0.findIndex(i => i.v === this.pickValue[0].v))
        this.onChange(picker, this.pickValue)
        picker.setColumnIndex(1, col1.findIndex(i => i.v === this.pickValue[1].v))
        picker.setColumnIndex(2, col2.findIndex(i => i.v === this.pickValue[2].v))
      })
    },
    setValue(a, b, c) {
      const resultArr = []
      switch (a) {
      case 1:
        resultArr.push(dayC0)
        resultArr.push(dayC1.find(i => i.v === b))
        break
      case 2:
        resultArr.push(weekC0)
        resultArr.push(weekC1.find(i => i.v === b))
        resultArr.push(weekC2.find(i => i.v === c))
        break
      case 3:
        resultArr.push(monthC0)
        resultArr.push(monthC1.find(i => i.v === b))
        resultArr.push(monthC2.find(i => i.v === c))
        break
      }
      this.onConfirm(resultArr)
    },
    onConfirm(value) {
      this.showPicker = false
      let display = ''
      switch(value[0].k) {
      case day:
        display = value[1].k
        break
      case week:
        display = `${value[1].k} ${value[2].k}`
        break
      case month:
        display = `${value[1].k} ${value[2].k}`
        break
      }
      const result = {
        value,
        display
      }
      this.$emit('change', result)
    },
    onChange(picker, value) {
      switch(value[0].k) {
      case day:
        col1 = dayC1
        col2 = dayC2
        break
      case week:
        col1 = weekC1
        col2 = weekC2
        break
      case month:
        col1 = monthC1
        col2 = monthC2
        break
      }
      picker.setColumnValues(1, col1)
      picker.setColumnValues(2, col2)
    }
  }
}
</script>

