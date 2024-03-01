/**
 * @description 用于终止请求的控制器
 */
export var abortController = new AbortController();

export function newAbortController() {
	abortController = new AbortController();
}

export function abort() {
	abortController.abort();
	newAbortController();
}
