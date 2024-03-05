import {
	CloseOutlined,
	DeleteOutlined,
	DeleteRowOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Tabs, TabsProps, theme } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuRedux, setKeepAliveTabs } from "../../redux/menu";
import { findMenuItemById, findMenuOpenKeys } from "../../utils/findMenu";

const { useToken } = theme;

export default function KeepLiveTabs() {
	const { token } = useToken();
	const dispatch = useDispatch();
	const keepAliveTabs = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.keepAliveTabs
	);
	const databaseMenu = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.databaseMenu
	);
	const location = useLocation();
	const navigator = useNavigate();

	useEffect(() => {
		getRouterPage();
	}, [location]);

	function getOpenKeys() {
		const pathname = location.pathname;
		if (pathname !== "/") {
			return findMenuOpenKeys(databaseMenu, pathname);
		} else {
			return [];
		}
	}

	function getRouterPage() {
		const key = getOpenKeys()[0];
		const item = findMenuItemById(databaseMenu, key);
		if (key) {
			const isExits = keepAliveTabs?.some(
				(item: any) => String(item.key) === key
			);
			if (!isExits) {
				addTabs(item);
			}
		}
	}

	function addTabs(item: any) {
		const newkeepAliveTabs = keepAliveTabs ? [...keepAliveTabs] : []; // 添加keepAliveTabs变量的检查，并根据情况赋值空数组
		newkeepAliveTabs.push({
			key: String(item.id),
			label: item.name,
			url: item.url,
		});
		dispatch(setKeepAliveTabs(newkeepAliveTabs));
	}

	function removeTabs(clickItem: any) {
		const newkeepAliveTabs = keepAliveTabs ? [...keepAliveTabs] : [];
		const currentIndex = newkeepAliveTabs.findIndex(
			(item) => String(item.key) === clickItem.key
		);
		if (currentIndex !== -1) {
			newkeepAliveTabs.splice(currentIndex, 1);
			dispatch(setKeepAliveTabs(newkeepAliveTabs));

			const nextIndex =
				currentIndex < newkeepAliveTabs.length
					? currentIndex
					: currentIndex - 1;
			if (nextIndex >= 0) {
				navigator(newkeepAliveTabs[nextIndex].url);
			}
		}
	}

	function renderKeepLiveTabsItem(keepAliveTabs: TabsProps["items"]) {
		if (keepAliveTabs && keepAliveTabs?.length > 0) {
			return keepAliveTabs.map((item: any) => {
				const items =
					keepAliveTabs.length > 1
						? [
								{
									key: "closeNow",
									label: "关闭当前页",
									icon: <CloseOutlined />,
									onClick: () => {
										removeTabs(item);
									},
								},
								{
									key: "closeOther",
									label: "关闭其他页",
									icon: <DeleteRowOutlined />,
									onClick: () => {
										const currentTab = keepAliveTabs.find(
											(tab: any) => tab.key === item.key
										);
										navigator(item.url);
										dispatch(setKeepAliveTabs([currentTab]));
									},
								},
								{
									key: "closeAll",
									label: "关闭全部页",
									icon: <DeleteOutlined />,
									onClick: () => {
										dispatch(setKeepAliveTabs([]));
										navigator("/"); // 导航到第一页
									},
								},
						  ]
						: [];

				return {
					...item,
					label: (
						<Dropdown menu={{ items }} trigger={["contextMenu"]}>
							<div
								className=" relative flex items-center min-h-7"
								style={{
									backgroundColor:
										item.key === getOpenKeys()[0]
											? token.controlItemBgActive
											: "",
								}}
							>
								<div
									onClick={() => {
										navigator(item.url);
									}}
									className="px-8"
								>
									{item.label}
								</div>
								<Button
									style={{ display: keepAliveTabs.length > 1 ? "" : "none" }}
									className=" absolute"
									type="text"
									onClick={() => {
										removeTabs(item);
									}}
									size="small"
									icon={<CloseOutlined />}
								/>
							</div>
						</Dropdown>
					),
				};
			});
		} else {
			return [];
		}
	}

	return (
		<div className=" overflow-auto">
			<Tabs
				activeKey={getOpenKeys()[0]}
				className="segmented-tabs"
				items={renderKeepLiveTabsItem(keepAliveTabs)}
				indicator={{ size: 0 }}
			/>
		</div>
	);
}
