import WebSocket from 'ws';
import {useLLMModel} from "@/store";
import {
    RequestAnswerFromAliQwen2_5,
    RequestAnswerFromCodeGeex,
    RequestAnswerFromDeepSeek, RequestAnswerFromDoubaoDeepseek,
    RequestAnswerFromDoubaoLite,
    RequestAnswerFromDoubaoPro,
    RequestAnswerFromKiMi,
    RequestAnswerFromQwenMax,
    RequestAnswerFromQwenPlus,
    RequestAnswerFromQwenQwQ32B,
    RequestAnswerFromSiliconflowQwen
} from "@/utils/llms.ts";

export async function AliOCR(url: string) {
    let response = await fetch('/api/ocr/ali', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({url: url})
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let text = await response.text();
    return text;
}

async function blobUrlToImage(blobUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = blobUrl;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image from Blob URL'));
    });
}

async function blobUrlToBlob(blobUrl: string): Promise<Blob> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return blob;

}

function blobToBase64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // 确保 result 是字符串类型
            if (typeof reader.result === 'string') {
                // 去除 data: 前缀
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('Failed to read Blob as DataURL'));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(blob);
    });
}

export async function getPaddleOCRResult(url  ?: string): Promise<string | void> {
    let startTime = new Date().getTime();
    if (!url) {
        return;
    }
    // let  blob = await blobUrlToBlob(url);
    // let base64 =   await   blobToBase64(blob)  as string  ;
    let response = await fetch('/api/ocr/paddleOcr', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({url: url})
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let text = await response.text();
    console.log(text);
    let endTime = new Date().getTime();
    // alert('paddleOCR 识别时间：' + (endTime - startTime) + 'ms');
    return text;
}

function test_ws() {


    const ws = new WebSocket('ws://192.168.1.222:33333/ws');

    ws.on('open', function open() {
        console.log('websocket connected');
        ws.send("fuck ws connected");
    });

    ws.on('message', function incoming(data) {
        console.log('receive message from server: ' + data);
    });

    ws.on('close', function close() {
        console.log('websocket closed');
    });

    ws.on('error', function error(err) {
        console.error('websocket error: ' + err);
    });
}

export async function RequestAnswerFromLLM
(question: string, renderAnswer ?: (answer: string) => void) {

    const llms = useLLMModel();
    switch (llms.model) {
        case "aliQwen2_5" :
            return await RequestAnswerFromAliQwen2_5(question, renderAnswer);
        case "codegeex-4":
            return await RequestAnswerFromCodeGeex(question, renderAnswer);
        case "aliQwenPlus" :
            return await RequestAnswerFromQwenPlus(question, renderAnswer);

        case "aliQwenMax" :
            return await RequestAnswerFromQwenMax(question, renderAnswer);

        case  "aliQwenQwQ32B"    :
            return await RequestAnswerFromQwenQwQ32B(question, renderAnswer);


        case "Siliconflow-Qwen2.5" :
            return await RequestAnswerFromSiliconflowQwen(question, renderAnswer);


        case "Deepseek-Chat" :
            return await RequestAnswerFromDeepSeek(question, renderAnswer);


        case "kimi-moonshot-v1-auto" :
            return await RequestAnswerFromKiMi(question, renderAnswer);


        case "doubao-1.5-lite-32k" :
            return await RequestAnswerFromDoubaoLite(question, renderAnswer);


        case "doubao-deepseek" :
            return await RequestAnswerFromDoubaoDeepseek(question, renderAnswer);


        case "doubao-1.5-pro-32k" :
            return await RequestAnswerFromDoubaoPro(question, renderAnswer);


        default:
            alert("No Found Matched LLM");
            return await RequestAnswerFromQwen(question, renderAnswer)
    }

}


export async function RequestAnswerFromQwen
(question: string, renderAnswer ?: (answer: string) => void) {
    const result = "# 没有找到匹配的大模型接口";
    if (renderAnswer) {
        renderAnswer(result);
    }
    return result;
}

export async function RequestAnswerFromLLMTest
(question: string, renderAnswer ?: (answer: string) => void) {
    const response = await fetch('/api/llm/codegeex', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question}),
        keepalive: true
    });
    if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, {stream: true});
        result += chunk;
        if (renderAnswer) {
            renderAnswer(chunk);
        }
    }
    return result;
}


