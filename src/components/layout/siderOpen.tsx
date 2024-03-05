import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
	SettingsProps,
	setSiderOpenState
} from "../../redux/settings";

export default function SiderOpen() {
	const dispatch = useDispatch();
	const siderOpen = useSelector(
		(state: { settings: SettingsProps }) => state.settings.siderOpen
	);

	return (
		<>
			<Button
				type="text"
				className="flex gap-3 px-2 h-10 items-center text-xl "
				onClick={() => {
					dispatch(setSiderOpenState(!siderOpen));
					localStorage.setItem("siderOpen", `${!siderOpen}`);
				}}
			>
				{siderOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
			</Button>
		</>
	);
}
