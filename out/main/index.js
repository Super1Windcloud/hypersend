import { dialog, app as app$1, ipcMain, BrowserWindow, shell, Tray, Menu } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import os from "os";
import fs, { readFileSync, writeFileSync } from "fs";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { Monitor } from "node-screenshots";
import fastifyCors from "@fastify/cors";
import { createWorker } from "tesseract.js";
import * as ocr from "esearch-ocr";
import * as ort from "onnxruntime-node";
import { createImageData, createCanvas } from "canvas";
import Ocr from "@gutenye/ocr-node";
import * as ocr_api20210707 from "@alicloud/ocr-api20210707";
import ocr_api20210707__default from "@alicloud/ocr-api20210707";
import * as $OpenApi from "@alicloud/openapi-client";
import * as $Util from "@alicloud/tea-util";
import dotenv from "dotenv";
import clipboardy from "clipboardy";
import { readFile } from "fs/promises";
import OpenAI from "openai";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
function exist(path2) {
  if (fs.existsSync(path2)) return path2;
  else return null;
}
function devLog(...args) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  let address = [];
  for (const name of Object.keys(interfaces)) {
    devLog(name);
    if (name.includes("WLAN") || name.includes("Mihomo")) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          address.push([name, iface.address]);
        }
      }
    }
  }
  if (address.length > 0) {
    return address;
  }
  return "未找到可用的 IP 地址";
}
function getLocalWlanIPAddress() {
  const interfaces = os.networkInterfaces();
  let address = [];
  for (const name of Object.keys(interfaces)) {
    devLog(name);
    if (name.includes("WLAN")) {
      for (const iface of interfaces[name]) {
        if (iface.family === "IPv4" && !iface.internal) {
          address.push({ "WLAN": iface.address });
        }
      }
    }
  }
  if (address.length > 0) {
    if (!Array.isArray(address)) {
      return [];
    }
    if (address.every((item) => typeof item !== "object")) {
      return address;
    }
    if (address.every((item) => typeof item === "object")) {
      let arr = address.map((item) => item["WLAN"]);
      return arr.length > 1 ? arr : arr[0];
    }
    return address;
  }
  return "未找到可用的 IP 地址";
}
async function checkPort(port) {
  const net = require2("net");
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(true);
      } else {
        reject(err);
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}
async function killProcessByPort(port) {
  const { exec } = require2("child_process");
  return new Promise((resolve, reject) => {
    exec(`lsof -i :${port}`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        return;
      }
      const lines = stdout.split("\n");
      if (lines.length > 1) {
        const pid = lines[1].split(/\s+/)[1];
        exec(`kill -9 ${pid}`, (err2, stdout2, stderr2) => {
          if (err2) {
            reject(err2);
          } else {
            resolve();
          }
        });
      } else {
        reject(new Error("No process found using the port"));
      }
    });
  });
}
async function checkAndKillPort(port) {
  try {
    const isPortInUse = await checkPort(port);
    if (isPortInUse) {
      devLog(`Port ${port} is in use. Attempting to kill the process...`);
      await killProcessByPort(port);
      devLog(`Process using port ${port} has been killed.`);
    } else {
      devLog(`Port ${port} is not in use.`);
    }
  } catch (err) {
    console.error("Error: fuck ", err);
  }
}
function captureScreenMonitorToPNG() {
  let monitor = Monitor.fromPoint(100, 100);
  devLog(monitor, monitor?.id);
  let image = monitor?.captureImageSync();
  if (!image) {
    console.error("No image captured");
    return;
  }
  let dir = `img`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(`img/${monitor?.id}-sync.png`, image.toPngSync());
  let monitors = Monitor.all();
  monitors.forEach((capturer) => {
    devLog({
      id: capturer.id,
      x: capturer.x,
      y: capturer.y,
      width: capturer.width,
      height: capturer.height,
      rotation: capturer.rotation,
      scaleFactor: capturer.scaleFactor,
      isPrimary: capturer.isPrimary
    });
  });
  return image.toPngSync();
}
async function getOcrTesseractResult(image) {
  const worker = await createWorker(["eng", "chi_sim"], 1, {
    logger: (m) => console.log(m)
    // Add logger here
  });
  const ret = await worker.recognize(image);
  devLog(ret.data.text);
  await worker.terminate();
  return ret.data.text;
}
async function getOcrEsearchResult(imgCanvas) {
  try {
    let det = process.cwd() + "\\esearch\\ppocr_det.onnx";
    let rec = process.cwd() + "\\esearch\\ppocr_rec.onnx";
    console.log(det, rec);
    let ppocr_keys_path = join(process.cwd(), "esearch/ppocr_keys_v1.txt");
    let ppocr_keys = readFileSync(ppocr_keys_path, "utf-8");
    let ocrObj = await ocr.init({
      detPath: det,
      recPath: rec,
      dic: ppocr_keys,
      detRatio: 0.75,
      ort,
      canvas: (w, h) => createCanvas(w, h),
      imageData: createImageData
    });
    ocrObj.ocr(imgCanvas).then((result) => {
      console.log(result.src);
      const tl = result.parragraphs.map((i) => i.text);
      console.log(tl.join("\n"));
    }).catch((e) => {
      console.error(e);
    });
  } catch (error) {
    console.error("Error in getOcrEsearchResult:", error);
    throw error;
  }
}
async function getPaddleOcrResult(img) {
  let det, rec, key;
  if (process.env.NODE_ENV === "development") {
    det = process.cwd() + "\\esearch\\ppocr_det.onnx";
    rec = process.cwd() + "\\esearch\\ppocr_rec.onnx";
    key = process.cwd() + "\\esearch\\ppocr_keys_v1.txt";
  } else {
    det = path.join(process.cwd(), "resources", "app.asar.unpacked", "esearch", "ppocr_det.onnx");
    rec = path.join(process.cwd(), "resources", "app.asar.unpacked", "esearch", "ppocr_rec.onnx");
    key = path.join(process.cwd(), "resources", "app.asar.unpacked", "esearch", "ppocr_keys_v1.txt");
  }
  let ocr2;
  writeFileSync("log.txt", det + "\n" + rec + "\n" + key + "\n");
  try {
    ocr2 = await Ocr.create({
      models: {
        defaultDetectionPath: det,
        defaultRecognitionPath: rec,
        dictionaryPath: key
      },
      isDebug: false,
      debugOutputDir: "./outputLog"
    });
  } catch (error) {
    console.error("Error in getPaddleOcrResult:", error);
    throw error + "\n 模型路径" + det;
  }
  const result = await ocr2.detect(img);
  let text = result.map(({ text: text2 }) => text2).join("\n");
  devLog(text);
  return text;
}
async function blobUrlToBuffer(blobUrl) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return Buffer.from(await blob.arrayBuffer());
}
dotenv.config();
class AliOcrClient {
  static createClient() {
    let id = process.env["ALIBABA_CLOUD_ACCESS_KEY_ID"];
    let secret = process.env["ALIBABA_CLOUD_ACCESS_KEY_SECRET"];
    let config = new $OpenApi.Config({
      accessKeyId: id,
      accessKeySecret: secret,
      endpoint: `ocr-api.cn-hangzhou.aliyuncs.com`
    });
    return new ocr_api20210707__default(config);
  }
  static async run(url, blob) {
    let client = AliOcrClient.createClient();
    let recognizeDocumentStructureRequest = new ocr_api20210707.RecognizeDocumentStructureRequest({
      noStamp: false,
      url,
      blob,
      paragraph: true,
      useNewStyleOutput: true,
      page: false
    });
    let runtime = new $Util.RuntimeOptions({});
    try {
      let response = await client.recognizeDocumentStructureWithOptions(
        recognizeDocumentStructureRequest,
        runtime
      );
      let data = response.body?.data;
      return data ?? "";
    } catch (error) {
      console.log(error.message);
      console.log(error.data["Recommend"]);
      return error.message;
    }
  }
}
function envPrint() {
  devLog(process.env.ZhiPu);
  devLog(process.env.DeepSeek);
  devLog(process.env.Siliconflow);
  devLog(process.env.DouBao);
  devLog(process.env.Kimi);
  devLog(process.env.ALI_QWEN_QWQ);
}
async function SiliconflowServices(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.Siliconflow,
    baseURL: "https://api.siliconflow.cn/v1",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-Coder-32B-Instruct",
      messages: [
        {
          role: "assistant",
          content: "你是一个代码助手,帮我解决算法问题"
        },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}
async function DoubaoServices(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "doubao-1.5-lite-32k-250115",
      messages: [
        { role: "system", content: "你是一个代码助手 帮我解决算法问题" },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      stream: true
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("调用备用豆包接口:", error);
    let result = await DoubaoServicesBackup(question);
    return result;
  }
}
async function DoubaoServicesBackup(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: "https://ark.cn-beijing.volces.com/api/v3/",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "doubao-1.5-pro-32k-250115",
      messages: [
        { role: "assistant", content: "你是一个代码助手 帮我解决算法问题" },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      stream: true
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("豆包模型全部相应失败:", error);
  }
}
async function DoubaoServicesDeepSeek(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.DouBao,
    baseURL: "https://ark.cn-beijing.volces.com/api/v3/",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "ep-20250224214614-qvpgg",
      messages: [
        {
          role: "system",
          content: "你是一个代码助手,帮我解答算法代码题"
        },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      stream: true
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}
async function KimiServices(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.Kimi,
    baseURL: "https://api.moonshot.cn/v1",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "moonshot-v1-auto",
      messages: [
        {
          role: "system",
          content: "你是一个代码助手,帮我解答算法代码题"
        },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      stream: true
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}
async function ZhiPuServices(question, onData) {
  const client = new OpenAI({
    apiKey: process.env.ZhiPu,
    baseURL: "https://open.bigmodel.cn/api/paas/v4/",
    dangerouslyAllowBrowser: true
  });
  try {
    const response = await client.chat.completions.create({
      model: "codegeex-4",
      messages: [
        {
          role: "system",
          content: "你是一个代码助手,帮我解答算法代码题 "
        },
        {
          role: "user",
          content: question ?? "牛顿迭代"
        }
      ],
      stream: true,
      top_p: 0.7,
      temperature: 0.9,
      max_tokens: 2e3,
      stop: ["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
    });
    let result = "";
    for await (const chunk of response) {
      if (chunk.choices && chunk.choices.length > 0) {
        const responseText = chunk.choices[0].delta?.content;
        if (responseText) {
          result += responseText;
          if (onData) {
            onData(responseText);
          }
        }
      }
    }
    return result;
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}
async function DeepSeekApiServices(question, onData) {
  const deepSeekApp = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DeepSeek,
    dangerouslyAllowBrowser: true
  });
  const completion = await deepSeekApp.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful Code  assistant." },
      { role: "user", content: question ?? "牛顿迭代" }
    ],
    model: "deepseek-chat",
    stream: true
  });
  let result = "";
  for await (const chunk of completion) {
    if (chunk.choices && chunk.choices.length > 0) {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText) {
        result += responseText;
        if (onData) {
          onData(responseText);
        }
      }
    }
  }
  return result;
}
async function aliQwenQwQ32B(question, onData) {
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    dangerouslyAllowBrowser: true
  });
  let reasoningContent = "";
  let answerContent = "";
  let isAnswering = false;
  try {
    const stream = await ali.chat.completions.create({
      model: "qwq-32b",
      messages: [
        { role: "system", content: "你是一个代码助手,帮我解答算法代码题" },
        { role: "user", content: question ?? "牛顿迭代" }
      ],
      stream: true
    });
    console.log("\n" + "=".repeat(20) + "思考过程" + "=".repeat(20) + "\n");
    for await (const chunk of stream) {
      if (!chunk.choices?.length) {
        console.log("\nUsage:");
        console.log(chunk.usage);
        continue;
      }
      const delta = chunk.choices[0].delta;
      if (delta.reasoning_content) {
        reasoningContent += delta.reasoning_content;
        if (onData) {
          onData(delta.reasoning_content);
        }
      } else if (delta.content) {
        if (!isAnswering) {
          console.log("\n" + "=".repeat(20) + " " + "=".repeat(20) + "\n");
          isAnswering = true;
        }
        answerContent += delta.content;
        if (onData) {
          onData(delta.content);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function aliQwen2_5(question, onData) {
  const qwen = new OpenAI({
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.ALI_QWEN_QWQ,
    dangerouslyAllowBrowser: true
  });
  const completion = await qwen.chat.completions.create({
    messages: [
      { role: "system", content: "你是一个代码助手,帮我解答算法代码题" },
      { role: "user", content: question ?? "牛顿迭代" }
    ],
    model: "qwen2.5-14b-instruct-1m",
    stream: true
  });
  let result = "";
  for await (const chunk of completion) {
    if (chunk.choices && chunk.choices.length > 0) {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText) {
        result += responseText;
        if (onData) {
          onData(responseText);
        }
      }
    }
  }
  return result;
}
async function aliQwenPlus(question, onData) {
  const ali = new OpenAI({
    apiKey: process.env.ALI_QWEN_QWQ,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    dangerouslyAllowBrowser: true
  });
  let reasoningContent = "";
  let answerContent = "";
  let isAnswering = false;
  try {
    const stream = await ali.chat.completions.create({
      model: "qwq-plus",
      messages: [
        { role: "system", content: "你是一个代码助手,帮我解答算法代码题" },
        { role: "user", content: question ?? "牛顿迭代" }
      ],
      stream: true
    });
    console.log("\n" + "=".repeat(20) + "思考过程" + "=".repeat(20) + "\n");
    for await (const chunk of stream) {
      if (!chunk.choices?.length) {
        console.log("\nUsage:");
        console.log(chunk.usage);
        continue;
      }
      const delta = chunk.choices[0].delta;
      if (delta.reasoning_content) {
        reasoningContent += delta.reasoning_content;
        if (onData) {
          onData(delta.reasoning_content);
        }
      } else if (delta.content) {
        if (!isAnswering) {
          console.log("\n" + "=".repeat(20) + " " + "=".repeat(20) + "\n");
          isAnswering = true;
        }
        answerContent += delta.content;
        if (onData) {
          onData(delta.content);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
async function aliQwenMax(question, onData) {
  const qwen = new OpenAI({
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    apiKey: process.env.ALI_QWEN_QWQ,
    dangerouslyAllowBrowser: true
  });
  const completion = await qwen.chat.completions.create({
    messages: [
      { role: "system", content: "你是一个代码助手,帮我解答算法代码题" },
      { role: "user", content: question ?? "牛顿迭代" }
    ],
    model: "qwen-max-2025-01-25",
    stream: true
  });
  let result = "";
  for await (const chunk of completion) {
    if (chunk.choices && chunk.choices.length > 0) {
      const responseText = chunk.choices[0].delta?.content;
      if (responseText) {
        result += responseText;
        if (onData) {
          onData(responseText);
        }
      }
    }
  }
  return result;
}
async function FreeQwenServices(question, onData, llms = [aliQwen2_5, aliQwenPlus, aliQwenMax, aliQwenQwQ32B]) {
  let randomNum = Math.floor(Math.random() * llms.length);
  if (randomNum < 0 || randomNum >= llms.length) return Error("randomNum 异常错误");
  console.warn(randomNum);
  try {
    return await llms[randomNum](question, onData);
  } catch (err) {
    console.warn(`LLM ${randomNum} 返回错误: ${err.message}`);
    const remainingLLMs = llms.filter((_, index) => index !== randomNum);
    return FreeQwenServices(question, onData, remainingLLMs);
  }
}
async function RandomLLMServices(question, onData, llms = [
  aliQwenQwQ32B,
  SiliconflowServices,
  DeepSeekApiServices,
  ZhiPuServices,
  KimiServices,
  DoubaoServices,
  DoubaoServicesDeepSeek,
  DoubaoServicesBackup
]) {
  let randomNum = Math.floor(Math.random() * llms.length);
  if (randomNum < 0 || randomNum >= llms.length) return Error("randomNum 异常错误");
  console.warn(randomNum);
  try {
    return await llms[randomNum](question, onData);
  } catch (err) {
    console.warn(`LLM ${randomNum} 返回错误: ${err.message}`);
    const remainingLLMs = llms.filter((_, index) => index !== randomNum);
    return RandomLLMServices(question, onData, remainingLLMs);
  }
}
let app = null;
let wsClients = /* @__PURE__ */ new Set();
async function createFastifyApp() {
  app = fastify({ logger: true }).withTypeProvider();
  app.register(fastifyStatic, {
    root: path.join(app$1.getAppPath(), "public/dist-vite"),
    prefix: "/"
  });
  app.register(require2("@fastify/websocket"), {
    options: { maxPayload: 1048576 }
  });
  app.register(require2("@fastify/http-proxy"), {
    upstream: "http://localhost:33333",
    prefix: "/api",
    // optional
    http2: false
    // optional
  });
  app.register(fastifyCors, {
    origin: "*",
    // 允许所有域名跨域访问
    methods: ["GET", "POST", "PUT", "DELETE"],
    // 允许的 HTTP 方法
    allowedHeaders: ["Content-Type", "Authorization"]
    // 允许的请求头
  });
  app.get("/", async (request, reply) => {
    try {
      await reply.sendFile("./vite.html");
    } catch (err) {
      reply.status(500).send("Internal Server Error");
    }
  });
  app.register(async function(fastify2) {
    fastify2.get("/ws", { websocket: true }, async (socket, req) => {
      socket.on("message", (message) => {
        socket.send("hi from server");
      });
      socket.on("close", () => {
        wsClients.delete(socket);
        console.log("监听服务已断开 WebSocket");
      });
      console.log("监听服务已连接 WebSocket");
      wsClients.add(socket);
    });
  });
  app.post("/llm/qwen", async (request, reply) => {
    reply.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
    reply.raw.setHeader("Transfer-Encoding", "chunked");
    reply.raw.flushHeaders();
    const { question } = request.body;
    try {
      let result = await FreeQwenServices(question, (chunk) => {
        reply.raw.write(chunk);
        process.stdout.write(chunk);
      });
      reply.raw.end();
    } catch (error) {
      console.error("Error:", error);
      reply.raw.write("Error: Something went wrong\n");
      reply.raw.end();
      reply.status(500).send("Internal Server Error");
    }
  });
  app.post("/llm/random", async (request, reply) => {
    reply.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
    reply.raw.setHeader("Transfer-Encoding", "chunked");
    reply.raw.flushHeaders();
    const { question } = request.body;
    try {
      let result = await RandomLLMServices(question, (chunk) => {
        reply.raw.write(chunk);
        process.stdout.write(chunk);
      });
      reply.raw.end();
    } catch (error) {
      console.error("Error:", error);
      reply.raw.write("Error: Something went wrong\n");
      reply.raw.end();
      reply.status(500).send("Internal Server Error");
    }
  });
  app.post("/llm/codegeex", async (request, reply) => {
    reply.raw.setHeader("Content-Type", "text/plain; charset=utf-8");
    reply.raw.setHeader("Transfer-Encoding", "chunked");
    reply.raw.flushHeaders();
    const { question } = request.body;
    try {
      let result = await ZhiPuServices(question, (chunk) => {
        reply.raw.write(chunk);
        process.stdout.write(chunk);
      });
      reply.raw.end();
    } catch (error) {
      console.error("Error:", error);
      reply.raw.write("Error: Something went wrong\n");
      reply.raw.end();
      reply.status(500).send("Internal Server Error");
    }
  });
  app.get("/json", async (request, reply) => {
    await reply.send({ message: "Hello, World!" });
  });
  app.post("/ocr/ali", async (request, reply) => {
    try {
      let { url } = request.body;
      let ocrStr = await AliOcrClient.run(url);
      await reply.send(ocrStr);
    } catch (err) {
      console.error(err);
      reply.status(500).send("ocr ali router Internal Server Error");
    }
  });
  app.post("/ocr/tesseract", async (request, reply) => {
    try {
      let { url } = request.body;
      let ocrStr = await getOcrTesseractResult(url);
      await reply.send(ocrStr);
    } catch (err) {
      console.error(err);
      reply.status(500).send("ocr  tesseract router Internal Server Error");
    }
  });
  app.post("/ocr/esearch", async (request, reply) => {
    try {
      let { url } = request.body;
      let ocrStr = await getOcrEsearchResult(url);
      await reply.send(ocrStr);
    } catch (err) {
      console.error(err);
      reply.status(500).send("ocr  esearchOcr   router Internal Server Error");
    }
  });
  app.post("/ocr/paddleOcr", async (request, reply) => {
    try {
      let { url } = request.body;
      let buffer = await blobUrlToBuffer(url);
      let ocrStr = await getPaddleOcrResult(buffer);
      await reply.send(ocrStr);
    } catch (err) {
      console.error(err);
      reply.status(500).send("ocr  paddleOcr router Internal Server Error \n" + err);
    }
  });
  app.get("/capture", async (request, reply) => {
    try {
      const image = await captureScreenMonitorToPNG();
      if (!image) {
        console.error("No image captured");
        return;
      }
      await reply.send(image);
    } catch (err) {
      console.error(err);
      reply.status(500).send("request capture router Internal Server Error\n" + err);
    }
  });
  return app;
}
async function startClientServer() {
  envPrint();
  app = app ?? await createFastifyApp();
  await checkAndKillPort(33333);
  app.listen({ port: 33333, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error("FUCK", err);
      process.exit(1);
    }
    devLog(`Client server is running on ${address}  :33333`);
  });
}
function stopClientServer() {
  if (!app) return;
  app.close(() => {
    devLog("Client Server is closed");
    app = null;
  });
}
function sendMessageToClient(message) {
  if (!app || !wsClients.size) return;
  const wsJson = {
    type: "text",
    data: message
  };
  wsClients.forEach((client) => {
    client.send(JSON.stringify(wsJson));
  });
}
async function sendBlobToClient(base64, filePath) {
  if (!app || !wsClients.size) return;
  let name = filePath?.match(/[^/\\]+$/)?.[0] ?? "unknown";
  devLog(name);
  const wsJson = {
    type: "base64",
    data: base64,
    fileName: name
  };
  wsClients.forEach((client) => {
    client.send(JSON.stringify(wsJson));
  });
}
async function sendFileToClient() {
  const defaultDir = process.env.USERPROFILE;
  if (!defaultDir) return;
  try {
    let result = await dialog.showOpenDialog({
      properties: ["openFile"],
      // 只允许选择文件
      filters: [
        { name: "所有文件", extensions: ["*"] }
        // 允许所有类型的文件
      ],
      defaultPath: defaultDir
      // 默认打开用户主目录
    });
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedFilePath = result.filePaths[0];
      devLog("用户选择的文件路径:", selectedFilePath);
      if (!selectedFilePath) return null;
      await sendFileBlobToClient(selectedFilePath);
    }
    return null;
  } catch (err) {
    console.error("选择文件时出错:", err);
    return null;
  }
}
function sendFolderToClient() {
  const folderPath = process.env.USERPROFILE;
  if (!folderPath) {
    console.error("无法获取用户主目录");
    return;
  }
  dialog.showOpenDialog({
    properties: ["openDirectory"]
    // 只允许选择文件夹
  }).then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      const selectedFolderPath = result.filePaths[0];
      devLog("用户选择的目录路径:", selectedFolderPath);
    }
  }).catch((err) => {
    console.error("选择文件夹时出错:", err);
  });
}
function sendClipboardToClient() {
  clipboardy.read().then((text) => {
    devLog(text);
    sendMessageToClient(text);
  }).catch((err) => {
    console.error(err);
  });
}
async function sendFileBlobToClient(filePath) {
  try {
    const fileBuffer = await readFile(filePath);
    const base64 = fileBuffer.toString("base64");
    await sendBlobToClient(base64, filePath);
    devLog("文件已成功发送到前端");
  } catch (error) {
    console.error("读取文件失败:", error);
  }
}
function startListeningRenderer() {
  ipcMain.handle("getLocalIPAddress", async () => {
    return getLocalIPAddress();
  });
  ipcMain.handle("getLocalWlanIP", async () => {
    return getLocalWlanIPAddress();
  });
  ipcMain.on("sendMessage", (event, message) => {
    devLog("ipcmain sendMessage to  client", message);
    sendMessageToClient(message);
  });
  ipcMain.handle("openFile", async () => {
    devLog("ipcmain openFile to  client  port ");
    sendFileToClient();
  });
  ipcMain.handle("openFolder", async () => {
    devLog("ipcmain openFolder to  client  port ");
    sendFolderToClient();
  });
  ipcMain.handle("sendClipboard", async () => {
    devLog("ipcmain sendClipboard to  client  port ");
    sendClipboardToClient();
  });
  ipcMain.on("startServerListener", async () => {
    devLog("ipcmain startServerListener  ");
    await startClientServer();
  });
  ipcMain.on(
    "stopServerListener",
    () => {
      devLog("ipcmain stopServerListener  ");
      stopClientServer();
    }
  );
}
const iconPath = join(__dirname, "../../resources/sky3.jpg");
const ico = join(__dirname, "../../build/sky3.ico");
let mainWindow = null;
let tray = null;
const preloadPath = exist(join(__dirname, "../preload/index.cjs")) ?? exist(join(__dirname, "../preload/index.mjs")) ?? exist(join(__dirname, "../preload/index.js"));
console.error("preloadPath", preloadPath);
function createWindow() {
  mainWindow = new BrowserWindow({
    title: "HyperSend",
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: ico,
    ...process.platform === "linux" ? { icon: ico } : {},
    webPreferences: {
      contextIsolation: true,
      // 禁用上下文隔离
      nodeIntegration: false,
      // 禁用 Node.js 集成
      preload: preloadPath ?? join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  startListeningRenderer();
  mainWindow.on("ready-to-show", () => {
    mainWindow?.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "打开",
      click: () => {
        mainWindow?.show();
      }
    },
    {
      label: "退出",
      click: () => {
        app$1.quit();
      }
    }
  ]);
  tray.setToolTip("HyperSend");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
    }
  });
}
app$1.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app$1.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  app$1.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app$1.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app$1.quit();
  }
});
