import OpenAI from 'openai'
import env from 'dotenv'
env.config()
const xunfei = new OpenAI({
  baseURL: 'https://spark-api-open.xf-yun.com/v1',
  apiKey: process.env.XunFei
})

export const xunfeiServices = async (question?: string) => {
  const completion: any = await xunfei.chat.completions.create({
    messages: [
      { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
      { role: 'user', content: question ?? 'fuck' }
    ],
    model: 'generalv3.5'
  })
  console.log(completion.choices[0].message.content)
}

export const SiliconCloud = async (question?: string) => {
  const API_KEY = process.env.SiliconCloud
  const body = {
    model: 'deepseek-ai/DeepSeek-V3',
    messages: [
      { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
      { role: 'user', content: question ?? 'fuck' }
    ],
    stream: false,
    max_tokens: 512,
    temperature: 0.7
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const result: any = await fetch('https://api.siliconflow.cn/v1/chat/completions', options)
    .then((response) => response.json())
    .then((response) => response.choices[0].message.content)
    .catch((err) => console.error(err))

  console.log(result)
  return result
}

export async function SiliconflowServices(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.Siliconflow,
    baseURL: 'https://api.siliconflow.cn/v1' // 使用你提供的base_url
  })

  try {
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      messages: [
        {
          role: 'user',
          content: question ?? 'fuck'
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    })
    let result = ''
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        // 获取每个部分的响应并进行处理
        const responseText = chunk.choices[0].delta?.content
        result += responseText
      }
    }
    return result
  } catch (error) {
    console.error('Error fetching completion:', error)
  }
}

export async function DoubaoServices(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3'
  })

  try {
    const response = await client.chat.completions.create({
      model: 'doubao-1.5-lite-32k-250115',
      messages: [
        {
          role: 'user',
          content: question ?? 'fuck'
        }
      ],
      stream: false
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('调用备用豆包接口:', error)
    let result = await DoubaoServicesBackup(question)
    return result
  }
}

async function DoubaoServicesBackup(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/'
  })

  try {
    const response = await client.chat.completions.create({
      model: 'doubao-1.5-pro-32k-250115',
      messages: [
        {
          role: 'user',
          content: question ?? 'fuck'
        }
      ],
      stream: false
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('豆包模型全部相应失败:', error)
  }
}

export async function DoubaoServicesDeepSeek(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/'
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
          content: question ?? 'fuck'
        }
      ],
      stream: false
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error fetching completion:', error)
  }
}

// let api = process.env.DouBao ;
// if  (api) { console.log("api is  :"+api )
// } else
// {
//    console.log(process.cwd() )
//    process.exit(1);
// }

export async function KimiServices(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.Kimi,
    baseURL: 'https://api.moonshot.cn/v1'
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
          content: question ?? 'fuck'
        }
      ],
      stream: false
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error fetching completion:', error)
  }
}

export async function ZhiPuServices(question?: string) {
  const client = new OpenAI({
    apiKey: process.env.ZhiPu,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/'
  })
  try {
    const response = await client.chat.completions.create({
      model: 'codegeex-4',
      messages: [
        {
          role: 'system',
          content:
            '你是一位智能编程助手, 你叫CodeGeeX。你会为用户回答关于编程、代码、计算机方面的任何问题,并提供格式规范、可以执行、准确安全的代码，并在必要时提供详细的解释。任务：请为输入代码提供格式规范的注释，包含多行注释和单行注释，请注意不要改动原始代码，只需要添加注释。 请用中文回答。'
        },
        {
          role: 'user',
          content: question ?? 'fuck'
        }
      ],
      stream: false,
      top_p: 0.7,
      temperature: 0.9,
      max_tokens: 2000,
      stop: ['<|endoftext|>', '<|user|>', '<|assistant|>', '<|observation|>']
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('Error fetching completion:', error)
  }
}

const deepSeekApp = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DeepSeek
})

export async function DeepSeekApiServices(question?: string) {
  const completion = await deepSeekApp.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful Code  assistant.' },
      { role: 'user', content: question ?? '牛顿迭代' }
    ],
    model: 'deepseek-chat',
    stream: false
  })
  return completion.choices[0].message.content
}

export async function aliQwenQwQ32B(question?: string) {
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ, // 从环境变量读取
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
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

      const delta: any = chunk.choices[0].delta

      // 处理思考过程
      if (delta.reasoning_content) {
        process.stdout.write(delta.reasoning_content)
        reasoningContent += delta.reasoning_content
      }
      // 处理正式回复
      else if (delta.content) {
        if (!isAnswering) {
          console.log('\n' + '='.repeat(20) + '完整回复' + '='.repeat(20) + '\n')
          isAnswering = true
        }
        process.stdout.write(delta.content)
        answerContent += delta.content
      }
    }
  } catch (error) {
    console.error('Error:', error)
  }
}


aliQwenQwQ32B()
