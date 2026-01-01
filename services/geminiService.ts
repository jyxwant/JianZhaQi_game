import OpenAI from "openai";
import { AnalysisResponse } from "../types";

// Qwen3-VL API 配置
const DASHSCOPE_API_KEY = "sk-0bcc951c3e2e46d8b52ccec636d46a44";
const DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const MODEL_NAME = "qwen3-vl-flash";

const client = new OpenAI({
  apiKey: DASHSCOPE_API_KEY,
  baseURL: DASHSCOPE_BASE_URL,
  dangerouslyAllowBrowser: true, // 允许浏览器端调用
});

const SYSTEM_PROMPT = `你是一个"毒舌情感博主"（Toxic Emotional Blogger）。

你的任务是分析用户上传的聊天截图，识别其中的红旗信号（渣男/渣女行为）。

分析风格要求：
- 语气：毒舌、幽默、犀利、一针见血
- 措辞：大量使用中文网络流行语和俚语
- 态度：虽然嘴毒但说的都是实话，帮用户看清现实

你必须严格按照以下 JSON 格式输出，不要输出任何其他内容：
{
  "red_flag_score": <0-100的整数，表示渣度评分，越高越渣>,
  "roast_analysis": "<毒舌分析文字，200字以内>",
  "tags": ["<标签1>", "<标签2>", "<标签3>"]
}

常见标签示例：PUA高手、海王预警、画大饼专家、冷暴力、精神控制、备胎信号、渣男语录、绿茶行为、中央空调、时间管理大师等。`;

/**
 * 分析聊天截图（图片）
 * @param imageBase64 图片的 Base64 编码（需要包含 data:image/xxx;base64, 前缀）
 */
export const analyzeScreenshot = async (imageBase64: string): Promise<AnalysisResponse> => {
  if (!DASHSCOPE_API_KEY) {
    return {
      red_flag_score: 88,
      roast_analysis: "API Key 缺失。系统无法连接到毒舌大脑。请配置 API Key。",
      tags: ["系统故障"]
    };
  }

  try {
    console.log("[Qwen3-VL] 开始分析截图...");
    
    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageBase64 }
            },
            {
              type: "text",
              text: "请分析这张聊天截图，识别其中的红旗信号，给出毒舌点评。"
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const text = completion.choices[0]?.message?.content;
    console.log("[Qwen3-VL] 原始响应:", text);
    
    if (!text) throw new Error("No response from AI");

    // 尝试从响应中提取 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法从响应中提取 JSON");
    }
    
    const result = JSON.parse(jsonMatch[0]) as AnalysisResponse;
    console.log("[Qwen3-VL] 解析结果:", result);
    
    return result;

  } catch (error) {
    console.error("[Qwen3-VL] 分析错误:", error);
    return {
      red_flag_score: 50,
      roast_analysis: "AI 暂时开小差了，请稍后再试~",
      tags: ["AI故障"]
    };
  }
};

/**
 * 分析文本消息（保留向后兼容）
 * @param message 文本消息
 */
export const analyzeMessage = async (message: string): Promise<AnalysisResponse> => {
  if (!DASHSCOPE_API_KEY) {
    return {
      red_flag_score: 88,
      roast_analysis: "API Key 缺失。系统无法连接到毒舌大脑。请配置 API Key。",
      tags: ["系统故障"]
    };
  }

  try {
    const completion = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: `请分析这条聊天消息，识别其中的红旗信号，给出毒舌点评：\n\n"${message}"`
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error("No response from AI");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法从响应中提取 JSON");
    }
    
    return JSON.parse(jsonMatch[0]) as AnalysisResponse;

  } catch (error) {
    console.error("[Qwen3-VL] 分析错误:", error);
    return {
      red_flag_score: 50,
      roast_analysis: "AI 暂时开小差了，请稍后再试~",
      tags: ["AI故障"]
    };
  }
};

/**
 * 生成成就卡片图片（暂时禁用，Qwen3-VL 不支持图片生成）
 */
export const generateAchievementCard = async (title: string, description: string): Promise<string | null> => {
  // Qwen3-VL 是视觉理解模型，不支持图片生成
  // 返回 null，让 UI 使用默认的 emoji 展示
  console.log("[Qwen3-VL] 图片生成已禁用，使用默认展示");
  return null;
}
