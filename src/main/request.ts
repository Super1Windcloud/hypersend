

import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707'
import OpenApi, * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'
import dotenv from 'dotenv'

dotenv.config()

export class AliOcrClient {


  static  createClient(): ocr_api20210707
  {
       let id = process.env['ALIBABA_CLOUD_ACCESS_KEY_ID']
      let secret = process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET']

    let config = new $OpenApi.Config({
      accessKeyId:  id   ,
      accessKeySecret:  secret   ,
      endpoint: `ocr-api.cn-hangzhou.aliyuncs.com`
    })
    return new ocr_api20210707(config)
  }

  static  async run(url ?: string , blob ?: any): Promise<string> {
    let client = AliOcrClient.createClient()
    let recognizeDocumentStructureRequest = new $ocr_api20210707.RecognizeDocumentStructureRequest({
      noStamp: false,
      url,
      blob ,
      paragraph: true,
      useNewStyleOutput: true,
      page: false
    })
    let runtime = new $Util.RuntimeOptions({})
    try {
      let response = await client.recognizeDocumentStructureWithOptions(
        recognizeDocumentStructureRequest,
        runtime
      )
      let data = response.body?.data
      return data ?? ''
    } catch (error: any) {
      console.log(error.message)
      console.log(error.data['Recommend'])
      return error.message
    }
  }
}







