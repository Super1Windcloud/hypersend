import styled, { keyframes, css } from 'styled-components'
import { useState } from 'react'
import { ConnectButton } from '@renderer/components/ConnectButton'

import { Spin } from 'antd'

type IconProps = {
  isRotating: boolean
  [key: string]: any
}

const Icon = styled.div<IconProps>`
  font-size: 24px;
  margin-bottom: 5px;
  margin-left: 10px;
  &:hover {
    cursor: pointer;
    transform: scale(1.2);
    transition: all 0.3s ease-in-out;
    opacity: 0.8;
  }
  ${({ $isRotating }) =>
    $isRotating &&
    css`
      animation: ${rotateAnimation} 3s linear;
    `}
`
//@ts-ignore
const IconWithChildren = (props: IconProps) => {
  const { isRotating, children, ...restProps } = props
  return (
    <Icon isRotating={isRotating} {...restProps}>
      {children}
    </Icon>
  )
}

const ConnectWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: start;
  width: 100%;
`
const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const Title = styled.div`
  font-size: 16px;
  color: palevioletred;
  width: auto;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 4px;
`
/// "Ctrl + Shift + S"组合按键即可截图 / 也可使用看答案设备进行远程截图

const ConnectToPeerNearbyDevices = () => {
  //@ts-ignore
  const [isRotating, setIsRotating] = useState(false)
  //@ts-ignore
  const handleRefresh = () => {
    setIsRotating(true)
    setTimeout(() => {
      setIsRotating(false)
    }, 3000)
  }
  return (
    <>
      <ConnectWrapper>
        <Title>连接到同局域网设备</Title>
        {/* <IconWithChildren onClick={handleRefresh} isRotating={isRotating} title="刷新"> */}
        <Spin />
        {/* </IconWithChildren> */}
      </ConnectWrapper>
      <ConnectButton />
    </>
  )
}

export default ConnectToPeerNearbyDevices
