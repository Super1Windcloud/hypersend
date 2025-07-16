//@ts-nocheck
import {createWriteStream} from 'fs';
import {promisify} from 'util';
import {pipeline} from 'stream';
import  os from 'os';

const streamPipeline = promisify(pipeline);

export async function download(url: string, filePath: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP 请求失败，状态码: ${response.status}`);
        }
        const fileStream = createWriteStream(filePath);
        await streamPipeline(response.body, fileStream);
    } catch (error) {
        console.error('下载失败:', error);
    }
}


export function getLocalWlanIp(): string {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        if (!devName.includes('WLAN')) continue;
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== "127.0.0.1"
                && !alias.internal) {
                return alias.address;
            }
        }
    }
}


