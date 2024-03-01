import { iconList } from "../components/public/iconList";

//通过id寻找对象
export function findMenuItemById(items: any, id: string | number): any {
	if (!Array.isArray(items)) {
		return null;
	}

	for (const item of items) {
		if (String(item.key) === String(id) || String(item.id) === String(id)) {
			return item;
		}

		if (item.children && item.children.length > 0) {
			const childItem = findMenuItemById(item.children, id);
			if (childItem) {
				return childItem;
			}
		}
	}

	return null;
}

//通过path寻找对象
export function findMenuItemByPath(items: any, path: string | number): any {
	if (!Array.isArray(items)) {
		return null;
	}

	for (const item of items) {
		if (item.url === path || item.path === path) {
			return item;
		}

		if (item.children && item.children.length > 0) {
			const childItem = findMenuItemByPath(item.children, path);
			if (childItem) {
				return childItem;
			}
		}
	}

	return null;
}

//通过path寻找对象的openKeys，用于路由切换时保持展开状态。
export function findMenuOpenKeys(items: any, path: string | number): any[] {
	const openKeys: any[] = [];

	function search(items: any[], targetPath: string | number): boolean {
		for (const item of items) {
			if (
				typeof targetPath === "string"
					? item.url === targetPath.slice(1) || item.url === targetPath
					: item.url === targetPath
			) {
				openKeys.push(String(item.key || item.id));
				return true;
			}

			if (item.children && item.children.length > 0) {
				if (search(item.children, targetPath)) {
					openKeys.push(String(item.key || item.id));
					return true;
				}
			}
		}

		return false;
	}

	search(items, path);
	return openKeys; // 反转数组以满足siderMenu数组key的需求
}

// 生成图标组件的数据结构，用于菜单组件的props。
export function generateIcon(items: any) {
	return items.map((item: any) => {
		const modifiedItem = { ...item };
		if (item.icon) {
			modifiedItem.icon = iconList.find(
				(items) => items.value === item.icon
			)?.label; // 替换为你自己的图标组件
		}
		if (item.children) {
			modifiedItem.children = generateIcon(item.children);
		}
		return modifiedItem;
	});
}

//寻找最大值的某个对象
export function findMaxItem(data: any[], key: string = "number") {
	const maxObj = data.reduce((acc, cur) => {
		if (cur[key] > acc[key]) {
			return cur;
		} else {
			return acc;
		}
	});

	return maxObj;
}

// 将数组中的对象的key转换为数组。
export function getKeysFromArray(arr: any[], key: string = "key") {
	const keysArray = arr.map((obj) => obj[key]);
	return keysArray;
}

//搜索数组对象中的数据
export function searchItemsFromArray(
	items: any[],
	searchValue: string,
	searchFields: string[] = ["label"]
) {
	const searchRecursive = (
		arr: any[],
		search: string,
		parentMatched: boolean = false
	) => {
		const filteredArray: any[] = [];
		for (const item of arr) {
			let matched = false;
			for (const field of searchFields) {
				const fieldValue = item[field];
				if (
					fieldValue &&
					fieldValue.toLowerCase().includes(search.toLowerCase())
				) {
					matched = true;
					break;
				}
			}
			if (matched || parentMatched) {
				const newItem = { ...item };
				if (item.children && Array.isArray(item.children)) {
					newItem.children = searchRecursive(
						item.children,
						search,
						matched || parentMatched
					);
				}
				filteredArray.push(newItem);
			} else if (item.children && Array.isArray(item.children)) {
				const childResults = searchRecursive(
					item.children,
					search,
					parentMatched
				);
				if (childResults.length > 0) {
					const newItem = { ...item };
					newItem.children = childResults;
					filteredArray.push(newItem);
				}
			}
		}
		return filteredArray;
	};

	return searchRecursive(items, searchValue);
}
