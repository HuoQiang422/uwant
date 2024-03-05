import { Layout, Menu, Skeleton, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUpdateEffect, useWindowSize } from "react-use";
import HeaderLeft from "../components/layout/headerLeft";
import HeaderRight from "../components/layout/headerRight";
import KeepLiveTabs from "../components/layout/keepLiveTabs";
import LogoArea from "../components/layout/logoArea";
import ContainerCard from "../components/public/containerCard";
import FloatArea from "../components/public/floatArea";
import MyMacScrollbar from "../components/public/myMacScrollbar";
import MySpin from "../components/public/mySpin";
import { MenuRedux } from "../redux/menu";
import { SettingsProps, setSiderOpenState } from "../redux/settings";
import {
	findMenuItemById,
	findMenuOpenKeys,
	generateIcon,
} from "../utils/findMenu";

const { useToken } = theme;

export default function HomeLayout() {
	const { token } = useToken();
	const dispatch = useDispatch();
	const items = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.siderMenu
	);
	const siderOpen = useSelector(
		(state: { settings: SettingsProps }) => state.settings.siderOpen
	);
	const layoutType = useSelector(
		(state: { settings: SettingsProps }) => state.settings.layoutType
	);
	const theme = useSelector(
		(state: { settings: SettingsProps }) => state.settings.theme
	);
	const siderWidth = useSelector(
		(state: { settings: SettingsProps }) => state.settings.siderWidth
	);
	const showKeepAliveTabs = useSelector(
		(state: { settings: SettingsProps }) => state.settings.showKeepAliveTabs
	);
	const navigator = useNavigate();
	const location = useLocation();
	const currentKey = findMenuOpenKeys(items, location.pathname);
	const { width } = useWindowSize();
	const [lastWidth, setLastWidth] = useState(window.innerWidth + 1);

	//调整antv的宽度
	useUpdateEffect(() => {
		const e = new Event("resize", { bubbles: true, cancelable: true });
		window.dispatchEvent(e);
	}, [siderOpen]);

	//优化控制sider的展开和收缩
	useEffect(() => {
		if (!localStorage.getItem("siderOpen")) {
			if (width >= 768) {
				dispatch(setSiderOpenState(true));
			} else {
				dispatch(setSiderOpenState(false));
			}
		}
		if (width < lastWidth) {
			if (width < 768) dispatch(setSiderOpenState(false));
		} else {
			if (width >= 768) {
				if (localStorage.getItem("siderOpen") === "true") {
					dispatch(setSiderOpenState(true));
				}
			}
		}
		setLastWidth(width);
	}, [width]);

	return (
		<>
			<Layout>
				{layoutType === "top-down" ? (
					<Header
						id="layout-header"
						className=" all-white overflow-hidden select-none flex justify-between items-center px-4 h-12 shadow z-10"
						style={{ backgroundColor: token.colorPrimary }}
					>
						<HeaderLeft />
						<HeaderRight />
					</Header>
				) : null}
				<Layout className="flex-1 overflow-hidden">
					<Sider
						theme={theme}
						trigger={null}
						collapsible
						collapsed={!siderOpen}
						width={siderWidth}
						collapsedWidth={60} //为了缩起来的列表图标居中展示
						className=" border-r border-gray-200 *:flex *:flex-col"
					>
						{layoutType === "left-right" ? (
							<div
								className={`flex box-border flex-col w-full ${
									theme === "dark" ? "all-white" : "all-dark"
								} mt-4 mb-2 ${siderOpen ? "px-4" : "px-1"} transition-all`}
							>
								<LogoArea showText={siderOpen} />
							</div>
						) : null}
						<MyMacScrollbar>
							<Skeleton
								loading={items!?.length <= 0}
								title={false}
								paragraph={{
									rows: 6,
								}}
								className="px-3 py-6"
							>
								<Menu
									theme={theme}
									onClick={(e) => {
										const path = e.keyPath;
										const keyItem = findMenuItemById(items, path[0]);
										const url = keyItem?.url;
										navigator(url);
									}}
									defaultOpenKeys={siderOpen ? currentKey : undefined}
									selectedKeys={currentKey}
									mode="inline"
									className=" border-none"
									items={generateIcon(items)}
								/>
							</Skeleton>
						</MyMacScrollbar>
					</Sider>
					<Content>
						{layoutType === "left-right" ? (
							<Header
								id="layout-header"
								className={`all-dark overflow-hidden select-none flex justify-between items-center px-4 h-12 shadow z-10 border-b border-gray-200`}
								style={{ backgroundColor: `white` }}
							>
								<HeaderLeft showLogoArea={false} />
								<HeaderRight />
							</Header>
						) : null}
						<Layout className="h-full">
							{/* 缓存路由展示 */}
							{showKeepAliveTabs ? (
								<div className="flex flex-none items-center bg-white w-full h-11 px-2 border-b border-gray-200">
									<KeepLiveTabs />
								</div>
							) : null}
							<MyMacScrollbar id="layout-content">
								<Content className=" grid grid-cols-1 p-3 min-h-full">
									<ContainerCard className="flex min-h-full">
										<Suspense fallback={<MySpin />}>
											<Outlet />
										</Suspense>
									</ContainerCard>
								</Content>
							</MyMacScrollbar>
							{/* 悬浮按钮区域 */}
							<FloatArea />
						</Layout>
					</Content>
				</Layout>
			</Layout>
		</>
	);
}
