import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   // 严格模式 会对执行过程中的错误进行检查,执行两次渲染, 第一个模拟渲染 ,第二次正式渲染 
  <React.StrictMode> 
    <App />
  </React.StrictMode>
)
