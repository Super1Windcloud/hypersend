

import { writeLog } from '@/utils';
import ocr_api20210707, * as $ocr_api20210707 from '@alicloud/ocr-api20210707'
import OpenApi, * as $OpenApi from '@alicloud/openapi-client'
import Util, * as $Util from '@alicloud/tea-util'
import dotenv from 'dotenv'
import { type FastifyInstance }  from 'fastify';
import { aliQwen2_5, aliQwenMax, aliQwenPlus, aliQwenQwQ32B, DeepSeekApiServices, DoubaoLiteServices, DoubaoServicesDeepSeek, DoubaoServicesPro, envPrint,KimiServices, RandomLLMServices, SiliconflowServices, ZhiPuServices } from '@/utils/api'



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









export function createAppLLMServices( app :  FastifyInstance)
{
  app.post('/llm/qwen_plus', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await aliQwenPlus(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/qwen2_5', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await aliQwen2_5(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/qwen_max', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await aliQwenMax(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/qwen_qwq32b', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await aliQwenQwQ32B(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/siliconflow_qwen', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await SiliconflowServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/deepseek', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await DeepSeekApiServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/kimi', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await   KimiServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/doubao_lite', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await   DoubaoLiteServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/doubao_pro', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await DoubaoServicesPro(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })
  app.post('/llm/doubao_deepseek', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      writeLog("请求LLM接口");
      let result = await DoubaoServicesDeepSeek (question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      writeLog("请求LLM接口失败 :" + error)
      reply.status(500).send('Internal Server Error\n' + error)
    }
  })


  app.post('/llm/random', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      let result = await RandomLLMServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })

      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      reply.status(500).send('Internal Server Error')
    }
  })

  app.post('/llm/codegeex', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }
    writeLog('question: ' + question)
    try
    {
      let result = await ZhiPuServices(question, (chunk: string) =>
      {
        reply.raw.write(chunk); // 是用于将数据块逐步写入服务器响应流的方法
        process.stdout.write(chunk);
      })
      //  console.log(result);
      reply.raw.end();
    } catch (error)
    {
      console.error('Error:', error);
      reply.raw.write('Error: Something went wrong\n');
      reply.raw.end();
      reply.status(500).send('Internal Server Error')
    }
  })

}
