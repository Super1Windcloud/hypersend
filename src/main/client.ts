import fastify, { type FastifyRequest, type FastifyInstance, type FastifyServerOptions } from 'fastify'
import path from 'path'
import { devLog } from '@/utils'
import ws, { type WebSocket } from '@fastify/websocket'
import fastifyStatic from '@fastify/static'
import { captureScreenMonitorToPNG, captureScreenWindowToBMP, checkAndKillPort } from './system'
import fastifyCors from '@fastify/cors'
import { base64ToBuffer, blobUrlToBuffer, getOcrEsearchResult, getOcrTesseractResult, getPaddleOcrResult } from './ocr';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { AliOcrClient } from './request'
import clipboardy from 'clipboardy';
import { dialog } from 'electron';
import { readFile } from 'fs/promises';
import { envPrint, FreeQwenServices, RandomLLMServices, ZhiPuServices } from '@/utils/api'
let app: FastifyInstance | null | undefined = null
let wsClients: Set<WebSocket> = new Set(); // 存储 WebSocket 客户端
async function createFastifyApp()
{
  app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()  // 注册 fastify-typebox 插件
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public/dist-vite'),
    prefix: '/'
  })

  app.register(require('@fastify/websocket'), {
    options: { maxPayload: 1048576 }
  })

  //代理API
  app.register(require('@fastify/http-proxy'), {
    upstream: 'http://localhost:33333',
    prefix: '/api', // optional
    http2: false, // optional
  });

  app.register(fastifyCors, {
    origin: '*', // 允许所有域名跨域访问
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
  })
  app.register(async function (fastify)
  {
    fastify.get('/ws', { websocket: true }, async (socket: WebSocket, req: FastifyRequest) =>
    {
      socket.on('message', (message) =>
      {
        // message.toString() === 'hi from client'
        socket.send('hi from server')
      })

      socket.on('close', () =>
      {
        wsClients.delete(socket); // 移除 WebSocket 客户端
        console.log('监听服务已断开 WebSocket')

      })

      console.log('监听服务已连接 WebSocket')
      wsClients.add(socket); // 存储 WebSocket 客户端
    })

  })
  app.post('/llm/qwen', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body  as { question: string }

    try
    {
      let result = await FreeQwenServices(question, (chunk: string) =>
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
  app.post('/llm/random', async (request, reply) =>
  {
    reply.raw.setHeader('Content-Type', 'text/plain; charset=utf-8'); // 设定文本流
    reply.raw.setHeader('Transfer-Encoding', 'chunked'); // 开启流式传输
    reply.raw.flushHeaders(); // 立即发送响应头
    const { question } = request.body as { question: string }

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

  app.get('/', async (request, reply) =>
  {
    try
    {
      await reply.sendFile('./vite.html')
    } catch (err)
    {
      reply.status(500).send('Internal Server Error')
    }
  })
  app.get('/json', async (request, reply) =>
  {
    await reply.send({ message: 'Hello, World!' })
  })



  app.post('/ocr/ali', async (request, reply) =>
  {
    try
    {
      let { url } = request.body as { url: string };
      let ocrStr = await AliOcrClient.run(url);
      await reply.send(ocrStr)
    } catch (err)
    {
      console.error(err)
      reply.status(500).send('ocr ali router Internal Server Error')
    }
  })

  app.post('/ocr/tesseract', async (request, reply) =>
  {
    try
    {
      let { url } = request.body as { url: string }
      let ocrStr = await getOcrTesseractResult(url)
      await reply.send(ocrStr)
    } catch (err)
    {
      console.error(err)
      reply.status(500).send('ocr  tesseract router Internal Server Error')
    }
  })

  app.post('/ocr/esearch', async (request, reply) =>
  {
    try
    {
      let { url } = request.body as { url: string }
      let ocrStr = await getOcrEsearchResult(url);
      await reply.send(ocrStr)
    } catch (err)
    {
      console.error(err)
      reply.status(500).send('ocr  esearchOcr   router Internal Server Error')
    }
  })
  app.post('/ocr/paddleOcr', async (request, reply) =>
  {
    try
    {
      let { url } = request.body as { url: string }
      // let buffer  :Buffer  =   base64ToBuffer(url);
      let buffer  :Buffer  =   await blobUrlToBuffer(url);
      let ocrStr = await getPaddleOcrResult(buffer );
      await reply.send(ocrStr)
    } catch (err)
    {
      console.error(err)
      reply.status(500).send('ocr  paddleOcr router Internal Server Error')
    }
  })

  app.get('/capture', async (request, reply) =>
  {
    try
    {
      const image = await captureScreenMonitorToPNG();
      if (!image)
      {
        console.error('No image captured')
        return
      }
      await reply.send(image)
    } catch (err)
    {
      console.error (err)
      reply.status(500).send('Internal Server Error')
    }
  })

  return app
}

export async function startClientServer()
{
  envPrint()
  app = app ?? (await createFastifyApp())
  await checkAndKillPort(33333)
  // 启动服务器并监听 33333 端口
  app.listen({ port: 33333, host: '0.0.0.0' }, (err, address) =>
  {
    if (err)
    {
      console.error('FUCK', err)
      process.exit(1)
    }
    devLog(`Client server is running on ${address}  :33333`)
  })
}

export function stopClientServer()
{
  if (!app) return
  app.close(() =>
  {
    devLog('Client Server is closed')
    app = null
  })
}

export function sendMessageToClient(message: string)
{

  if (!app || !wsClients.size) return
  const wsJson  = {
    type: 'text',
    data: message
  }
  wsClients.forEach((client) =>
  {
    client.send(  JSON.stringify(wsJson)  )
  })
}
export  async function sendBlobToClient(base64: Base64URLString, filePath?: string)
{
  if (!app || !wsClients.size) return;
  let name = filePath?.match(/[^/\\]+$/)?.[0] ?? 'unknown';
  devLog(name);
  const wsJson = {
    type: 'base64',
    data: base64,
   fileName :name
  }
  wsClients.forEach((client) =>
  {
    client.send( JSON.stringify(wsJson)  )
  });
}

export async function sendFileToClient()
{
  // 从环境变量中获取用户主目录路径
  const defaultDir = process.env.USERPROFILE;
  // 如果没有获取到用户主目录路径，则直接返回
  if (!defaultDir) return
  // 使用 try-catch 块来处理可能出现的异常
  try
  {
    // 使用 dialog.showOpenDialog 显示文件选择对话框，并等待用户选择文件
    let result = await dialog.showOpenDialog({
      properties: ['openFile'], // 只允许选择文件
      filters: [
        { name: '所有文件', extensions: ['*'] }, // 允许所有类型的文件
      ],
      defaultPath: defaultDir, // 默认打开用户主目录
    })

    if (!result.canceled && result.filePaths.length > 0)
    {
      const selectedFilePath = result.filePaths[0];
  devLog('用户选择的文件路径:', selectedFilePath);
      if (!selectedFilePath) return null;
      await   sendFileBlobToClient(selectedFilePath);
    }
    return null;
  }
  catch (err)
  {
    console.error('选择文件时出错:', err);
    return null;
  }
}

export function sendFolderToClient()
{
  const folderPath = process.env.USERPROFILE;
  if (!folderPath)
  {
    console.error('无法获取用户主目录');
    return;
  }
  dialog
    .showOpenDialog({
      properties: ['openDirectory'], // 只允许选择文件夹
    })
    .then((result) =>
    {
      if (!result.canceled && result.filePaths.length > 0)
      {
        const selectedFolderPath = result.filePaths[0];
         devLog('用户选择的目录路径:', selectedFolderPath);

      }
    })
    .catch((err) =>
    {
      console.error('选择文件夹时出错:', err);
    });
}


export function sendClipboardToClient()
{
  clipboardy.read().then(text =>
  {
   devLog(text);
    sendMessageToClient(text);
  }).catch(err =>
  {
    console.error(err);
  });

}


export async function sendFileBlobToClient(filePath: string)
{
  try
  {
    const fileBuffer  :Buffer = await readFile(filePath);


     const base64 = fileBuffer.toString('base64');
     await sendBlobToClient(base64, filePath );

    devLog('文件已成功发送到前端');
  } catch (error)
  {
    console.error('读取文件失败:', error);
  }
}
