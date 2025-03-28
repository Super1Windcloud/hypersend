import { forwardRef   } from 'react'
import { AntDesignOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Space } from 'antd'
import { createStyles } from 'antd-style'

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253e1, #e9bff8);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0.5;
      }
    }
  `
}))

const useStyleDanger = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-dangerous:not([disabled]):not(.${prefixCls}-btn-primary) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, red, #e9bff8);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0.5;
      }
    }
  `
}))

// 使用 React.forwardRef 包裹组件

export  const GradientButton = forwardRef<HTMLButtonElement, { onClick?: () => void ,status  ?:boolean  }>((props, ref) => {
  const { onClick, status , ...restProps } = props


  const { styles } =  useStyle();
  // console.log( typeof status  ,status  )
  return (
    <ConfigProvider
      button={{
        className:     styles.linearGradientButton
      }}
    >
      <Space>
        <Button
          ref={ref}
          type="primary"
          size="large"
          icon={<AntDesignOutlined />}
          onClick={onClick}
          {...restProps}
        >
          开启监听
        </Button>
      </Space>
    </ConfigProvider>
  )
})




export  const GradientButtonDanger  = forwardRef<HTMLButtonElement, { onClick?: () => void ,status  ?:boolean  }>((props, ref) => {
  const { onClick, status , ...restProps } = props


  const { styles } =  useStyleDanger ();
  // console.log( typeof status  ,status  )
  return (
    <ConfigProvider
      button={{
        className:     styles.linearGradientButton
      }}
    >
      <Space>
        <Button
          ref={ref}
          type="primary"
          danger
          size="large"
          icon={<AntDesignOutlined />}
          onClick={onClick}
          {...restProps}
        >
          关闭监听
        </Button>
      </Space>
    </ConfigProvider>
  )
})


GradientButton.displayName = 'GradientButton';
GradientButtonDanger .displayName = 'GradientButtonDanger';
