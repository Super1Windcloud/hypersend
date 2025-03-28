import OpenAI from 'openai'
import { devLog } from '.'


export function envPrint()
{
  devLog(process.env.ZhiPu)
  devLog(process.env.DeepSeek)
  devLog(process.env.Siliconflow)
  devLog(process.env.DouBao)
  devLog(process.env.Kimi)
  devLog(process.env.ALI_QWEN_QWQ)
}


export async function SiliconflowServices(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.Siliconflow,
    baseURL: 'https://api.siliconflow.cn/v1',
    dangerouslyAllowBrowser: true
  });

  try
  {
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen2.5-Coder-32B-Instruct',
      messages: [
        {
          role: "assistant", content: "你是一个代码助手,帮我解决算法问题"
        },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    });

    let result = '';

    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText ); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('Error fetching completion:', error);
  }
}


export async function DoubaoLiteServices(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3'
    , dangerouslyAllowBrowser: true
  })
  try
  {
    const response =
      await client.chat.completions.create({
        model: 'doubao-1.5-lite-32k-250115',
        messages: [
          { role: 'system', content: "你是一个代码助手 帮我解决算法问题" },
          {
            role: 'user',
            content: question ?? '牛顿迭代'
          }
        ],
        stream: true
      })

    let result = '';

    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('调用备用豆包接口:', error)
    let result = await DoubaoServicesPro(question)
    return result
  }
}

export  async function DoubaoServicesPro(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/'
    , dangerouslyAllowBrowser: true
  })

  try
  {
    const response = await client.chat.completions.create({
      model: 'doubao-1.5-pro-32k-250115',
      messages: [
        { role: "assistant", content: "你是一个代码助手 帮我解决算法问题" },
        {
          role: 'user',
          content: question ?? '牛顿迭代'
        }
      ],
      stream: true
    })

    let result = '';

    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('豆包模型全部相应失败:', error)
  }
}

export async function DoubaoServicesDeepSeek(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: 'https://ark.cn-beijing.volces.com/api/v3/'
    , dangerouslyAllowBrowser: true
  })

  try
  {
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

    let result = '';
    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('Error fetching completion:', error)
  }
}


export async function KimiServices(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.Kimi,
    baseURL: 'https://api.moonshot.cn/v1'
    , dangerouslyAllowBrowser: true
  })

  try
  {
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

    let result = '';
    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('Error fetching completion:', error)
  }
}

export async function ZhiPuServices(question?: string, onData?: (chunk: string) => void)
{
  const client = new OpenAI({
    apiKey: process.env.ZhiPu,
    baseURL: 'https://open.bigmodel.cn/api/paas/v4/'
    , dangerouslyAllowBrowser: true
  })
  try
  {
    const response = await client.chat.completions.create({
      model: 'codegeex-4',
      messages: [
        {
          role: 'system',
          content:
            '你是一个代码助手,帮我解答算法代码题 '
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
    let result = '';
    for await (const chunk of response)
    {
      if (chunk.choices && chunk.choices.length > 0)
      {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText)
        {
          result += responseText;
          if (onData)
          {
            onData(responseText); // 通过回调触发流式输出
          }
        }
      }
    }
    return result;
  } catch (error)
  {
    console.error('Error fetching completion:', error)
    return error;
  }
}


export async function DeepSeekApiServices(question?: string, onData?: (chunk: string) => void)
{
  const deepSeekApp = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DeepSeek
    , dangerouslyAllowBrowser: true
  })
  const completion =
    await deepSeekApp.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful Code  assistant.' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      model: 'deepseek-chat',
      stream: true
    })
  let result = '';
  for await (const chunk of completion)
  {
    if (chunk.choices && chunk.choices.length > 0)
    {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText)
      {
        result += responseText;
        if (onData)
        {
          onData(responseText);
        }
      }
    }
  }
  return result;
}



