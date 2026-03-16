/**
 * 翻译技能测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 模拟翻译技能处理器
async function translateHandler(content: string): Promise<string> {
  // 改进的正则表达式：支持 "translate 文本" 和 "translate to 语言 文本"
  const match = content.match(/(?:翻译|translate)\s+(?:to\s+(\w+)\s+)?(.+)/is);
  
  if (!match) {
    return `翻译技能使用方法：

1. 中译英: "翻译 你好世界"
2. 英译中: "translate Hello World"
3. 指定语言: "翻译 to ja 你好" (日语)

支持语言：
- en: 英语
- zh: 中文
- ja: 日语
- ko: 韩语
- fr: 法语
- de: 德语
- es: 西班牙语`;
  }
  
  const targetLang = match[1] || 'auto';
  const text = match[2].trim();
  
  const result = await translateText(text, targetLang);
  return result;
}

async function translateText(text: string, targetLang: string): Promise<string> {
  const langPair = targetLang === 'auto' 
    ? (isChinese(text) ? 'zh|en' : 'en|zh')
    : `${isChinese(text) ? 'zh' : 'en'}|${targetLang}`;
  
  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`
  );
  
  if (!response.ok) {
    throw new Error('翻译服务暂时不可用');
  }
  
  const data = await response.json();
  
  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || '翻译失败');
  }
  
  return `🌐 翻译结果

原文: ${text}
译文: ${data.responseData.translatedText}

📊 置信度: ${data.responseData.confidence || 'N/A'}`;
}

function isChinese(text: string): boolean {
  return /[\u4e00-\u9fa5]/.test(text);
}

describe('翻译技能', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('命令解析', () => {
    it('应该返回帮助信息当没有参数时', async () => {
      const result = await translateHandler('翻译');
      expect(result).toContain('翻译技能使用方法');
      expect(result).toContain('中译英');
      expect(result).toContain('英译中');
    });

    it('应该解析中文翻译命令', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'Hello World',
            confidence: 0.9
          }
        })
      });

      const result = await translateHandler('翻译 你好世界');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C')
      );
      expect(result).toContain('Hello World');
    });

    it('应该解析英文翻译命令', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: '你好世界',
            confidence: 0.85
          }
        })
      });

      const result = await translateHandler('translate Hello World');
      expect(result).toContain('你好世界');
    });

    it('应该解析指定目标语言的翻译命令', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'こんにちは',
            confidence: 0.8
          }
        })
      });

      const result = await translateHandler('翻译 to ja 你好');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('langpair=zh|ja')
      );
      expect(result).toContain('こんにちは');
    });
  });

  describe('语言检测', () => {
    it('应该正确检测中文', () => {
      expect(isChinese('你好')).toBe(true);
      expect(isChinese('世界')).toBe(true);
      expect(isChinese('Hello')).toBe(false);
      expect(isChinese('123')).toBe(false);
    });

    it('应该为中文文本选择正确的语言对', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'Hello',
            confidence: 0.9
          }
        })
      });

      await translateHandler('翻译 你好');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('langpair=zh|en')
      );
    });

    it('应该为英文文本选择正确的语言对', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: '你好',
            confidence: 0.9
          }
        })
      });

      await translateHandler('translate Hello World');
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toMatch(/langpair=en\|zh/);
    });
  });

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(translateHandler('翻译 你好')).rejects.toThrow('翻译服务暂时不可用');
    });

    it('应该处理 API 错误响应', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 500,
          responseDetails: 'Translation failed'
        })
      });

      await expect(translateHandler('翻译 你好')).rejects.toThrow('Translation failed');
    });

    it('应该处理未知错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 500,
          responseDetails: null
        })
      });

      await expect(translateHandler('翻译 你好')).rejects.toThrow('翻译失败');
    });
  });

  describe('输出格式', () => {
    it('应该包含原文和译文', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'Hello World',
            confidence: 0.9
          }
        })
      });

      const result = await translateHandler('翻译 你好世界');
      expect(result).toContain('原文: 你好世界');
      expect(result).toContain('译文: Hello World');
    });

    it('应该包含置信度信息', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'Hello',
            confidence: 0.95
          }
        })
      });

      const result = await translateHandler('翻译 你好');
      expect(result).toContain('置信度: 0.95');
    });

    it('应该处理缺少置信度的情况', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          responseStatus: 200,
          responseData: {
            translatedText: 'Hello',
            confidence: null
          }
        })
      });

      const result = await translateHandler('翻译 你好');
      expect(result).toContain('置信度: N/A');
    });
  });
});
