/**
 * 国际化工具函数 - 基于 Intl API
 */

// 支持的语言映射
const LOCALE_MAP: Record<string, string> = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW', 
  'en': 'en-US',
  'ja': 'ja-JP',
  'ko': 'ko-KR',
  'es': 'es-ES',
  'fr': 'fr-FR',
  'de': 'de-DE',
  'ru': 'ru-RU',
};

/**
 * 获取标准化的 locale 字符串
 */
function getStandardLocale(locale: string): string {
  return LOCALE_MAP[locale] || 'zh-CN';
}

/**
 * 格式化数字
 * @param value 数字值
 * @param locale 语言代码
 * @param options Intl.NumberFormat 选项
 */
export function formatNumber(
  value: number,
  locale: string = 'zh-CN',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    return new Intl.NumberFormat(standardLocale, options).format(value);
  } catch (error) {
    console.warn('formatNumber error:', error);
    return value.toString();
  }
}

/**
 * 格式化货币
 * @param value 金额
 * @param locale 语言代码
 * @param currency 货币代码，默认根据语言自动选择
 * @param options Intl.NumberFormat 选项
 */
export function formatCurrency(
  value: number,
  locale: string = 'zh-CN',
  currency?: string,
  options?: Intl.NumberFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    
    // 根据语言自动选择货币
    if (!currency) {
      const currencyMap: Record<string, string> = {
        'zh-CN': 'CNY',
        'zh-TW': 'TWD',
        'en-US': 'USD',
        'ja-JP': 'JPY',
        'ko-KR': 'KRW',
        'es-ES': 'EUR',
        'fr-FR': 'EUR',
        'de-DE': 'EUR',
        'ru-RU': 'RUB',
      };
      currency = currencyMap[standardLocale] || 'CNY';
    }
    
    return new Intl.NumberFormat(standardLocale, {
      style: 'currency',
      currency,
      ...options,
    }).format(value);
  } catch (error) {
    console.warn('formatCurrency error:', error);
    return `${currency || '¥'}${value.toFixed(2)}`;
  }
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param locale 语言代码
 * @param options Intl.DateTimeFormat 选项
 */
export function formatDate(
  date: Date | number | string,
  locale: string = 'zh-CN',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    const dateObj = typeof date === 'number' ? new Date(date) : 
                   typeof date === 'string' ? new Date(date) : date;
    
    return new Intl.DateTimeFormat(standardLocale, options).format(dateObj);
  } catch (error) {
    console.warn('formatDate error:', error);
    return new Date(date).toLocaleDateString();
  }
}

/**
 * 格式化相对时间（如 "2小时前"）
 * @param date 日期对象或时间戳
 * @param locale 语言代码
 * @param options Intl.RelativeTimeFormat 选项
 */
export function formatRelativeTime(
  date: Date | number | string,
  locale: string = 'zh-CN',
  options?: Intl.RelativeTimeFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    const dateObj = typeof date === 'number' ? new Date(date) : 
                   typeof date === 'string' ? new Date(date) : date;
    
    const rtf = new Intl.RelativeTimeFormat(standardLocale, options);
    const now = new Date();
    const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
    
    // 计算时间差
    const intervals = [
      { unit: 'year' as const, seconds: 31536000 },
      { unit: 'month' as const, seconds: 2592000 },
      { unit: 'day' as const, seconds: 86400 },
      { unit: 'hour' as const, seconds: 3600 },
      { unit: 'minute' as const, seconds: 60 },
      { unit: 'second' as const, seconds: 1 },
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
      if (count >= 1) {
        return rtf.format(diffInSeconds > 0 ? count : -count, interval.unit);
      }
    }
    
    return rtf.format(0, 'second');
  } catch (error) {
    console.warn('formatRelativeTime error:', error);
    return '刚刚';
  }
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @param locale 语言代码
 * @param options Intl.NumberFormat 选项
 */
export function formatFileSize(
  bytes: number,
  locale: string = 'zh-CN',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    const formattedNumber = new Intl.NumberFormat(standardLocale, {
      maximumFractionDigits: unitIndex === 0 ? 0 : 1,
      ...options,
    }).format(size);
    
    return `${formattedNumber} ${units[unitIndex]}`;
  } catch (error) {
    console.warn('formatFileSize error:', error);
    return `${bytes} B`;
  }
}

/**
 * 格式化百分比
 * @param value 数值（0-1 或 0-100）
 * @param locale 语言代码
 * @param options Intl.NumberFormat 选项
 */
export function formatPercent(
  value: number,
  locale: string = 'zh-CN',
  options?: Intl.NumberFormatOptions
): string {
  try {
    const standardLocale = getStandardLocale(locale);
    // 如果值大于1，认为是百分比形式，需要除以100
    const normalizedValue = value > 1 ? value / 100 : value;
    
    return new Intl.NumberFormat(standardLocale, {
      style: 'percent',
      ...options,
    }).format(normalizedValue);
  } catch (error) {
    console.warn('formatPercent error:', error);
    return `${(value * 100).toFixed(1)}%`;
  }
}

