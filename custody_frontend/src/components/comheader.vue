<template>
  <section>
    <div class="back-bar special">
      <span class="back">
        <a
          class="top__back"
          href="javascript:"
          onclick="history.back();"
        />
      </span>
      <h2>{{ $t(data) }}</h2>
      <div
        v-if="edit"
        class="edit"
        @click="editClick"
      >
        {{ $t(edit) }}
      </div>
    </div>
  </section>
</template>
<style>
</style>
<script >

export default {
  components: {},
  props: {
    data: String,
    edit: String
  },
  computed: {},
  mounted() {

  },
  methods: {
    editClick(){
      this.$emit('edit-click')
    }
  }
}
</script>
<style>
  .back-bar {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        height: 44px;
        overflow: hidden;
        color: #fff;
        background-color: #04d2b1;
        z-index: 999;
    }

    .back-bar .back {
        position: absolute;
        top: -2px;
        left: 0px;
        text-align: center;
    }

    .back-bar .back .icon {
        width: 24px;
        height: 24px;
    }

    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

    .back-bar h2 {
        width: 70%;
        margin: 0 auto;
        line-height: 44px;
        text-align: center;
        font-size:16px;
        letter-spacing: 1px;font-weight: normal;

    }

    .top__back {
        float: left;
        width: 42px;
        height: 44px;
    }

    .top__back:before {
        content: '';
        display: block;
        margin: 15px 0 0 16px;
        width: 10px;
        height: 16px;
        background: url(../assets/images/back.png) no-repeat;
        background-size: 10px 16px;
    }
    .edit{
        position: absolute;
        top: 13px;
        right: 13px;
        text-align: center;
        color:#fff;
        font-size:14px;
    }
</style>
