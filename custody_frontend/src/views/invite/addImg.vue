<script>
import { Poster } from '@kpi/poster'

// const imageTextInvite = '邀请您体验aBTC.one'
// const imageTextInviteTitle = '邀请码'

export default {
  methods: {
    generageShareImg() {
      this.generageShareImg1()
      this.generageShareImg1_1()
      this.generageShareImg1_0()
      this.generageShareImg2()
      this.generageShareImg3()
    },
    generageShareImg1() {
      new Poster().loadImg(
        ['static/invite-bg-01.png',
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 67,
              y: 1151,
              width: 160,
              height: 160
            })
            .addText({
              font: '28px Arial, Helvetica',
              text: this.inviteCode,
              color: '#9D83FF',
              textAlign: 'right',
              x: 710,
              y: 1355
            })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInviteTitle,
            //   color: '#d4d4d4',
            //   x: 560,
            //   y: 1355
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: this.imageTextMobile,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1250
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInvite,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1290
            // })
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    },
    generageShareImg1_0() {
      new Poster().loadImg(
        ['static/invite-bg-05.png',
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 67,
              y: 1151,
              width: 160,
              height: 160
            })
            .addText({
              font: '28px Arial, Helvetica',
              text: this.inviteCode,
              color: '#9D83FF',
              textAlign: 'right',
              x: 710,
              y: 1355
            })
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    },
    generageShareImg1_1() {
      new Poster().loadImg(
        ['static/invite-bg-04.png',
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 67,
              y: 1151,
              width: 160,
              height: 160
            })
            .addText({
              font: '28px Arial, Helvetica',
              text: this.inviteCode,
              color: '#9D83FF',
              textAlign: 'right',
              x: 710,
              y: 1355
            })
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    },
    generageShareImg2() {
      new Poster().loadImg(
        ['static/invite-bg-02.png',
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 67,
              y: 1151,
              width: 160,
              height: 160
            })
            .addText({
              font: '28px Arial, Helvetica',
              text: this.inviteCode,
              color: '#E6CCB2',
              textAlign: 'right',
              x: 710,
              y: 1355
            })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInviteTitle,
            //   color: '#d4d4d4',
            //   x: 560,
            //   y: 1355
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: this.imageTextMobile,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1250
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInvite,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1290
            // })
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    },
    generageShareImg3() {
      new Poster().loadImg(
        ['static/invite-bg-03.png',
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 67,
              y: 1151,
              width: 160,
              height: 160
            })
            .addText({
              font: '28px Arial, Helvetica',
              text: this.inviteCode,
              color: '#FFD255',
              textAlign: 'right',
              x: 710,
              y: 1355
            })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInviteTitle,
            //   color: '#d4d4d4',
            //   x: 560,
            //   y: 1355
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: this.imageTextMobile,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1250
            // })
            // .addText({
            //   font: '28px Arial, Helvetica',
            //   text: imageTextInvite,
            //   color: '#FFF',
            //   textAlign: 'right',
            //   x: 710,
            //   y: 1290
            // })
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    }
    // generageShareImg2() {
    //   new Poster().loadImg(
    //     ['static/invite-bg-man.png',
    //       this.qrcodestr
    //     ]
    //   )
    //     .then((instance) => {
    //       instance
    //         .init(0)
    //         .addImg({
    //           index: 1,
    //           x: 653,
    //           y: 1467,
    //           width: 135,
    //           height: 135
    //         })
    //         .addText({
    //           font: 'bold 158px Arial, Helvetica',
    //           text: this.inviteCode,
    //           color: '#FFD7AB',
    //           x: 443,
    //           y: 360
    //         })
    //         .addText({
    //           font: '38px Arial, Helvetica',
    //           text: this.imageTextMobile,
    //           color: '#FFF',
    //           x: 443,
    //           y: 540
    //         })
    //         .addText({
    //           font: '38px Arial, Helvetica',
    //           text: imageTextInvite,
    //           color: '#FFF',
    //           x: 443,
    //           y: 600
    //         })
    //       this.updateImgArr(instance.canvas.toDataURL('image/png'))
    //     })
    // },
    // generageShareImg3() {
    //   new Poster().loadImg(
    //     ['static/invite-bg-green.png',
    //       this.qrcodestr
    //     ]
    //   )
    //     .then((instance) => {
    //       instance
    //         .init(0)
    //         .addImg({
    //           index: 1,
    //           x: 435,
    //           y: 977,
    //           width: 90,
    //           height: 90
    //         })
    //         .addText({
    //           font: 'bold 108px Arial, Helvetica',
    //           text: this.inviteCode,
    //           color: '#FFD044',
    //           x: 295,
    //           y: 365
    //         })
    //         .addText({
    //           font: '28px Arial, Helvetica',
    //           text: this.imageTextMobile,
    //           color: '#88C6C0',
    //           x: 295,
    //           y: 485
    //         })
    //         .addText({
    //           font: '28px Arial, Helvetica',
    //           text: imageTextInvite,
    //           color: '#88C6C0',
    //           x: 295,
    //           y: 520
    //         })
    //       this.updateImgArr(instance.canvas.toDataURL('image/png'))
    //     })
    // },
    // generageShareImg1() {
    //   new Poster().loadImg(
    //     ['static/invite-bg-gray.png',
    //       this.qrcodestr
    //     ]
    //   )
    //     .then((instance) => {
    //       instance
    //         .init(0)
    //         .addImg({
    //           index: 1,
    //           x: 435,
    //           y: 977,
    //           width: 90,
    //           height: 90
    //         })
    //         .addText({
    //           font: 'bold 108px Arial, Helvetica',
    //           text: this.inviteCode,
    //           color: '#C79A69',
    //           x: 295,
    //           y: 365
    //         })
    //         .addText({
    //           font: '28px Arial, Helvetica',
    //           text: this.imageTextMobile,
    //           color: '#666',
    //           x: 295,
    //           y: 495
    //         })
    //         .addText({
    //           font: '28px Arial, Helvetica',
    //           text: imageTextInvite,
    //           color: '#666',
    //           x: 295,
    //           y: 540
    //         })
    //       this.updateImgArr(instance.canvas.toDataURL('image/png'))
    //     })
    // }
  }
}
</script>
