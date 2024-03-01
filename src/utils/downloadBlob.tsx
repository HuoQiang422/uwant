import saveAs from "file-saver";

export const download = (res: any) => {
	const disposition = res.headers["content-disposition"]; // 获取Content-Disposition头部

	let fileName = "export"; // 默认文件名

	if (disposition) {
		const match = disposition.match(/filename="?(.+?)"?$/); // 提取文件名和后缀信息
		if (match && match.length >= 2) {
			fileName = decodeURIComponent(match[1]);
		}
	}
	// 创建blob对象，解析流数据
	const blob = new Blob([res.data], {
		// 设置返回的文件类型
		// type: 'application/pdf;charset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
		type: res.headers["Content-Type"],
	}); // 这里就是创建一个a标签，等下用来模拟点击事件

	saveAs(blob, fileName);
};
