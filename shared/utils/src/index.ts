/**
 * ERP Lite Micro-Frontend System - Shared Utility Functions
 * 纯函数工具，不依赖任何框架
 */

import type { PermissionCode } from '@erp-lite/types';

/**
 * 金额格式化
 * @param amount 金额数值
 * @param currency 货币符号，默认 ''
 * @returns 格式化后的金额字符串，如 "1,234.56"
 * @example
 * formatMoney(1234.56) // "1,234.56"
 * formatMoney(1234.56, '¥') // "¥1,234.56"
 */
export function formatMoney(amount: number, currency = ''): string {
  const formatted = amount.toFixed(2);
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return currency + parts.join('.');
}

/**
 * 日期格式化
 * @param date 日期对象、时间戳或日期字符串
 * @param pattern 格式模式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(2024, 0, 1, 12, 30, 45)) // "2024-01-01 12:30:45"
 * formatDate(new Date(2024, 0, 1), 'YYYY-MM-DD') // "2024-01-01"
 */
export function formatDate(
  date: Date | string | number,
  pattern = 'YYYY-MM-DD HH:mm:ss',
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return pattern
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 数字千分位格式化
 * @param num 数字
 * @returns 格式化后的数字字符串
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 权限校验 - 检查是否拥有指定权限
 * @param permissions 用户权限列表
 * @param code 权限码
 * @returns 是否拥有该权限
 */
export function hasPermission(permissions: PermissionCode[], code: PermissionCode): boolean {
  return permissions.includes(code);
}

/**
 * 权限校验 - 检查是否拥有任一权限
 * @param permissions 用户权限列表
 * @param codes 权限码数组
 * @returns 是否拥有任一权限
 */
export function hasAnyPermission(permissions: PermissionCode[], codes: PermissionCode[]): boolean {
  return codes.some(code => permissions.includes(code));
}

/**
 * 权限校验 - 检查是否拥有所有权限
 * @param permissions 用户权限列表
 * @param codes 权限码数组
 * @returns 是否拥有所有权限
 */
export function hasAllPermission(permissions: PermissionCode[], codes: PermissionCode[]): boolean {
  return codes.every(code => permissions.includes(code));
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 深度克隆对象
 * @param obj 需要克隆的对象
 * @returns 克隆后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

/**
 * 生成随机 ID
 * @param prefix ID 前缀
 * @returns 随机 ID 字符串
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 文件扩展名（包含点号）
 * @example
 * getFileExtension('test.txt') // '.txt'
 * getFileExtension('test.min.js') // '.js'
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length > 1) {
    return `.${parts.pop()}`.toLowerCase();
  }
  return '';
}
