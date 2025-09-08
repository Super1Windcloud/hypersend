import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { GradientButton, GradientButtonDanger } from './GradientButton'
import Icons from './Icons'
import { InfoCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { devLog } from '@/utils/index'
const Container = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  padding: 20px;
  color: white;
  width: inherit;
  text-align: center;
  outline: lightcoral solid 1px;
  transition: box-shadow 0.3s ease-in-out;
  animation: glow-animation 3s infinite alternate;
  @keyframes glow-animation {
    0% {
      box-shadow:
        0 0 5px rgba(255, 0, 255, 0.5),
        0 0 10px rgba(0, 255, 255, 0.5);
      border-image-source: linear-gradient(90deg, #ff00ff, #00ffff);
      border-image-slice: 10;
      border-image-repeat: stretch;
    }
    50% {
      box-shadow:
        0 0 15px rgba(0, 255, 255, 0.7),
        0 0 25px rgba(255, 0, 255, 0.7);
      border-image-source: linear-gradient(90deg, #00ffff, #ff00ff);
      border-image-slice: 10;
      border-image-repeat: stretch;
    }
    100% {
      box-shadow:
        0 0 5px rgba(255, 0, 255, 0.5),
        0 0 10px rgba(0, 255, 255, 0.5);
      border-image-source: linear-gradient(90deg, #ff00ff, #00ffff);
      border-image-slice: 10;
      border-image-repeat: stretch;
    }
  }
`
type StatusProps = {
  status?: boolean
  [key: string]: any
}
const Status = styled.div<StatusProps>`
  font-size: 16px;
  margin-bottom: 10px;
  width: inherit;
  color: ${(props) => (!props.status ? 'red' : 'green')};
`

const Message = styled.div`
  background-color: inherit;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 20px;
  color: lightblue;
  color: #a58efb;
  color: #e9bff8;
`

export const ConnectButton = () => {
  const [listenResultStatus, setListenResultStatus] = React.useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const isFirstRender = useRef(0)
  const [listenStatusMessage, setListenStatusMessage] = React.useState('未连接到客户端')
  const GlobalListenerStatusMessage = async (): Promise<[() => void, () => void]> => {
    let address = await window.electron.ipcRenderer.invoke('getLocalWlanIP')
    const start = () => {
      messageApi.open({
        type: 'success',
        content: `成功开启监听,请使用目标设备访问 ${address}:33333`,
        duration: 5
      })
    }
    const stop = () => {
      messageApi.open({
        type: 'error',
        content: '监听已中断, 想要重新开启请再次点击',
        duration: 3
      })
    }
    return [start, stop]
  }
  useEffect(() => {
    devLog(isFirstRender.current)
    if (isFirstRender.current < 2) {
      isFirstRender.current += 1
      return
    }

    ;(async () => {
      let [start, stop] = await GlobalListenerStatusMessage()
      if (listenResultStatus) {
        // devAlert('start global message ')
        start()
      } else if (!listenResultStatus) {
        // devAlert('stop  global message ')
        stop()
      }
    })()
  }, [listenResultStatus])

  function handleListener() {
    setListenResultStatus(!listenResultStatus)
    setListenStatusMessage(listenResultStatus ? '未连接到客户端' : '启动成功,开始监听')
    if (listenResultStatus) {
      window.electron.ipcRenderer.send('stopServerListener')
    } else if (!listenResultStatus) {
      window.electron.ipcRenderer.send('startServerListener')
    }
  }

  return (
    <>
      <Container>
        {contextHolder}
        <Status status={!!listenResultStatus}>
          {!listenResultStatus ? <InfoCircleOutlined /> : <Icons />}
          {listenStatusMessage}
        </Status>
        <Message>"Ctrl + Shift + S"组合按键即可截图</Message>
        {listenResultStatus ? (
          <GradientButtonDanger onClick={handleListener}></GradientButtonDanger>
        ) : (
          <GradientButton onClick={handleListener}></GradientButton>
        )}
      </Container>
    </>
  )
}