export async function aliQwenQwQ32B(question?: string, onData?: (chunk: string) => void)
{
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    , dangerouslyAllowBrowser: true
  })

  let reasoningContent = ''
  let answerContent = ''
  let isAnswering = false
  try
  {
    const stream = await ali.chat.completions.create({
      model: 'qwq-32b',
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      stream: true
    })
    console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20) + '\n')
    for await (const chunk of stream)
    {
      if (!chunk.choices?.length)
      {
        console.log('\nUsage:')
        console.log(chunk.usage)
        continue
      }
      const delta: any = chunk.choices[0].delta
      if (delta.reasoning_content)
      {
        reasoningContent += delta.reasoning_content
        if (onData)
        {
          onData(delta.reasoning_content);
        }
      }
      else if (delta.content)
      {
        if (!isAnswering)
        {
          console.log('\n' + '='.repeat(20) + ' ' + '='.repeat(20) + '\n')
          isAnswering = true
        }
        answerContent += delta.content
        if (onData)
        {
          onData(delta.content );
        }
      }
    }
  } catch (error)
  {
    console.error('Error:', error)
  }
}
export  async function aliQwen2_5(question?: string, onData?: (chunk: string) => void)
{
  const qwen = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.ALI_QWEN_QWQ
    , dangerouslyAllowBrowser: true
  })
  const completion =
    await qwen.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      model: 'qwen2.5-14b-instruct-1m',
      stream: true
    })
  let result = '';
  for await (const chunk of completion)
  {
    if (chunk.choices && chunk.choices.length > 0)
    {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText)
      {
        result += responseText;
        if (onData)
        {
          onData(responseText);
        }
      }
    }
  }
  return result;
}
export  async function aliQwenPlus(question?: string, onData?: (chunk: string) => void)
{

  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
    , dangerouslyAllowBrowser: true
  })

  let reasoningContent = ''
  let answerContent = ''
  let isAnswering = false
  try
  {
    const stream = await ali.chat.completions.create({
      model: 'qwq-plus',
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      stream: true
    })
    console.log('\n' + '='.repeat(20) + '思考过程' + '='.repeat(20) + '\n')
    for await (const chunk of stream)
    {
      if (!chunk.choices?.length)
      {
        console.log('\nUsage:')
        console.log(chunk.usage)
        continue
      }
      const delta: any = chunk.choices[0].delta
      if (delta.reasoning_content)
      {
        reasoningContent += delta.reasoning_content
        if (onData)
        {
          onData(delta.reasoning_content );
        }
      }
      else if (delta.content)
      {
        if (!isAnswering)
        {
          console.log('\n' + '='.repeat(20) + ' ' + '='.repeat(20) + '\n')
          isAnswering = true
        }
        answerContent += delta.content
        if (onData)
        {
          onData(delta.content );
        }
      }
    }
  } catch (error)
  {
    console.error('Error:', error)
  }
}

export   async function aliQwenMax(question?: string, onData?: (chunk: string) => void
)
{
  const qwen = new OpenAI({
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: process.env.ALI_QWEN_QWQ
    , dangerouslyAllowBrowser: true
  })
  const completion =
    await qwen.chat.completions.create({
      messages: [
        { role: 'system', content: '你是一个代码助手,帮我解答算法代码题' },
        { role: 'user', content: question ?? '牛顿迭代' }
      ],
      model: 'qwen-max-2025-01-25',
      stream: true
    })
  let result = '';
  for await (const chunk of completion)
  {
    if (chunk.choices && chunk.choices.length > 0)
    {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText)
      {
        result += responseText;
        if (onData)
        {
          onData(responseText);
        }
      }
    }
  }
  return result;
}

export async function FreeQwenServices(question?: string, onData?: (chunk: string) => void
  , llms: Function[] = [aliQwen2_5, aliQwenPlus, aliQwenMax, aliQwenQwQ32B])
{


  let randomNum = Math.floor(Math.random() * llms.length); //
  if (randomNum < 0 || randomNum >= llms.length) return Error("randomNum 异常错误")
  console.warn(randomNum);
  try
  {
    // 调用选中的 LLM
    return await llms[randomNum](question, onData);
  } catch (err: any)
  {
    console.warn(`LLM ${randomNum} 返回错误: ${err.message}`);
    // 移除返回错误的 LLM
    const remainingLLMs = llms.filter((_, index) => index !== randomNum);
    // 递归尝试剩余的 LLM
    return FreeQwenServices(question, onData, remainingLLMs);
  }
}





export async function RandomLLMServices(question?: string, onData?: (chunk: string) => void,
  llms = [aliQwenQwQ32B
    , SiliconflowServices, DeepSeekApiServices
    , ZhiPuServices, KimiServices, DoubaoServicesPro
    , DoubaoServicesDeepSeek, DoubaoServicesPro])
{
  // let llms = [aliQwenQwQ32B
  //     , SiliconflowServices, DeepSeekApiServices
  //     , ZhiPuServices, KimiServices, DoubaoServices
  //     , DoubaoServicesDeepSeek, DoubaoServicesBackup];
  let randomNum = Math.floor(Math.random() * llms.length); //
  if (randomNum < 0 || randomNum >= llms.length) return Error("randomNum 异常错误")
  console.warn(randomNum);
  try
  {
    return await llms[randomNum](question, onData);
  } catch (err: any)
  {
    console.warn(`LLM ${randomNum} 返回错误: ${err.message}`);
    // 移除返回错误的 LLM
    const remainingLLMs = llms.filter((_, index) => index !== randomNum);
    // 递归尝试剩余的 LLM
    return RandomLLMServices(question, onData, remainingLLMs);
  }
}


//
// (async  ()=> {
//          FreeQwenServices("牛顿迭代", (chunk) => {
//     process.stdout.write(chunk)
// })
//     .then((result) =>
//         console.log(result )
//     );})() ;
//
//


// aliQwenQwQ32B('牛顿迭代', (chunk) => {
//     process.stdout.write(chunk); // 流式输出
// }).then((fullResponse) => {
//     console.log('\n完整返回值:',  );
// });
//
