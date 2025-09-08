import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { QRCodeSVG } from 'qrcode.react'
import { devLog } from '@/utils'

const PORT = 33333
const ipcRenderer = window.electron.ipcRenderer

// 获取本地 IP
async function getLocalIPAddress(): Promise<string> {
  try {
    const address = await ipcRenderer.invoke('getLocalWlanIP')
    return address
  } catch (error) {
    console.error('获取本地 IP 地址时出错:', error)
    return ''
  }
}

// 二维码组件
const QrCodeComponent: React.FC = () => {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const ip = await getLocalIPAddress()
        const localUrl = `http://${ip}:${PORT}`
        setUrl(localUrl)
      } catch {
        setUrl(`http://127.0.0.1:${PORT}`)
      }
    }
    fetchUrl()
  }, [])

  if (!url) return <div>正在生成二维码...</div>

  return <QRCodeSVG value={url} size={100} />
}

const InfoCard = styled.div`
  background-color: inherit;
  color: #fff;
  padding: 2px;
  border-radius: 8px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  margin-right: 10px;
`

const Span = styled.span`
  margin-right: 15px;
  color: hotpink;
`

type IpType = string[][] | string

function InfoBoxWithQr() {
  const [ips, setIp] = useState<IpType>([])

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const ips = (await getLocalIPAddress()) ?? ('IP 地址为空' as IpType)
        devLog('current IP', ips)
        setIp(ips)
      } catch (error) {
        console.error('获取本地 IP 地址时出错:', error)
      }
    }
    fetchIp()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center', // 垂直方向居中
        justifyContent: 'center', // 水平方向居中
        gap: '8px' // 两个子元素之间的间距
      }}
    >
      <InfoCard>
        <InfoRow>
          <Span>别名：</Span>
          <Span>superwindcloud</Span>
        </InfoRow>
        <InfoRow>
          <Span>IP：</Span>
          {Array.isArray(ips) ? (
            ips.map((ipInfo, index) => (
              <Span key={index}>
                {ipInfo[0]}:{ipInfo[1]}
              </Span>
            ))
          ) : (
            <Span>{ips}</Span>
          )}
        </InfoRow>
        <InfoRow>
          <Span>端口：</Span>
          <Span>{PORT}</Span>
        </InfoRow>
      </InfoCard>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <QrCodeComponent />
      </div>
    </div>
  )
}

export default InfoBoxWithQr
