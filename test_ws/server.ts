const fastify = require('fastify')({ logger: true })
const fastifyWebSocket = require('@fastify/websocket')

fastify.register(fastifyWebSocket);

// 必须要在 register 里面定义路由否则会报错
fastify.register(async function (fastify)
{
  fastify.get('/ws', { websocket: true }, (socket /* WebSocket */, req /* FastifyRequest */) =>
  {
    socket.on('message', message =>
    {
      // message.toString() === 'hi from client'
      socket.send('hi from server')
    })

    socket.on('close', () =>
    {
      fastify.log.info('Client disconnected')
    })

    // 发送欢迎消息
    if (socket.readyState === socket.OPEN)
    {
      socket.send('Welcome to WebSocket server!')
    }
  })
})



// 启动服务器
fastify.listen({ port: 33333, host: '0.0.0.0' }, (err, address) =>
{
  if (err)
  {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server listening on ${address}`)
})
