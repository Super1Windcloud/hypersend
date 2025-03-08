import fastify, { type FastifyRequest, type FastifyInstance, type FastifyServerOptions } from 'fastify'
import path from 'path'
import { devLog } from '@/utils'
import ws , {type WebSocket} from '@fastify/websocket'
import fastifyStatic from '@fastify/static'
import { captureScreenMonitorToPNG, checkAndKillPort } from './system'
import fastifyCors from '@fastify/cors'
import { getOcrTesseractResult } from './ocr'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { AliOcrClient } from './request'



let activeSockets: WebSocket[] = []
let app: FastifyInstance | null | undefined = null
let wsClients = new Set(); // 存储 WebSocket 客户端

async function createFastifyApp()
{
  app = fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>()  // 注册 fastify-typebox 插件
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), 'public/dist'),
    prefix: '/'
  })

  app.register(require('@fastify/websocket'), {
    options: { maxPayload: 1048576 }
  })

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

  app.get('/', async (request, reply) =>
  {
    try
    {
      await reply.sendFile('./index.html')
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
      console.log(err)
      reply.status(500).send('ocr ali router Internal Server Error')
    }
  })
  app.post('/ocr/tesseract',  async (request, reply) =>
  {
    try
    {
      let { url } = request.body as { url: string }
      let ocrStr = await getOcrTesseractResult(url)
      await reply.send(ocrStr)
    } catch (err)
    {
      console.log(err)
      reply.status(500).send('ocr router Internal Server Error')
    }
  })
  app.get('/capture', async (request, reply) =>
  {
    try
    {
      const image = captureScreenMonitorToPNG()
      if (!image)
      {
        console.error('No image captured')
        return
      }
      await reply.send(image)
    } catch (err)
    {
      console.log(err)
      reply.status(500).send('Internal Server Error')
    }
  })

  return app
}

export async function startClientServer()
{
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
    console.log(`Client server is running on ${address}  :33333`)
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
  if (!app) return
  // 遍历所有活跃的 WebSocket 连接，发送消息
  activeSockets.forEach((socket) =>
  {
    socket.send(message)
  })
}
