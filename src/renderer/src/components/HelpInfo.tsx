import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { forwardRef } from 'react'
const ipcRenderer = window.electron.ipcRenderer
async function getLocalIPAddress(): Promise<string> {
  try {
    let address = await ipcRenderer.invoke('getLocalIPAddress')
    return address
  } catch (error) {
    console.error('获取本地 IP 地址时出错:', error)
    return ''
  }
}

const InfoCard = styled.div`
  background-color:  inherit;
  /* background-color: #2c3e50; */
  color: #fff;
  padding: 2px;
  border-radius: 8px;
  width: 100%;
`

// 定义每一行的样式
const InfoRow = styled.div`
  display: flex;
  justify-content: center ;
  align-items: center;
  margin-bottom: 5px;margin-right :10px;
`

//@ts-ignore 
const Icon = styled.div`
  background-color: inherit;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
`
const Span = styled.span`
  margin-right: 15px;
  color :  hotpink;
  ` ;
type IpType = string[][]  | string
function InfoBox() {
  const [ips, setIp] = useState([] as IpType)
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const ips = (await getLocalIPAddress()) ?? ('fuck ip is null'  as IpType)
        setIp(ips)
      } catch (error) {
        console.error('获取本地 IP 地址时出错:', error)
      }
    }
    fetchIp()
  }, []) // 空数组作为第二个参数，确保只在组件挂载时执行一次
  return (
    <InfoCard>
      <InfoRow>
        <Span>别名：</Span>
        <Span>superwindcloud</Span>
      </InfoRow>
      <InfoRow>
        <Span>IP：</Span>
        {Array.isArray(ips) ? (
          ips.map((ipInfo , index) => {
            return <Span key={index}>{ipInfo[0]}:{ipInfo[1]}</Span>
          })
        ) : (
          <Span>{ips}</Span>
        )}
        <div></div>
      </InfoRow>
      <InfoRow>
        <Span>端口：</Span>
        <Span>33333</Span>
      </InfoRow>
    </InfoCard>
  )
}

type ToolbarProps = {
  children?: React.ReactNode
  noPadding?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const StyledToolbar = styled.div<ToolbarProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${(props) => (props.noPadding ? '0' : '4px')};
`

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { children, noPadding = false, ...otherProps }: ToolbarProps,
  ref
) {
  return (
    <StyledToolbar noPadding={noPadding} ref={ref} {...otherProps}>
      {children}
    </StyledToolbar>
  )
})

Toolbar.displayName = 'Toolbar'
export default InfoBox
