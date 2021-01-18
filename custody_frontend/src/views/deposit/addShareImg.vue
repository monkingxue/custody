<script>
import { Poster } from "@kpi/poster"

export default {
  methods: {
    generageShareImg(avatarImg) {
      const shareImgParam = {
        qrcode: {
          index: 1,
          x: 176,
          y: 364,
          width: 400,
          height: 400
        },
        avatar: {
          index: 2,
          x: 306,
          y: 162,
          width: 140,
          height: 140
        },
        avatarMask: {
          index: 3,
          x: 304,
          y: 160,
          width: 144,
          height: 144
        },
        addressTitle: {
          font: "24px PingFang-SC",
          text: `${this.displayTarget} 地址`,
          color: "#7D7D7D",
          textAlign: "center",
          x: 375,
          y: 824
        },
        address: {
          font: "32px Arial, Helvetica",
          text: this.info.address,
          color: "#000",
          textAlign: "center",
          x: 375,
          y: 866
        },
        addressPart1: {
          font: "32px Arial, Helvetica",
          text: this.info.address.slice(0, 26),
          color: "#000",
          textAlign: "center",
          x: 375,
          y: 866
        },
        addressPart2: {
          font: "32px Arial, Helvetica",
          text: this.info.address.slice(26),
          color: "#000",
          textAlign: "center",
          x: 375,
          y: 910
        },
        addressTagTitle: {
          font: "24px PingFang-SC",
          text: `${this.displayTarget} 标签`,
          color: "#7D7D7D",
          textAlign: "center",
          x: 375,
          y: 930
        },
        addressTag: {
          font: "32px Arial, Helvetica",
          text: this.info.addressTag,
          color: "#000",
          textAlign: "center",
          x: 375,
          y: 972
        }
      }

      const shareImgArr = ["static/deposit-share-bg.png", this.qrCode]
      if (avatarImg) {
        shareImgArr.push(avatarImg, "static/deposit-share-avatar-mask.png")
      }

      const instFun = [
        inst => inst.init(0),
        inst => inst.addImg(shareImgParam.qrcode),
        inst => inst.addText(shareImgParam.addressTitle)
      ]

      if (avatarImg) {
        instFun.push(
          inst => inst.addImg(shareImgParam.avatar),
          inst => inst.addImg(shareImgParam.avatarMask)
        )
      }
      if (this.info.addressTag) {
        instFun.push(
          inst => inst.addText(shareImgParam.address),
          inst => inst.addText(shareImgParam.addressTagTitle),
          inst => inst.addText(shareImgParam.addressTag)
        )
      } else if (this.info.address.length > 26) {
        instFun.push(
          inst => inst.addText(shareImgParam.addressPart1),
          inst => inst.addText(shareImgParam.addressPart2)
        )
      } else {
        instFun.push(inst => inst.addText(shareImgParam.address))
      }

      new Poster().loadImg(shareImgArr).then(instance => {
        instFun.forEach(func => {
          func(instance)
        })

        this.shareImg = instance.canvas.toDataURL("image/png")
      })
    }
  }
}
</script>
