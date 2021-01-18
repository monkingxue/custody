const zipFolder = require('zip-folder')
const path = require('path')
const util = require('util')
const fs = require('fs')
const dayjs = require('dayjs')
const md5File = require('md5-file')

const distPath = path.join(process.cwd(), 'dist')
const zipPath = path.join(process.cwd(), 'dist/pack.zip')
const jsonPath = path.join(process.cwd(), 'dist/version.json')
const zip = util.promisify(zipFolder)
const rename = util.promisify(fs.rename)
const md5 = util.promisify(md5File)
const cryptoMethod = 'md5'
async () => {}
const pack = async () => {
  try {
    console.log('==zip==') // eslint-disable-line no-console
    await zip(distPath, zipPath)
    console.log('==hash==') // eslint-disable-line no-console
    const hashString = await md5(zipPath)
    const zipHashName = `pack.${cryptoMethod}.${hashString}.zip`
    const zipHashPath = path.join(process.cwd(), 'dist', zipHashName)
    console.log('==name==') // eslint-disable-line no-console
    rename(zipPath, zipHashPath)
    const apiJson = {
      url: `https://abtc.one/${zipHashName}`,
      time: dayjs().valueOf(),
      md5: hashString
    }
    console.log('==api==') // eslint-disable-line no-console
    fs.writeFile(jsonPath, JSON.stringify(apiJson), 'utf8', (e) => {
      console.log(e, '==666==') // eslint-disable-line no-console
    })
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
    throw new Error()
  }
}

pack()

