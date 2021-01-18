<template>
  <div class="download container-white">
    <div class="comm-list">
      <!--<div
        class="comm-listitem"
        @click="setLocale('en-US')"
      >
        <div class="flex-left-right flex-1 comm-list-main">
          <span>English</span>
          <span
            v-if="locale=='en-US'"
            class="checkmark"
          />
        </div>
      </div>-->
      <div
        class="comm-listitem"
        @click="setLocale('zh-CN')"
      >
        <div class="flex-left-right flex-1 comm-list-main">
          <span>简体中文</span>
          <span
            v-if="locale!='zh-HK'"
            class="checkmark"
          />
        </div>
      </div>
      <div
        class="comm-listitem"
        @click="setLocale('zh-HK')"
      >
        <div class="flex-left-right flex-1 comm-list-main">
          <span>繁体中文</span>
          <span
            v-if="locale=='zh-HK'"
            class="checkmark"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DI } from "core"

const LOCALE = "LOCALE"

export default {
  computed: {
    locale() {
      return this.$i18n.locale
    }
  },
  mounted() {
    DI.get('utils').setTitle(this.$t('me.language'))
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      DI.get('offlineStorage').set(LOCALE, locale)
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.checkmark {
  background:url("../../assets/images/icon_checkmark.png")no-repeat  center;
  background-size:100%;
  width: 30px;
  height: 70px;
  line-height: 70px;
}
</style>
