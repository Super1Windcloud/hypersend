export async function RequestAnswerFromCodeGeex
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/codegeex', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromAliQwen2_5
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/qwen2_5', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromQwenPlus
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/qwen_plus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromQwenMax
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/qwen_max', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromQwenQwQ32B
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/qwen_qwq32b', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromSiliconflowQwen
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/siliconflow_qwen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}


export async function RequestAnswerFromDeepSeek
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/deepseek', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromKiMi
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/kimi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromDoubaoLite
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/doubao_lite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromDoubaoPro
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/doubao_pro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}

export async function RequestAnswerFromDoubaoDeepseek
(question: string, renderAnswer ?: (answer: string) => void) {

    const response = await fetch('/api/llm/doubao_deepseek', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            , 'Connection': 'keep-alive'
        },
        body: JSON.stringify({question})
        , keepalive: true

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
            // console.log("Chunk received: " + chunk);
            renderAnswer(result);
        }
    }
    return result;

}