<script>
import { Poster } from '@kpi/poster'

const posterType = {
  roman: '01',
  birth: '02',
  facai: '03',
  zhongqiu: '04'
}

export default {
  methods: {
    generageShareImg() {
      const { description } = this.redInfo
      const { redTarget, isDefaultText } = this.redInfo.extra
      const posterName = posterType[redTarget]
      const posterTextName = isDefaultText ? 'A' : 'B'
      const posterPath = `static/red-bg-${posterName}${posterTextName}.png`
      this.generageShareImgAction(posterPath, isDefaultText, description)
    },
    generageShareImgAction(posterPath, isDefaultText, description) {
      new Poster().loadImg(
        [posterPath,
          this.qrcodestr
        ]
      )
        .then((instance) => {
          instance
            .init(0)
            .addImg({
              index: 1,
              x: 324,
              y: 1235,
              width: 105,
              height: 105
            })
          if (!isDefaultText) {
            const len = description.length
            for (let i = 0; i < len; i += 12) {
              const text = description.slice(i, i + 12)
              instance
                .addText({
                  font: 'bold 56px Arial, Helvetica',
                  text: text,
                  color: '#FFF',
                  textAlign: 'center',
                  x: 375,
                  y: 245 + (i / 12) * 75
                })
            }
          }
          this.updateImgArr(instance.canvas.toDataURL('image/png'))
        })
    }
  }
}
</script>
