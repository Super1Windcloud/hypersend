import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons'
import { Space } from 'antd'


const Icons : React.FC = () => (
  <Space>
    <SmileTwoTone />
    <HeartTwoTone twoToneColor="#eb2f96" />
    <CheckCircleTwoTone twoToneColor="#52c41a" />
  </Space>
)


export default Icons;
