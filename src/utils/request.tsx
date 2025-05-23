import axios from "axios";
import { debounce } from "lodash";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { message } from "../components/public/myMessage";
import {
	abortController,
	newAbortController,
} from "../components/public/signal";
import { errMsgMapping, warningMsgMapping } from "../config/errMsg";
import { transformJsonToFormData } from "./transformData";

export interface RequestParams {
	url: string;
	data?: object | FormData;
	token?: string;
	responseType?: "blob" | "arraybuffer" | "json" | "text";
}

const alertedMsgs = new Set();
let timerId: any;

//防抖消息提示
const requestMsg = debounce(
	(msg: string, type: "success" | "error" | "warning") => {
		if (alertedMsgs.has(msg)) {
			return;
		}
		message[type](msg);
		alertedMsgs.add(msg);
		clearTimeout(timerId);
		timerId = setTimeout(() => {
			alertedMsgs.clear();
		}, 200); // 设置一个合适的时间，比如 2 秒
	},
	200
);

// 统一的请求函数
const request = async (
	url: string,
	config: any,
	token?: string,
	responseType?: string
) => {
	try {
		// 添加 Authorization 请求头，携带 token
		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `${token}`,
			};
		}

		config.signal = abortController.signal;
		if (responseType) config.responseType = responseType;

		const res = await axios(url, config);

		const contentType = res.headers["content-type"]; // 获取Content-Type头部

		//获取code值
		const code = res.data.code || res.data.errorCode;

		//获取消息提示
		const msg =
			typeof res.data.content === "string" && res.data.content.trim() !== ""
				? res.data.content
				: res.data.msg ||
				  res.data.message ||
				  res.data.errorMessage ||
				  res.data.errorMessge ||
				  res.data.errorMsg;

		//如果token失效
		if (code === 401) {
			message.error(msg);
			localStorage.clear();
			await abortController.abort();
			newAbortController();
			nProgress.done();
			setTimeout(() => {
				window.location.href = "/login";
			}, 1000);
			return;
		}

		//处理json、text类型的数据
		if (
			contentType.includes("application/json") ||
			contentType.includes("text/plain")
		) {
			if (res.data) {
				if (code === 200) {
					if (msg && msg !== "成功" && msg !== "失败") {
						requestMsg(msg, "success");
					}
				} else {
					if (msg) {
						requestMsg(msg, "error");
					}
					throw msg;
				}
			}

			nProgress.done();
			return res.data;
		} else {
			//处理blob
			nProgress.done();
			return res;
		}
	} catch (error: any) {
		// 出现异常时，隐藏进度条并提示内部错误信息
		nProgress.done();
		if (typeof error === "object") {
			if (errMsgMapping[error.code]) {
				requestMsg(errMsgMapping[error.code], "error");
			} else if (warningMsgMapping[error.code]) {
				if (localStorage.getItem("token")) {
					requestMsg(warningMsgMapping[error.code], "warning");
				}
			} else {
				requestMsg(error.message, "error");
			}
		}
		throw error;
	}
};

//GET请求函数
export const get = (props: RequestParams) => {
	nProgress.start();
	const { url, data, token, responseType } = props;
	let queryString = "";
	if (data) {
		queryString = Object.entries(data)
			.map(
				([key, value]) =>
					`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
			)
			.join("&");
	}
	return request(
		`${url}${queryString ? `?${queryString}` : ""}`,
		{
			data: data,
			method: "GET",
		},
		token,
		responseType
	);
};

//POST请求函数
export const post = (props: RequestParams) => {
	nProgress.start();
	const { url, data, token, responseType } = props;
	return request(
		url,
		{
			data: data,
			method: "POST",
		},
		token,
		responseType
	);
};

export const put = (props: RequestParams & { id?: string | number }) => {
	nProgress.start();
	const { url, data, token, responseType, id } = props;
  
	// 调试信息
	console.log("put 请求的 id 值：", id);
  
	// 验证 id 是否有效
	if (id === undefined || id === null) {
	  console.error("PUT 请求缺少 id 参数！");
	  nProgress.done();
	  return Promise.reject("PUT 请求缺少 id 参数！");
	}
  
	// 构建 URL，保持 ID 为字符串
	const finalUrl = `${url}?id=${id}`;
  
	console.log("最终请求的 URL：", finalUrl);
  
	return request(
	  finalUrl,
	  {
		data: data,
		method: "PUT",
	  },
	  token,
	  responseType
	);
  };
  
  export const del = (props: RequestParams & { id: string | number }) => {
	nProgress.start();
	const { url, id, token, responseType } = props;
  
	// 调试信息
	console.log("delete 请求的 id 值：", id);
  
	// 验证 id 是否有效
	if (id === undefined || id === null || isNaN(Number(id))) {
	  console.error("DELETE 请求缺少有效的 id 参数！");
	  nProgress.done();
	  return Promise.reject("DELETE 请求缺少有效的 id 参数！");
	}
  
	// 构建 FormData
	const formData = transformJsonToFormData({ id });
  
	// 发起请求
	return request(
	  url,
	  {
		data: formData,
		method: "DELETE",
	  },
	  token,
	  responseType
	);
  };
  
  
  
  
