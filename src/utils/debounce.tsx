import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { RequestParams } from "./request";

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 防抖延迟时间
 * @returns {Function} - 新的防抖函数
 */
export const debounceNoProgress = (func: Function, delay: number) => {
	let timer: any = null;
	return (...args: [RequestParams]) => {
		clearTimeout(timer);
		return new Promise((resolve, reject) => {
			timer = setTimeout(async () => {
				try {
					const result = await func(...args);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, delay);
		});
	};
};

/**
 * 防抖函数带进度条功能，进度条会在函数执行完成后自动关闭
 * @param {Function} func - 需要防抖的函数
 * @param {number} delay - 防抖延迟时间
 * @returns {Function} - 新的带进度条功能的防抖函数
 */
export const debounce = (func: Function, delay: number) => {
	let timer: any = null;
	return (...args: [RequestParams]) => {
		nProgress.start();
		clearTimeout(timer);
		return new Promise((resolve, reject) => {
			timer = setTimeout(async () => {
				try {
					const result = await func(...args);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, delay);
		});
	};
};
