import { createWorker } from 'tesseract.js'

export  async function getOcrTesseractResult(image: string): Promise<string> {
  const worker = await createWorker(['eng', 'chi_sim'], 1, {
    logger: (m) => console.log(m) // Add logger here
  })
  const ret = await worker.recognize(image)
  console.log(ret.data.text)
  await worker.terminate()

  return ret.data.text
}
  
// 




