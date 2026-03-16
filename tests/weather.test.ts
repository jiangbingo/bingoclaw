/**
 * 天气技能测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock 天气数据
const mockWeatherData = {
  current_condition: [{
    temp_C: '25',
    FeelsLikeC: '27',
    humidity: '65',
    windspeedKmph: '15',
    lang_zh_cn: [{ value: '晴' }],
    weatherDesc: [{ value: 'Clear' }]
  }],
  weather: [{
    mintempC: '20',
    maxtempC: '28',
    astronomy: [{
      sunrise: '06:30 AM',
      sunset: '06:45 PM'
    }]
  }]
};

// 模拟天气技能处理器
async function weatherHandler(content: string): Promise<string> {
  // 改进的正则表达式：贪婪匹配城市名，直到字符串结尾
  const cityMatch = content.toLowerCase().match(/天气\s+(.+)/);
  const city = cityMatch ? cityMatch[1].trim() : '北京';
  
  const weather = await getWeather(city);
  return weather;
}

async function getWeather(city: string): Promise<string> {
  const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
  
  if (!response.ok) {
    throw new Error('无法获取天气数据');
  }
  
  const data = await response.json();
  const current = data.current_condition[0];
  
  return `🌤️ ${city} 天气

🌡️ 温度: ${current.temp_C}°C (体感 ${current.FeelsLikeC}°C)
💧 湿度: ${current.humidity}%
💨 风速: ${current.windspeedKmph} km/h
☁️ 天气: ${current.lang_zh_cn?.[0]?.value || current.weatherDesc[0].value}

📅 今日预报:
  最低 ${data.weather[0].mintempC}°C
  最高 ${data.weather[0].maxtempC}°C
  日出 ${data.weather[0].astronomy[0].sunrise}
  日落 ${data.weather[0].astronomy[0].sunset}`;
}

describe('天气技能', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('命令解析', () => {
    it('应该解析城市名', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气 上海');
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('上海'));
      expect(result).toContain('上海');
    });

    it('应该使用默认城市（北京）当未指定时', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气');
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('北京'));
      expect(result).toContain('北京');
    });

    it('应该处理多个空格', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气   广州');
      const calledUrl = mockFetch.mock.calls[0][0];
      expect(calledUrl).toContain(encodeURIComponent('广州'));
    });
  });

  describe('天气数据获取', () => {
    it('应该返回格式化的天气信息', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气 北京');
      
      expect(result).toContain('北京 天气');
      expect(result).toContain('温度: 25°C');
      expect(result).toContain('体感 27°C');
      expect(result).toContain('湿度: 65%');
      expect(result).toContain('风速: 15 km/h');
      expect(result).toContain('晴');
    });

    it('应该包含今日预报信息', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气 北京');
      
      expect(result).toContain('今日预报');
      expect(result).toContain('最低 20°C');
      expect(result).toContain('最高 28°C');
      expect(result).toContain('日出 06:30 AM');
      expect(result).toContain('日落 06:45 PM');
    });

    it('应该优先使用中文天气描述', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      const result = await weatherHandler('天气 北京');
      expect(result).toContain('晴');
      expect(result).not.toContain('Clear');
    });

    it('应该回退到英文描述当中文不可用时', async () => {
      const dataWithoutZh = {
        ...mockWeatherData,
        current_condition: [{
          ...mockWeatherData.current_condition[0],
          lang_zh_cn: null
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => dataWithoutZh
      });

      const result = await weatherHandler('天气 北京');
      expect(result).toContain('Clear');
    });
  });

  describe('错误处理', () => {
    it('应该处理网络错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      });

      await expect(weatherHandler('天气 北京')).rejects.toThrow('无法获取天气数据');
    });

    it('应该处理无效城市名', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_condition: [],
          weather: []
        })
      });

      // 这个测试应该抛出错误，因为数据结构不完整
      await expect(weatherHandler('天气 无效城市123')).rejects.toThrow();
    });

    it('应该处理超时', async () => {
      mockFetch.mockImplementationOnce(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(weatherHandler('天气 北京')).rejects.toThrow();
    });
  });

  describe('URL 编码', () => {
    it('应该正确编码城市名', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      await weatherHandler('天气 北京');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('北京'))
      );
    });

    it('应该处理包含空格的城市名', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      await weatherHandler('天气 New York');
      const calledUrl = mockFetch.mock.calls[0][0];
      // city 被转为小写：'new york' -> encodeURIComponent -> 'new%20york'
      expect(calledUrl).toContain('new%20york');
    });

    it('应该处理特殊字符', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherData
      });

      await weatherHandler('天气 São Paulo');
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('数据完整性', () => {
    it('应该处理缺失的可选字段', async () => {
      const incompleteData = {
        current_condition: [{
          temp_C: '25',
          FeelsLikeC: '25',
          humidity: '60',
          windspeedKmph: '10',
          weatherDesc: [{ value: 'Clear' }]
        }],
        weather: [{
          mintempC: '20',
          maxtempC: '30',
          astronomy: [{
            sunrise: '06:00 AM',
            sunset: '07:00 PM'
          }]
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => incompleteData
      });

      const result = await weatherHandler('天气 北京');
      expect(result).toContain('温度: 25°C');
      expect(result).toContain('Clear');
    });
  });
});
