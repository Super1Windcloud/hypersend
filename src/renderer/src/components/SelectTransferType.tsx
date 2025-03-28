import styled from 'styled-components'
import { TextInputModel } from './TextInputModel'
import { useState } from 'react'

const SelectTitle = styled.h2`
  font-size: 16px;
  color: Salmon;
  width: 100%;
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 4px;
`

const NavBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  width: 100%;
  background-color: inherit;
  /* background-color: #2c3e50; */
  border-radius: 8px;
`

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color:      lightpink ;
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #34495e;
    border-radius: 5px;
  }
`

const Icon = styled.div`
  font-size: 24px;
  margin-bottom: 5px;
`

const Text = styled.span`
  font-size: 14px;
`

export const IconButton = ({ icon, text  , ClickEvent  } : {icon : string , text : string , ClickEvent : () => void}) => {
  return (
    <NavItem onClick={ClickEvent}>
      <Icon>{icon}</Icon>
      <Text>{text}</Text>
    </NavItem>
  )
}

const TransferIcons = () =>
{

  const [isModalOpen, setIsModalOpen] = useState([false, false])
   const toggleModal = (idx: number, target: boolean) => {
     setIsModalOpen((p) => {
       p[idx] = target
       return [...p]
     })
   }
  const invokeClipboard = async () => {
     await window.electron.ipcRenderer.invoke('sendClipboard')
  }
  const openFolder = async () => {
    await window.electron.ipcRenderer.invoke('openFolder')
  }
  const openFileExplorer = async () =>
  {
    await window.electron.ipcRenderer.invoke('openFile')
  }
  return (
    <NavBar>
      <TextInputModel isModalOpen ={ isModalOpen }  toggleModal = { toggleModal } > </TextInputModel>
      <IconButton icon="📄" text="文件" ClickEvent={() => { openFileExplorer() }}  />
      <IconButton icon="📁" text="文件夹"  ClickEvent = {() => { openFolder() }} />
      <IconButton icon="📝" text="文本"  ClickEvent={ ()=> { toggleModal(0, true) }  }  />
      <IconButton icon="📋" text="剪贴板"  ClickEvent = {() => {  invokeClipboard() }} />

    </NavBar>
  )
}
const selectTransferType = () => {
  return (
    <>
      <SelectTitle>选择传输的内容</SelectTitle>
      <TransferIcons />
    </>
  )
}

export default selectTransferType
