import { Empty, Input, Tree } from "antd";
import { useEffect, useState } from "react";
import { useUpdateEffect } from "react-use";
import { stringArrAddOrDeleteText } from "../../utils/controllerUtils";
import { searchItemsFromArray } from "../../utils/findMenu";
import MyMacScrollbar from "./myMacScrollbar";
import MySpin from "./mySpin";

interface MyTreeProps {
	data?: any[];
	checkedKeys?: any[];
	onChecked?: (e: string[]) => void;
	loading?: boolean;
	macScroll?: boolean;
	showSearch?: boolean;
	searchPlaceholder?: string;
	multiple?: boolean;
	checkStrictly?: boolean;
	checkable?: boolean;
}

export default function MyTree(props: MyTreeProps) {
	const {
		data = [],
		checkedKeys,
		onChecked,
		loading = false,
		macScroll = true,
		showSearch = true,
		searchPlaceholder = "筛选",
		multiple = true,
		checkStrictly = true,
		checkable = true,
	} = props;
	const [treeShowData, setTreeShowData] = useState<any[]>(data);
	const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 保存展开的节点
	const [selectedKeys, setSelectKeys] = useState<string[]>([]);

	function filterData(e: any) {
		const content = e.target.value;
		const searchResult = searchItemsFromArray(data, content);
		setTreeShowData(searchResult);
		// 根据搜索结果设置展开的节点
		getExpandedKeys(searchResult);
	}

	function getExpandedKeys(data: any[]) {
		const keys: string[] = [];
		const traverse = (arr: any[]) => {
			for (const item of arr) {
				if (item.children && item.children.length > 0) {
					keys.push(item.key.toString());
					traverse(item.children);
				}
			}
		};
		traverse(data);
		setExpandedKeys(keys); // 设置展开的节点
	}

	useEffect(() => {
		setTreeShowData(data);
		getExpandedKeys(data);
	}, [data]);

	useUpdateEffect(() => {
		const arr = stringArrAddOrDeleteText(checkedKeys as string[], selectedKeys);
		if (onChecked) onChecked(arr);
	}, [selectedKeys]);

	function treeArea() {
		return loading ? (
			<MySpin text="加载中..." />
		) : treeShowData.length > 0 ? (
			<Tree
				disabled={loading}
				multiple={multiple}
				treeData={treeShowData}
				checkStrictly={checkStrictly}
				checkable={checkable}
				selectedKeys={[]}
				checkedKeys={checkedKeys}
				onSelect={(e: any) => {
					if (onChecked) {
						setSelectKeys(e);
					}
				}}
                blockNode
				onCheck={(e: any) => {
					if (onChecked) onChecked(e.checked);
				}}
				expandedKeys={expandedKeys} // 设置展开的节点
				onExpand={(keys: React.Key[]) => setExpandedKeys(keys as string[])} // 更新展开的节点
			/>
		) : (
			<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
		);
	}

	return (
		<>
			{showSearch ? (
				<div className="px-6 py-4">
					<Input
						placeholder={searchPlaceholder}
						onChange={filterData}
						allowClear
					/>
				</div>
			) : null}
			{macScroll ? (
				<div className="flex-1 overflow-scroll">
					<MyMacScrollbar className={showSearch ? "px-6" : "px-6 pt-4"}>
						{treeArea()}
					</MyMacScrollbar>
				</div>
			) : (
				<div className={showSearch ? "px-6" : "px-6 pt-4"}>{treeArea()}</div>
			)}
		</>
	);
}
