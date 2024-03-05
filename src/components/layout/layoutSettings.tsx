import { SettingOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingsProps, setLayoutType, setTheme } from "../../redux/settings";
import MyForm from "../public/myForm";

export default function LayoutSettings() {
	const dispatch = useDispatch();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const layoutType = useSelector(
		(state: { settings: SettingsProps }) => state.settings.layoutType
	);
	const theme = useSelector(
		(state: { settings: SettingsProps }) => state.settings.theme
	);

	function openDrawer() {
		setDrawerOpen(true);
	}

	function closeDrawer() {
		setDrawerOpen(false);
	}

	return (
		<>
			<Button
				type="text"
				icon={<SettingOutlined />}
				size="large"
				onClick={openDrawer}
			/>
			<Drawer
				title="页面布局配置"
				open={drawerOpen}
				destroyOnClose
				onClose={closeDrawer}
			>
				<MyForm
					initialValues={{
						layoutType: layoutType,
						theme: theme,
					}}
					onValuesChange={(e) => {
						if (e.layoutType) dispatch(setLayoutType(e.layoutType));
						if (e.theme) dispatch(setTheme(e.theme));
					}}
					fields={[
						{
							type: "radioGroup",
							itemType: "button",
							options: [
								{
									label: "左右布局",
									value: "left-right",
								},
								{
									label: "上下布局",
									value: "top-down",
								},
							],
							label: "页面布局",
							name: "layoutType",
						},
						{
							type: "radioGroup",
							itemType: "button",
							options: [
								{
									label: "深色主题",
									value: "dark",
								},
								{
									label: "浅色主题",
									value: "light",
								},
							],
							label: "菜单主题",
							name: "theme",
						},
					]}
				/>
			</Drawer>
		</>
	);
}
