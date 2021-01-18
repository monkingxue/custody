<script>
import { DI } from "core"

const NAVIGATOR_MY_TIPS = "NAVIGATOR_MY_TIPS"
const ACCOUNT_MY_TIPS = "ACCOUNT_MY_TIPS"
const INVITE_LIST_CLICK = "INVITE_LIST_CLICK"
const REBATE_LIST_CLICK = "REBATE_LIST_CLICK"

export default {
  computed: {
    inviteData() {
      return DI.get("store").state.invite.invite
    },
    hasInviteData() {
      return this.inviteData.items ? true : false
    },
    inviteTotal() {
      return this.inviteData["total_length"]
    },
    isInviteTips() {
      return this.inviteData["tips"]
    },
    rebateData() {
      return DI.get("store").state.invite.rebate
    },
    hasRebateData() {
      return this.rebateData.items ? true : false
    },
    rebateTotal() {
      return this.rebateData["total_length"]
    },
    isRebateTips() {
      return this.rebateData["tips"]
    },

    isMyRedDot() {
      // is navigator my red dot
      return this.hasInviteData && this.hasRebateData
        ? (this.isInviteTips || this.isRebateTips) &&
            this.activeTab !== 3 &&
            DI.get("offlineStorage").get(NAVIGATOR_MY_TIPS) !==
              `${this.inviteTotal} ${this.rebateTotal}`
        : false
    },
    isAccountRedDot() {
      return (this.isInviteTips || this.isRebateTips) &&
        DI.get("offlineStorage").get(ACCOUNT_MY_TIPS) !==
          `${this.inviteTotal} ${this.rebateTotal}`
        ? true
        : false
    }
  },
  methods: {
    setMyTipsLocal() {
      // navigator red dot
      if (
        this.$route.name === "account" &&
        this.hasInviteData &&
        this.hasRebateData
      ) {
        DI.get("offlineStorage").set(
          NAVIGATOR_MY_TIPS,
          `${this.inviteTotal} ${this.rebateTotal}`
        )
      }
    },
    setAccountTipsLocal() {
      // account red dot
      DI.get("offlineStorage").set(
        ACCOUNT_MY_TIPS,
        `${this.inviteTotal} ${this.rebateTotal}`
      )
    },
    setInviteTabClick() {
      // myinvite invite tab
      DI.get("offlineStorage").set(INVITE_LIST_CLICK, this.inviteTotal)
    },
    isInviteTabRedDot() {
      return (
        this.isInviteTips &&
        +DI.get("offlineStorage").get(INVITE_LIST_CLICK) !== +this.inviteTotal
      )
    },
    setRebateTabClick() {
      // myinvite rebate tab
      DI.get("offlineStorage").set(REBATE_LIST_CLICK, this.rebateTotal)
    },
    isRebateTabRedDot() {
      return (
        this.isRebateTips &&
        +DI.get("offlineStorage").get(REBATE_LIST_CLICK) !== +this.rebateTotal
      )
    }
  }
}
</script>