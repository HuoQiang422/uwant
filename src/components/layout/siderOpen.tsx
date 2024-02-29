import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
	ControllerProps,
	setSiderOpenState
} from "../../redux/controller";

export default function SiderOpen() {
	const dispatch = useDispatch();
	const siderOpen = useSelector(
		(state: { controller: ControllerProps }) => state.controller.siderOpen
	);

	return (
		<>
			<Button
				type="text"
				className="flex gap-3 px-2 h-10 items-center text-xl "
				onClick={() => {
					dispatch(setSiderOpenState(!siderOpen));
				}}
			>
				{siderOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
			</Button>
		</>
	);
}
