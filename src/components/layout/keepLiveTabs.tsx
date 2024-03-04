import { CloseOutlined } from "@ant-design/icons";
import { Button, Tabs, TabsProps } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MenuRedux, setKeepAliveTabs } from "../../redux/menu";
import { findMenuItemById, findMenuOpenKeys } from "../../utils/findMenu";

export default function KeepLiveTabs() {
	const dispatch = useDispatch();
	const items = useSelector(
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
		return findMenuOpenKeys(databaseMenu, pathname);
	}
	function getRouterPage() {
		const openKeys = getOpenKeys();
		const key = openKeys[0];
		const item = findMenuItemById(databaseMenu, key);
		if (key) {
			const isExits = items?.some((item: any) => String(item.key) === key);
			if (!isExits) {
				addTabs(item);
			}
		}
	}

	function addTabs(item: any) {
		const newItems = items ? [...items] : []; // 添加items变量的检查，并根据情况赋值空数组
		newItems.push({
			key: String(item.id),
			label: item.name,
			url: item.url,
		});
		dispatch(setKeepAliveTabs(newItems));
	}

	function removeTabs(clickItem: any) {
		const newItems = items ? [...items] : []; // 添加items变量的检查，并根据情况赋值空数组
		newItems.splice(
			newItems.findIndex((item) => String(item.key) === clickItem.key),
			1
		);
		dispatch(setKeepAliveTabs(newItems));
		if (clickItem.url === location.pathname) {
			navigator(newItems[newItems.length - 1].url);
		}
	}

	function renderKeepLiveTabsItem(items: TabsProps["items"]) {
		if (items && items?.length > 0) {
			return items.map((item: any) => {
				return {
					...item,
					label: (
						<div className=" relative">
							<div
								onClick={() => {
									navigator(item.url);
								}}
								className="px-8"
							>
								{item.label}
							</div>
							<Button
								style={{ display: items.length > 1 ? "" : "none" }}
								className=" absolute"
								type="text"
								onClick={() => {
									removeTabs(item);
								}}
								size="small"
								icon={<CloseOutlined />}
							/>
						</div>
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
				items={renderKeepLiveTabsItem(items)}
				indicator={{ size: 0 }}
			/>
		</div>
	);
}
