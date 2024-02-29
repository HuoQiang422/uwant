import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Dropdown, Flex, Modal, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT_CONTENT } from "../../config/staticInfo";
import { abort } from "../../controller/signal";
import { User, setToken } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";

export default function UserArea() {
	const dispatch = useDispatch();
	const navigator = useNavigate();
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalType, setModalType] = useState<string>("");
	const name = useSelector((state: { user: User }) => state.user.name);
	const username = useSelector((state: { user: User }) => state.user.username);
	const [loadings, setLoadings] = useState<boolean[]>([]);

	const items: any = [
		{
			key: "loginout",
			label: "退出登录",
			onClick: () => {
				setModalType("loginout");
				openModal();
			},
			style: {
				color: "red",
			},
			icon: <LoginOutlined />,
		},
	];

	function openModal() {
		setModalOpen(true);
	}

	function closeModal() {
		abort();
		setModalOpen(false);
	}

	//退出登录
	function userLogout() {
		enterLoading(0, setLoadings);
		dispatch(setToken(""));
		localStorage.clear();
		navigator("/login");
		leaveLoading(0, setLoadings);
	}

	return (
		<>
			<Flex align="center">
				<Dropdown menu={{ items }}>
					<Button type="text" className="flex gap-2 px-2 h-10 items-center ">
						<Avatar className="flex">
							{name ? (
								name.charAt(0)
							) : username ? (
								username.charAt(0)
							) : (
								<UserOutlined />
							)}
						</Avatar>
						{name || username}
					</Button>
				</Dropdown>
			</Flex>
			<Modal
				title={items.find((item: any) => item?.key === modalType)?.label}
				open={modalOpen}
				centered
				onCancel={closeModal}
				destroyOnClose
				footer={
					modalType === "loginout" ? (
						<Space>
							<Button onClick={closeModal}>取消</Button>
							<Button
								onClick={userLogout}
								type="primary"
								danger={modalType === "loginout"}
								loading={loadings[0]}
							>
								确定
							</Button>
						</Space>
					) : null
				}
			>
				{modalType === "loginout" ? (
					<Alert message={LOGOUT_CONTENT} type="error" />
				) : null}
			</Modal>
		</>
	);
}
