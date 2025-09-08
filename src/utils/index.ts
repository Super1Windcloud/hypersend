import os from 'os'
import fs from 'fs'

export function exist(path: string) {
  if (fs.existsSync(path)) return path
  else return null
}

export function devAlert(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    alert(...args)
  }
}

export function devAssert(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.assert(...args)
  }
}

export function devLog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEV]', ...args)
  }
}

export function getLocalWlanIPAddress(): string | string[] {
  const interfaces = os.networkInterfaces()
  const address: string[] = []

  // 常见的无线网卡标识
  const wifiKeywords = ['WLAN', 'Wi-Fi', 'en0', 'wlan', 'wlp']

  for (const name of Object.keys(interfaces)) {
    // 判断网卡名是否符合无线网卡的常见标识
    if (wifiKeywords.some((keyword) => name.toLowerCase().includes(keyword.toLowerCase()))) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          address.push(iface.address)
        }
      }
    }
  }

  // 如果没找到无线网卡，再退一步：取所有非内网 IPv4
  if (address.length === 0) {
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === 'IPv4' && !iface.internal) {
          address.push(iface.address)
        }
      }
    }
  }

  if (address.length === 0) {
    return '未找到可用的 IP 地址'
  }

  // 返回单个或数组
  return address.length > 1 ? address : address[0]
}
export function writeLog(content: string) {
  fs.writeFileSync('./log.txt', content, { flag: 'a+' })
}
