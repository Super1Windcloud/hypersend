import {v4 as uuidv4} from 'uuid';


export async function renderQuestionTemplate() {
    try {
        const content = await fetch('question.md');
        if (content.ok) {
            return await content.text();
        } else {
            alert('请求失败')
        }
    } catch (err) {
        console.error(err);
    }
}

export async function renderAnswerTemplate() {
    try {
        const content = await fetch('fastify.md');
        if (content.ok) {
            return await content.text();
        } else {
            alert('请求失败');
            return;
        }
    } catch (err) {
        console.error(err);
    }
}


export function getRandomNumber(): string {
    return uuidv4();
}


// Leecode  https://imgfans.com/_Yoyxl/download
//   newcode   https://imgfans.com/_rK9s4/download
// 使用服务端会更快
export async function getOcrResult(url: string) {
    // CDN 导入直接通过全局变量 Tesseract 来使用
    //@ts-ignore
    const worker = await Tesseract.createWorker();
    const {data: {text}} = await worker.recognize(url);
    console.log(text);
    await worker.terminate();
    return text as string;
}


export function isBase64(str: string) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}


export async function getImageFormat(blob: Blob) {
    const reader = new FileReader();
    // 读取前几个字节
    const buffer = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        // 读取前8个字节
        reader.readAsArrayBuffer(blob.slice(0, 8));
    }) as any;

    const view = new DataView(buffer);
    if (view.getUint8(0) === 0x42 && view.getUint8(1) === 0x4D) {
        return 'BMP';
    }
    if (
        view.getUint8(0) === 0x89 &&
        view.getUint8(1) === 0x50 &&
        view.getUint8(2) === 0x4E &&
        view.getUint8(3) === 0x47 &&
        view.getUint8(4) === 0x0D &&
        view.getUint8(5) === 0x0A &&
        view.getUint8(6) === 0x1A &&
        view.getUint8(7) === 0x0A
    ) {
        return 'PNG';
    }

    if (view.getUint8(0) === 0xFF && view.getUint8(1) === 0xD8 && view.getUint8(2) === 0xFF) {
        return 'JPEG';
    }
    return '未知格式';
}

export function flatten(arr: number[] | number[][]) {
    return arr
        .toString()
        .split(',')
        .map(item => +item);
}

export function int(num: number) {
    return num > 0 ? Math.floor(num) : Math.ceil(num);
}

export function clip(data: number, min: number, max: number) {
    return data < min ? min : data > max ? max : data;
}

export function b64Encode(str: string) {
    const te = new TextEncoder();
    const buffer = te.encode(str);
    return btoa(String.fromCharCode(...buffer));
}

export function b64Decode(data: string) {
    const bin = atob(data);
    const arr: number[] = [];
    for (let i = 0; i < bin.length; i++) {
        arr.push(bin.charCodeAt(i));
    }
    const td = new TextDecoder();
    return td.decode(Uint8Array.from(arr));
}

