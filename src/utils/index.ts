import os from 'os'
import  fs   from 'fs'

export function exist( path  : string )
{
  if (fs.existsSync(path)) return path
  else  return  null
}

export function devAlert(...args: any[])
{
  if (process.env.NODE_ENV === 'development') {
     alert(...args)
  }
}

export function devAssert(...args: any[])
{
  if (process.env.NODE_ENV === 'development') {
     console.assert(...args)
  }
}

export function devLog(...args: any[]) {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}
export function getLocalIPAddress() : string  | string[][]  {
  const interfaces = os.networkInterfaces()
  let  address = []  as string[][]   ;
  for (const name  of Object.keys(interfaces))
  {

    devLog(name);
    if (name.includes('WLAN') || name.includes('Mihomo')) {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          address.push( [name, iface.address])
        }
      }
    }
  }
  if (address.length > 0) {
    return address
  }
  return '未找到可用的 IP 地址'
}

export function getLocalWlanIPAddress(): string | object[]  |string[] {
  const interfaces = os.networkInterfaces()
  let address = [] as  object[] ;
  for (const name of Object.keys(interfaces)) {
    devLog(name)
    if (name.includes('WLAN'))  {
      for (const iface of interfaces[name]!) {
        if (iface.family === 'IPv4' && !iface.internal) {
          address.push({ 'WLAN':  iface.address } )
        }
      }
    }
  }
  if (address.length > 0)
  {
    if (!Array.isArray(address))
    {
      return [];
    }
    if (address.every(item =>   typeof item !== 'object' ))
    {
      return address;
    }
    if (address.every((item) => typeof item === 'object'))
    {
      let arr =  address.map(item => item['WLAN']);
      return  arr.length >1 ? arr : arr[0];
    }
    return address
  }
  return '未找到可用的 IP 地址'
}




export function writeLog( content : string )
{
  fs.writeFileSync('./log.txt', content, { flag: 'a+' });
}

