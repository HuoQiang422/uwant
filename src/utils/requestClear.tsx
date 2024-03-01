import axios from "axios";
import { message } from "../components/public/myMessage";
import {
	abortController,
	newAbortController,
} from "../components/public/signal";

interface RequestParams {
	url: string;
	data?: object | FormData;
	token?: string;
	responseType?: "blob" | "arraybuffer" | "json" | "text";
}

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

		if (res.status !== 200) {
			return null;
		}

		//如果token失效
		if (res.data.code === 401) {
			message.error(res.data.message);
			localStorage.clear();
			await abortController.abort();
			newAbortController();
			setTimeout(() => {
				window.location.href = "/login";
			}, 1000);
			return;
		}

		if (
			contentType.includes("application/json") ||
			contentType.includes("text/plain")
		) {
			if (res.data.code !== 200) {
				if (res.data.msg || res.data.message) {
					throw res.data.msg || res.data.message;
				}
				throw null;
			}
			return res.data;
		} else {
			return res;
		}
	} catch (error: any) {
		throw error;
	}
};

//GET请求函数
export const getClear = (props: RequestParams) => {
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
export const postClear = (props: RequestParams) => {
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
