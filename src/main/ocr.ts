import { createWorker } from 'tesseract.js'
import { readFileSync } from 'fs';
import { join } from 'path';
import * as ocr from "esearch-ocr";
import * as ort from "onnxruntime-node";
import { createCanvas, loadImage, createImageData, ImageData as CanvasImageData } from "canvas"
// @ts-ignore
import Ocr from '@gutenye/ocr-node'

type loadImgType = string | CanvasImageData | Buffer ;


export  async function getOcrTesseractResult(image: string): Promise<string> {
  const worker = await createWorker(['eng', 'chi_sim'], 1, {
    logger: (m) => console.log(m) // Add logger here
  })
  const ret = await worker.recognize(image)
  console.log(ret.data.text)
  await worker.terminate()

  return ret.data.text
}


async function blobUrlToCanvas(blobUrl: string): Promise<HTMLCanvasElement | void >
{

}
async function imagePathToloadImgType(imageSource: string): Promise<loadImgType>
{
  try
  {
    let buffer: Buffer;
    if (imageSource.startsWith('data:'))
    {
      // 处理 Base64 数据
      const base64Data = imageSource.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else if (imageSource.startsWith('blob:'))
    {
      // 处理 blobUrl
      const response = await fetch(imageSource);
      const blob = await response.blob();
      buffer = Buffer.from(await blob.arrayBuffer());
    } else
    {
      buffer = readFileSync(imageSource);
    }

    return buffer;
  } catch (error :any )
  {
    throw new Error(`Failed to convert image source to canvas: ${error.message}`);
  }
}

export async function getOcrEsearchResult(imgCanvas  : loadImgType) : Promise<string | void>
{
  try
  {
    let det = process.cwd() + "\\esearch\\ppocr_det.onnx";
    let rec = process.cwd() + "\\esearch\\ppocr_rec.onnx";
    console.log(det, rec);
    let ppocr_keys_path = join(process.cwd(), "esearch/ppocr_keys_v1.txt");
    let ppocr_keys = readFileSync(ppocr_keys_path, "utf-8");
     let  ocrObj =   await ocr.init({
       detPath: det,
       recPath: rec,
       dic: ppocr_keys,
       detRatio: 0.75,
       ort,
       canvas: (w, h) => createCanvas(w, h),
       imageData: createImageData
    });
     ocrObj .ocr( imgCanvas )
      .then((result) =>
      {
        console.log(result.src);
        const tl = result .parragraphs.map((i) => i.text);
        console.log(tl.join("\n"));
    })
      .catch((e) => { console.error(e) } );

  } catch (error)
  {
    console.error('Error in getOcrEsearchResult:', error);
    throw error; // 重新抛出错误，以便调用者处理
  }
}



function testEsearch()
{
  ; (async () =>
  {
    try
    {
      let path = process.cwd() + "\\img\\65537-sync.png";
      let canvas = await imagePathToloadImgType(path);
      await getOcrEsearchResult(canvas);
    } catch (error)
    {
      console.error('Error in main async function:', error);
    }
  })();

}

type PaddleOcrResultType = {
  mean : number;
  text: string;
  box:  any
}

export async function getPaddleOcrResult(img ? : loadImgType): Promise<string | void>
{
  /**
   * defaultDetectionPath   ch_PP-OCRv4_det_infer.onnx',
   * defaultRecognitionPath:   ch_PP-OCRv4_rec_infer.onnx',
   *  dictionaryPath  :  'ppocr_keys_v1.txt',
   */
  let det = process.cwd() + "\\esearch\\ppocr_det.onnx";
  let rec = process.cwd() + "\\esearch\\ppocr_rec.onnx";
  let  key = process.cwd() + "\\esearch\\ppocr_keys_v1.txt";
  const ocr = await Ocr.create({
    isDebug: false ,
    debugOutputDir: './outputLog',
    defaultDetectionPath: det,
    defaultRecognitionPath: rec,
    dictionaryPath: key,
  })
  const result : PaddleOcrResultType[]  = await ocr.detect(img)

  let text = result.map(({ text }: PaddleOcrResultType) => text).join("\n")
  console.log(text);
  return text;
}
export  async function blobUrlToBuffer(blobUrl: string): Promise<Buffer>
{
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return Buffer.from(await blob.arrayBuffer());
}
export function base64ToBuffer( base64: string ): Buffer
{
  // 检查输入字符串是否只包含 Base64 字符
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64))
  {
    throw new Error('Invalid Base64 string');
  }

  // 检查输入字符串长度是否是 4 的倍数
  if (base64.length % 4 !== 0)
  {
    throw new Error('Invalid Base64 string length');
  }

  return Buffer.from(base64, 'base64');
}

async function testPaddleOcr()
{
  let path = process.cwd() + "\\img\\leecode.png";

  let  toBlobUrl = ((buffer: Buffer) =>
  {
    const blob = new Blob([buffer], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }) as (buffer: Buffer) => string;

  let buffer = await imagePathToloadImgType(path) as Buffer;

  let url = toBlobUrl(buffer);
  getPaddleOcrResult(await blobUrlToBuffer(url) );

}



