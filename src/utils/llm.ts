import OpenAI from 'openai'
import { RequestOptions } from 'openai/core'
import { devLog } from '.'
// 该接口为部署在vercel的 逆向API服务
const deepseek = new OpenAI({
  baseURL: 'https://deepseek-free-api-master-dusky.vercel.app/v1',
  apiKey: '<DeepSeek API Key>'
})

const kimi = new OpenAI({
  baseURL: 'https://kimi-free-api-master.vercel.app/v1',
  apiKey: '<Kimi API Key>'
})

const RefreshToken =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTc0ODE2NTg2OSwiaWF0IjoxNzQwMzg5ODY5LCJqdGkiOiJjdXUzcnJmbzdwNWx2NmM4bDZ1MCIsInR5cCI6InJlZnJlc2giLCJhcHBfaWQiOiJraW1pIiwic3ViIjoiY3AybjltOWtxcTRyNzNtb2R2cDAiLCJzcGFjZV9pZCI6ImNwMm45bTlrcXE0cjczbW9kdm9nIiwiYWJzdHJhY3RfdXNlcl9pZCI6ImNwMm45bTlrcXE0cjczbW9kdm8wIiwiZGV2aWNlX2lkIjoiNzQ3NDkxNzQ3NTE1NTU4MjIxMyJ9._FgQwqr0Gsgqyrz0Hj0wVyy_vedq4hqEkmpNbi1Yfch51mct-IkZnhDEj4nmz5rKIGl9tH9L5ol008xLLasypA'
const UserToken = 'sNt8an/1lD6LrQE3AYcVbR/6fnf/lJ82RKcXLGhPFwG+YJQZTVoubHT/6KcjcYtx'

type ResultJson = {
  [key: string]: string | boolean | number | null | undefined | string[] | object
}
export async function deepSeekServices() {
  const requestOptions: RequestOptions = {
    headers: {
      Authorization: `Bearer ${UserToken}`
    }
  }
  const completion: ResultJson | any = await deepseek.chat.completions.create(
    {
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: '你是谁' }
      ],
      model: 'deepseek-chat',
      stream: false
    },
    requestOptions
  )
  let result = completion.choices[0].message.content
  devLog(result)
  return result
}
export async function KimiServices() {
  const requestOptions: RequestOptions = {
    headers: {
      Authorization: `Bearer ${RefreshToken}`
    }
  }
  const completion: ResultJson | any = await kimi.chat.completions.create(
    {
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: '牛顿迭代' }
      ],
      model: 'kimi',
      stream: false
    },
    requestOptions
  )
  devLog (completion.choices[0].message.content)
  return completion.choices[0].message.contents
}



deepSeekServices();
