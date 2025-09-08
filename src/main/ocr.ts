import { readFileSync } from 'fs'
import path from 'path'
// @ts-ignore
import Ocr from '@gutenye/ocr-node'
import { devLog, writeLog } from '@/utils'
type loadImgType = string | CanvasImageData | Buffer

async function imagePathToloadImgType(imageSource: string): Promise<loadImgType> {
  try {
    let buffer: Buffer
    if (imageSource.startsWith('data:')) {
      // 处理 Base64 数据
      const base64Data = imageSource.split(',')[1]
      buffer = Buffer.from(base64Data, 'base64')
    } else if (imageSource.startsWith('blob:')) {
      // 处理 blobUrl
      const response = await fetch(imageSource)
      const blob = await response.blob()
      buffer = Buffer.from(await blob.arrayBuffer())
    } else {
      buffer = readFileSync(imageSource)
    }

    return buffer
  } catch (error: any) {
    throw new Error(`Failed to convert image source to canvas: ${error.message}`)
  }
}

type PaddleOcrResultType = {
  mean: number
  text: string
  box: any
}

export async function getPaddleOcrResult(img?: loadImgType): Promise<string | void> {
  let det: string
  let rec: string
  let key: string

  if (process.env.NODE_ENV === 'development') {
    // 开发模式，模型直接放在项目根目录下的 esearch 目录
    det = path.join(process.cwd(), 'esearch', 'ppocr_det.onnx')
    rec = path.join(process.cwd(), 'esearch', 'ppocr_rec.onnx')
    key = path.join(process.cwd(), 'esearch', 'ppocr_keys_v1.txt')
  } else {
    // 生产环境，模型在 app.asar.unpacked 下
    det = path.join(process.cwd(), 'resources', 'app.asar.unpacked', 'esearch', 'ppocr_det.onnx')
    rec = path.join(process.cwd(), 'resources', 'app.asar.unpacked', 'esearch', 'ppocr_rec.onnx')
    key = path.join(process.cwd(), 'resources', 'app.asar.unpacked', 'esearch', 'ppocr_keys_v1.txt')
  }

  let ocr
  writeLog(`模型路径:\n${det}\n${rec}\n${key}\n`)

  try {
    ocr = await Ocr.create({
      models: {
        detectionPath: det,
        recognitionPath: rec,
        dictionaryPath: key
      },
      isDebug: false,
      debugOutputDir: './outputLog'
    })
  } catch (error) {
    console.error('Error in getPaddleOcrResult:', error)
    throw new Error(`模型加载失败：${error}\n模型路径: ${det}`)
  }

  const result: PaddleOcrResultType[] = await ocr.detect(img)
  const text = result.map(({ text }: PaddleOcrResultType) => text).join('\n')

  devLog(text)
  return text
}
export async function blobUrlToBuffer(blobUrl: string): Promise<Buffer> {
  const response = await fetch(blobUrl)
  const blob = await response.blob()
  return Buffer.from(await blob.arrayBuffer())
}
export function base64ToBuffer(base64: string): Buffer {
  // 检查输入字符串是否只包含 Base64 字符
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) {
    throw new Error('Invalid Base64 string')
  }

  // 检查输入字符串长度是否是 4 的倍数
  if (base64.length % 4 !== 0) {
    throw new Error('Invalid Base64 string length')
  }

  return Buffer.from(base64, 'base64')
}
