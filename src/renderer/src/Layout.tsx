import React from 'react'
import { Flex, Layout } from 'antd'

const { Header, Footer, Sider, Content } = Layout

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  height: 'auto' ,
  paddingInline: 'auto' ,
  lineHeight: '20px',
  backgroundColor: 'transparent' ,
  borderBottom: '1px solid #d9d9d9'
}

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'auto',
  backgroundColor: 'transparent'
}
import InfoBox from '@renderer/components/HelpInfo'
import SelectTransferType from './components/SelectTransferType'
import ConnectToPeerNearbyDevices from './components/ConnectToPeerNearbyDevices'
const App: React.FC = () => (
  <Layout style={layoutStyle}>
    <Header style={headerStyle}>
      <InfoBox />
    </Header>
    <SelectTransferType />
    <ConnectToPeerNearbyDevices />
    <Footer style={{ backgroundColor: 'transparent' }}>
      <p className="tip" style={{ color: 'violet', backgroundColor: 'transparent' }}>
        请确保传输目标设备处于同一局域网Wi-Fi内，然后访问监听设备IP加端口号进行连接。
      </p>
    </Footer>
  </Layout>
)

export default App
