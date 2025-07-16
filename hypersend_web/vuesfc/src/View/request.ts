export  async function RequestAnswerFromLLMTest
(question , renderAnswer  ) {
    const response = await fetch('/api/llm/codegeex', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({question})
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
            console.log(chunk);
            renderAnswer(result );
        }
    }
    return result;
}
