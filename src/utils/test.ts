import { log } from 'console'
import 'dotenv/config'
import OpenAI from 'openai'

function envPrint() {
  log(process.env.ZhiPu)
  log(process.env.DeepSeek)
  log(process.env.Siliconflow)
  log(process.env.DouBao)
  log(process.env.Kimi)
  log(process.env.ALI_QWEN_QWQ)
}

async function SiliconflowServices(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.Siliconflow,
    baseURL: 'https://api.siliconflow.cn/v1',
    dangerouslyAllowBrowser: true
  })

  try {
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      messages: [
        {
          role: 'assistant',
          content: '你是一个代码助手,帮我解决算法问题'
        },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    })

    let result = ''

    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }
    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('Error fetching completion:', error.message)
    return error
  }
}

async function DoubaoLiteServices(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
    dangerouslyAllowBrowser: true
  })
  try {
    const response = await client.chat.completions.create({
      model: 'doubao-1.5-lite-32k-250115',
      messages: [
        { role: 'system', content: '你是一个代码助手 帮我解决算法问题' },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true
    })

    let result = ''

    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }
    return result
  } catch (error) {
    console.error('调用备用豆包接口:', error)

    const result = await DoubaoServicesPro(question)
    return result
  }
}

async function DoubaoServicesPro(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/',
    dangerouslyAllowBrowser: true
  })

  try {
    const response = await client.chat.completions.create({
      model: 'doubao-1.5-pro-32k-250115',
      messages: [
        { role: 'assistant', content: '你是一个代码助手 帮我解决算法问题' },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true
    })

    let result = ''

    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }

    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('豆包模型全部相应失败:', error.message)

    return error
  }
}

async function DoubaoServicesDeepSeek(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/',
    dangerouslyAllowBrowser: true
  })

  try {
    const response = await client.chat.completions.create({
      model: 'ep-20250224214614-qvpgg',
      messages: [
        {
          role: 'system',
          content: '你是一个代码助手,帮我解答算法代码题'
        },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true
    })

    let result = ''
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }
    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    console.error('Error fetching completion:', error)
    return error
  }
}

async function KimiServices(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.Kimi,
    baseURL: 'https://api.moonshot.cn/v1',
    dangerouslyAllowBrowser: true
  })

  try {
    const response = await client.chat.completions.create({
      model: 'moonshot-v1-auto',
      messages: [
        {
          role: 'system',
          content: '你是一个代码助手,帮我解答算法代码题'
        },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true
    })

    let result = ''
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }
    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    console.error('Error fetching completion:', error)
    return error
  }
}

async function ZhiPuServices(question?: string, onData?: (chunk: string) => void) {
  const client = new OpenAI({
    apiKey: process.env.ZhiPu,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
    dangerouslyAllowBrowser: true
  })
  try {
    const response = await client.chat.completions.create({
      model: 'codegeex-4',
      messages: [
        {
          role: 'system',
          content: '你是一个代码助手,帮我解答算法代码题 '
        },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true,
      top_p: 0.7,
      temperature: 0.9,
      max_tokens: 2000,
      stop: ['<|endoftext|>', '<|user|>', '<|assistant|>', '<|observation|>']
    })
    let result = ''
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText) // 通过回调触发流式输出
          }
        }
      }
    }
    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    console.error('Error fetching completion:', error)
    return error
  }
}

async function DeepSeekApiServices(question?: string, onData?: (chunk: string) => void) {
  const deepSeekApp = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DeepSeek,
    dangerouslyAllowBrowser: true
  })
  const completion = await deepSeekApp.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful Code  assistant.' },
      { role: 'user', content: question ?? '牛顿迭代' }
    ],
    model: 'deepseek-chat',
    stream: true
  })
  let result = ''
  try {
    for await (const chunk of completion) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content
        if (responseText) {
          result += responseText
          if (onData) {
            onData(responseText)
          }
        }
      }
    }
    return result
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    return error
  }
}

