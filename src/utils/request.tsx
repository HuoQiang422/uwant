import axios from "axios";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { message } from "../components/common/myMessage";
import { errMsgMapping, warningMsgMapping } from "../config/errMsg";
import { abortController, newAbortController } from "../controller/signal";

export interface RequestParams {
	url: string;
	data?: object | FormData;
	token?: string;
}

let messageOpen: boolean = true;

// 统一的请求函数
const request = async (url: string, config: any, token?: string) => {
	try {
		// 添加 Authorization 请求头，携带 token
		if (token) {
			config.headers = {
				...config.headers,
				Authorization: `${token}`,
			};
		}

		config.signal = abortController.signal;

		const res = await axios(url, config);
		const contentType = res.headers["content-type"]; // 获取Content-Type头部

		//如果token失效
		if (res.data.code === 401) {
			message.error(res.data.message);
			localStorage.clear()
			await abortController.abort();
			newAbortController();
			nProgress.done();
			setTimeout(() => {
				window.location.href = "/login";
			}, 1000);
			return;
		}

		if (
			contentType.includes("application/json") ||
			contentType.includes("text/plain")
		) {
			if (res.data) {
				const errorMessage =
					typeof res.data.content === "string" && res.data.content.trim() !== ""
						? res.data.content
						: res.data.msg ||
						  res.data.message ||
						  res.data.errorMessge ||
						  res.data.errorMsg;

				if (res.data.code && res.data.code !== 200) {
					if (errorMessage) {
						message.error(errorMessage);
					}
					throw errorMessage;
				} else if (res.data.code && res.data.code === 200) {
					if (errorMessage !== "成功" && errorMessage !== "失败") {
						message.success(errorMessage);
					}
				}
			}

			nProgress.done();
			return res.data;
		} else {
			nProgress.done();
			return res;
		}
	} catch (error: any) {
		// 出现异常时，隐藏进度条并提示内部错误信息
		nProgress.done();
		if (messageOpen) {
			if (typeof error === "object") {
				if (errMsgMapping[error.code]) {
					message.error(errMsgMapping[error.code]);
				} else if (warningMsgMapping[error.code]) {
					if (localStorage.getItem("token")) {
						message.warning(warningMsgMapping[error.code]);
					}
				} else {
					message.error(error.message);
				}
			}
		}
		messageOpen = false;
		setTimeout(() => {
			messageOpen = true;
		}, 300);
		throw error;
	}
};

//GET请求函数
export const get = (props: RequestParams) => {
	nProgress.start();
	const { url, data, token } = props;
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
		token
	);
};

//POST请求函数
export const post = (props: RequestParams) => {
	nProgress.start();
	const { url, data, token } = props;
	return request(
		url,
		{
			data: data,
			method: "POST",
		},
		token
	);
};
