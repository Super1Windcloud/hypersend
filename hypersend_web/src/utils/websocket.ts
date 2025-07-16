import {UnwrapNestedRefs} from "vue";

type EventType = "open" | "message" | "close" | "error";
type EventCallback = (data?: any) => void;

export class WebSocketService {
    private socket: WebSocket | null = null;
    private url: string;
    private listeners: Record<EventType, EventCallback[]> = {
        open: [],
        message: [],
        close: [],
        error: [],
    };

    constructor(url: string) {
        this.url = url;
    }

    // 建立 WebSocket 连接
    public connect(): void {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener("open", (event) => {
            this.emit("open", event);
        });

        this.socket.addEventListener("message", (event) => {
            this.emit("message", event.data);
        });

        this.socket.addEventListener("close", (event) => {
            this.emit("close", event);
        });

        this.socket.addEventListener("error", (event) => {
            this.emit("error", event);
        });
    }

    // 关闭 WebSocket 连接
    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    // 发送消息
    public send(data: string | ArrayBuffer | Blob): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    // 监听事件
    public on(event: EventType, callback: EventCallback): void {
        this.listeners[event].push(callback);
    }

    // 移除事件监听
    public off(event: EventType, callback: EventCallback): void {
        this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }

    // 触发事件
    private emit(event: EventType, data?: any): void {
        this.listeners[event].forEach((callback) => callback(data));
    }
}


const ws = new WebSocketService('ws://192.168.1.222:33333/ws');

export function establishWSConnection(messageObj: UnwrapNestedRefs<{
    textMessage: string;
    file: { prototype: Blob; new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob };
    folder: { prototype: Blob; new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob };
    clipboard: string
}> & {}): void {
    ws.on('open', () => {
        console.log('前端 WebSocket connection established.');
    });
    ws.on('message', (data: string) => {
        let dataJson: {
            type: string,
            data: string | Base64URLString, fileName?: string
        } = JSON.parse(data);
        if (dataJson.type === 'text') {
            console.log(`Received message: ${dataJson.data}`);
            messageObj.textMessage = dataJson.data;
        } else if (dataJson.type === 'base64') {
            let fileName = dataJson?.fileName;
            console.log('收到文件:', fileName);
            const binaryString = atob(dataJson?.data);
            const uint8ArrayBuffer = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8ArrayBuffer[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([uint8ArrayBuffer], {type: 'application/octet-stream'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = fileName || 'unknown_file';
            a.style.display = 'none';
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
    ws.on('close', () => {
        console.log('前端 WebSocket connection closed.');
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
    ws.connect();
}

export function closeWSConnection() {
    ws.disconnect();
}

export function sendMessage(message: string) {
    ws.send(message);
}


