import { devLog  } from '@/utils'
 import  fs from 'fs'
 import { Monitor ,Window  }   from  'node-screenshots';
export async function checkPort(port) {
  const net = require('net')

  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true) // 端口被占用
      } else {
        reject(err)
      }
    })
    server.once('listening', () => {
      server.close()
      resolve(false) // 端口未被占用
    })
    server.listen(port)
  })
}

export async function killProcessByPort(port) {
  const { exec } = require('child_process')
  return new Promise<void>((resolve, reject) => {
    exec(`lsof -i :${port}`, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      const lines = stdout.split('\n')
      if (lines.length > 1) {
        const pid = lines[1].split(/\s+/)[1]
        exec(`kill -9 ${pid}`, (err, stdout, stderr) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        reject(new Error('No process found using the port'))
      }
    })
  })
}

export async function checkAndKillPort(port) {
  try {
    const isPortInUse = await checkPort(port)
    if (isPortInUse) {
      devLog(`Port ${port} is in use. Attempting to kill the process...`)
      await killProcessByPort(port)
      devLog(`Process using port ${port} has been killed.`)
    } else {
      devLog(`Port ${port} is not in use.`)
    }
  } catch (err) {
    console.error('Error: fuck ', err)
  }
}


export   function captureScreenMonitorToPNG ()
{
  let monitor = Monitor.fromPoint(100, 100)
  devLog(monitor, monitor?.id)
  let image   = monitor?.captureImageSync()
  if (!image) { console.error('No image captured'); return }
  let dir  = `img`;
  if (!fs.existsSync(dir)){  fs.mkdirSync(dir, { recursive: true });}

  fs.writeFileSync(`img/${monitor?.id}-sync.png`, image.toPngSync())

  let monitors = Monitor.all()

  monitors.forEach((capturer) => {
    devLog({
      id: capturer.id,
      x: capturer.x,
      y: capturer.y,
      width: capturer.width,
      height: capturer.height,
      rotation: capturer.rotation,
      scaleFactor: capturer.scaleFactor,
      isPrimary: capturer.isPrimary
    })
  })
  return  image.toPngSync()
}

export async function captureScreenWindowToBMP()
{
  let monitor = Monitor.fromPoint(100, 100)
 devLog(monitor, monitor?.id)
  let image = monitor?.captureImageSync()
  if (!image) { console.error('No image captured'); return }
  fs.writeFileSync(`img/${monitor?.id}-sync.bmp`, image.toBmpSync())

  let monitors = Monitor.all()

  monitors.forEach((capturer) =>
  {
  devLog({
      id: capturer.id,
      x: capturer.x,
      y: capturer.y,
      width: capturer.width,
      height: capturer.height,
      rotation: capturer.rotation,
      scaleFactor: capturer.scaleFactor,
      isPrimary: capturer.isPrimary
    })
  })
  return image?.toBmpSync()
}






export   function captureScreenMonitorToJpeg ()
{
  //  获取屏幕画面 通过Node


  let monitor = Monitor.fromPoint(100, 100)

  devLog(monitor, monitor?.id)

  let image = monitor?.captureImageSync()


  monitor?.captureImage().then((data) => {
   devLog(data)
    if (!data) { console.error('No image captured'); return }
    fs.writeFileSync(`img/${monitor?.id}.jpeg`, data.toJpegSync())
  })

  let monitors = Monitor.all()

  monitors.forEach((capturer) => {
    devLog({
      id: capturer.id,
      x: capturer.x,
      y: capturer.y,
      width: capturer.width,
      height: capturer.height,
      rotation: capturer.rotation,
      scaleFactor: capturer.scaleFactor,
      isPrimary: capturer.isPrimary
    })
  })
  return  image?.toJpegSync()
}