async function aliQwenQwQ32B(question?: string, onData?: (chunk: string) => void) {
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    dangerouslyAllowBrowser: true
  })

  let reasoningContent = ''
  let answerContent = ''
  let isAnswering = false
  try {
    const stream = await ali.chat.completions.create({
      model: 'qwq-32b',
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      stream: true
    })
    console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20) + '\n')
    for await (const chunk of stream) {
      if (!chunk.choices?.length) {
        console.log('\nUsage:')
        console.log(chunk.usage)
        continue
      }
      const delta: unknown = chunk.choices[0].delta
      if (delta.reasoning_content) {
        reasoningContent += delta.reasoning_content
        if (onData) {
          onData(delta.reasoning_content)
        }
      } else if (delta.content) {
        if (!isAnswering) {
          console.log('\n' + '='.repeat(20) + ' ' + '='.repeat(20) + '\n')
          isAnswering = true
        }
        answerContent += delta.content
        if (onData) {
          onData(delta.content)
        }
      }
    }
    return null
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    return error
  }
}
async function aliQwen2_5(question?: string, onData?: (chunk: string) => void) {
  const qwen = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.ALI_QWEN_QWQ,
    dangerouslyAllowBrowser: true
  })
  const completion = await qwen.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
      { role: 'user', content: question ?? '牛顿迭代' }
    ],
    model: 'qwen2.5-14b-instruct-1m',
    stream: true
  })
  let result = ''
  for await (const chunk of completion) {
    if (chunk.choices && chunk.choices.length > 0) {
      const responseText = chunk.choices[0].delta?.content
      if (responseText) {
        result += responseText
        if (onData) {
          onData(responseText)
        }
      }
    }
  }
  return result
}
async function aliQwenPlus(question?: string, onData?: (chunk: string) => void) {
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    dangerouslyAllowBrowser: true
  })

  let reasoningContent = ''
  let answerContent = ''
  let isAnswering = false
  try {
    const stream = await ali.chat.completions.create({
      model: 'qwq-plus',
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      stream: true
    })
    console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20) + '\n')
    for await (const chunk of stream) {
      if (!chunk.choices?.length) {
        console.log('\nUsage:')
        console.log(chunk.usage)
        continue
      }
      const delta: object = chunk.choices[0].delta
      if (delta.reasoning_content) {
        reasoningContent += delta.reasoning_content
        if (onData) {
          onData(delta.reasoning_content)
        }
      } else if (delta.content) {
        if (!isAnswering) {
          console.log('\n' + '='.repeat(20) + ' ' + '='.repeat(20) + '\n')
          isAnswering = true
        }
        answerContent += delta.content
        if (onData) {
          onData(delta.content)
        }
      }
    }
    return null
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error(error.message)
    return error
  }
}

async function aliQwenMax(question?: string, onData?: (chunk: string) => void) {
  const qwen = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.ALI_QWEN_QWQ,
    dangerouslyAllowBrowser: true
  })
  const completion = await qwen.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
      { role: 'user', content: question ?? '牛顿迭代' }
    ],
    model: 'qwen-max-2025-01-25',
    stream: true
  })
  let result = ''
  for await (const chunk of completion) {
    if (chunk.choices && chunk.choices.length > 0) {
      const responseText = chunk.choices[0].delta?.content
      if (responseText) {
        result += responseText
        if (onData) {
          onData(responseText)
        }
      }
    }
  }
  return result
}

async function testSpeedConcurrent(question: string) {
  const services = {
    SiliconflowServices,
    DoubaoLiteServices,
    DoubaoServicesPro,
    DoubaoServicesDeepSeek,
    KimiServices,
    ZhiPuServices,
    DeepSeekApiServices,
    aliQwenQwQ32B,
    aliQwen2_5,
    aliQwenPlus,
    aliQwenMax
  }

  // 为每个服务创建一个 Promise，返回首条流式延迟
  const promises = Object.entries(services).map(([name, service]) => {
    return new Promise<{ name: string; delay: number }>((resolve) => {
      const start = Date.now()
      let firstChunkReceived = false
      let resolvedOrTimedOut = false

      service(question, () => {
        if (!firstChunkReceived && !resolvedOrTimedOut) {
          const end = Date.now()
          const delay = end - start
          console.log(`${name} 首条流式数据延迟: ${delay} ms`)
          firstChunkReceived = true
          resolvedOrTimedOut = true
          resolve({ name, delay })
        }
      }).catch((err) => {
        if (!resolvedOrTimedOut) {
          console.log(`${name} 调用失败:`, err)
          resolvedOrTimedOut = true
          resolve({ name, delay: Infinity }) // 失败视为无效
        }
      })
    })
  })

  // 等待所有首条返回完成
  const allResults = await Promise.all(promises)

  // 过滤掉失败或超时的
  const validResults = allResults.filter((r) => r.delay !== Infinity)
  if (validResults.length === 0) {
    console.log('所有服务首条返回失败或超时')
    return
  }

  // 找出首条流式返回最快的服务
  const fastest = validResults.reduce((prev, curr) => (curr.delay < prev.delay ? curr : prev))
  console.log(`首条流式返回最快的服务是: ${fastest.name}，延迟: ${fastest.delay} ms`)
}

// testSpeedConcurrent('牛顿迭代')

/**
 * SiliconflowServices 首条流式数据延迟: 1233 ms
aliQwen2_5 首条流式数据延迟: 3520 ms
aliQwenQwQ32B 首条流式数据延迟: 3522 ms
aliQwenPlus 首条流式数据延迟: 3547 ms
aliQwenMax 首条流式数据延迟: 3576 ms
DoubaoServicesDeepSeek 首条流式数据延迟: 3583 ms
DoubaoLiteServices 首条流式数据延迟: 3644 ms
KimiServices 首条流式数据延迟: 3832 ms
DoubaoServicesPro 首条流式数据延迟: 4255 ms
ZhiPuServices 首条流式数据延迟: 4340 ms
DeepSeekApiServices 首条流式数据延迟: 6021 ms
首条流式返回最快的服务是: SiliconflowServices，延迟: 1233 ms

 */
