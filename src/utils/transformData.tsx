import dayjs from "dayjs";
import { cloneDeep } from "lodash";

// 把json数据转换为formdata数据
export function transformJsonToFormData(jsonData: object) {
	const formData = new FormData();
	// 遍历JSON对象的键值对
	Object.entries(jsonData).forEach(([key, value]) => {
		// 如果值是数组类型，则使用JSON.stringify方法将其转换为字符串
		if (Array.isArray(value)) {
			value = JSON.stringify(value);
		}
		// 将键值对添加到FormData对象中
		formData.append(key, value);
	});

	return formData;
}

//数据id作为key值，返回新数据
export function addKeyById(data: any) {
	return data.map((item: any) => {
		return {
			key: item.id,
			...item,
		};
	});
}

//将多级数组对象中的id由数字转换为字符串
export function transformIdToString(data: any[]) {
	return data.map((item: any) => {
		const newItem: any = {
			...item,
			id: String(item.id),
		};

		if (newItem.children) {
			newItem.children = transformIdToString(newItem.children);
		}

		return newItem;
	});
}

//根据name、status和id生成title、disabled和key
export function transDataForTree(data: any[], key: string = "id") {
	return data.map((item: any) => {
		const newItem: any = {
			title: item.name,
			disabled: item.status === 0,
			key: item[key],
			label: item.name,
			value: item[key],
		};

		if (item.children && item.children.length > 0) {
			newItem.children = transDataForTree(item.children, key);
		}

		return newItem;
	});
}

//根据name、status和id生成label、disabled和value
export function transDataForSelect(data: any[], key: string = "id") {
	return data.map((item: any) => {
		const newItem: any = {
			label: item.name,
			disabled: item.status === 0,
			value: item[key],
		};

		if (item.children && item.children.length > 0) {
			newItem.children = transDataForSelect(item.children, key);
		}

		return newItem;
	});
}

//转换时间
export function transformTime(text: string | number) {
	return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
}

//后台返回的内容生成父子层级
export function buildTree(data: any[]) {
	const idMap: any = {};
	const root: any[] = [];

	const copiedData = cloneDeep(data); // 进行深拷贝

	copiedData.forEach((node) => {
		idMap[node.id] = node;
	});

	copiedData.forEach((node) => {
		const parent = idMap[node.parentId];
		if (parent) {
			(parent.children || (parent.children = [])).push(node);
		} else {
			root.push(node);
		}
	});

	return root;
}

//根据checked属性筛选出checked属性为true的对象，生成新的数组
export function filterArrayByChecked(arr: any[]) {
	let filteredArray: any[] = [];

	arr.forEach(function (obj) {
		if (obj.checked) {
			filteredArray.push(obj);
		}

		if (obj && Array.isArray(obj)) {
			const subArray = filterArrayByChecked(obj);
			filteredArray = filteredArray.concat(subArray);
		}
	});

	return filteredArray;
}

//判断文本是否是连接
export function isURL(text: string) {
	const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
	return urlRegex.test(text);
}

//去除对象空白值
export function removeEmptyValues(obj: any) {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === null || obj[key] === undefined || obj[key] === "") {
			delete obj[key];
		}
	});

	return obj;
}

//将rangePicker的时间数组转为一个开始时间和结束时间的对象
export function transformRangePickerTime(dates: any): {
	startTime: number;
	endTime: number;
} {
	if (dates && dates.length === 2) {
		const startTime = dates[0].startOf("day").unix();
		const endTime = dates[1].endOf("day").unix();
		return { startTime, endTime };
	} else {
		const currentDate = new Date();
		const thirtyDaysAgo = currentDate.getTime() - 30 * 24 * 60 * 60 * 1000;
		return {
			startTime: Math.floor(thirtyDaysAgo / 1000),
			endTime: Math.floor(currentDate.getTime() / 1000),
		};
	}
}

//获取图片文件对象的base64
export const getBase64 = (file: any): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
