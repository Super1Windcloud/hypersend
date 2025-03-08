import React, { useState } from 'react'
import { Button, ConfigProvider, Modal, Space } from 'antd'
import { createStyles, useTheme } from 'antd-style'

const useStyle = createStyles(({ token }) => ({
  'my-modal-body': {
    background: 'lightblue',
    padding: token.paddingSM
  },
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px  pink`
  },
  'my-modal-header': {
    borderBottom: `1px dotted ${token.colorPrimary}`
  },
  'my-modal-footer': {
    color: token.colorPrimary
  },
  'my-modal-content': {
    border: '2px solid #333'
  },
  'my-modal-background': {
    backgroundColor: 'rgba(0,0,0,0.5) !important '
  }
}))
interface TextInputModelProps {
  isModalOpen?: boolean[]
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean[]>>
  children?: React.ReactNode
  toggleModal?: (index: number, isModalOpen: boolean) => void
}

import { Input } from 'antd'

const { TextArea } = Input

export const TextInputModel: React.FC<TextInputModelProps> = ({ isModalOpen, toggleModal }) => {
  const { styles } = useStyle()
  const token = useTheme()

  const classNames = {
    body: styles['my-modal-body'],
    mask: styles['my-modal-mask'],
    header: styles['my-modal-header'],
    footer: styles['my-modal-footer'],
    content: styles['my-modal-content'],
    wrapper: styles['my-modal-background']
  }

  const modalStyles = {
    header: {
      borderLeft: `5px solid ${token.colorPrimary}`,
      borderRadius: 5,
      paddingInlineStart: 5
    },
    body: {
      boxShadow: 'inset 0 0 5px #e9bff8',
      borderRadius: 5
    },
    mask: {
      backdropFilter: 'blur(0px)'
    },
    footer: {
      borderTop: '1px solid #a58efb'
    },
    content: {
      boxShadow: '0 0 30px #999'
    }
  }
  const [inputValue, setInputValue] = useState('') 
  
  function sendInputText() {
    let _ = toggleModal ? toggleModal(0, false) : null  
    window.electron.ipcRenderer.send('sendMessage', inputValue)

  }
  return (
    <>
      <Modal
        title="请输入文本内容"
        open={isModalOpen ? isModalOpen[0] : false}
        onOk ={ sendInputText } 
        onCancel={() => (toggleModal ? toggleModal(0, false) : null)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
        okText="发送"
        cancelText="取消"
        classNames={classNames}
        styles={modalStyles}
      >
        <TextArea
          rows={4}
          placeholder="please input ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Modal>
    </>
  )
}
