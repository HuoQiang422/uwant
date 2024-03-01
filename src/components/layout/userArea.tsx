import { KeyOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Dropdown, Flex, Modal, Space } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_USER_CHANGEPASSWORD } from "../../config/api";
import { LOGOUT_CONTENT } from "../../config/staticInfo";
import { User, setToken } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { post } from "../../utils/request";
import MyForm from "../public/myForm";
import { abort } from "../public/signal";

export default function UserArea() {
	const dispatch = useDispatch();
	const navigator = useNavigate();
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalType, setModalType] = useState<string>("");
	const name = useSelector((state: { user: User }) => state.user.name);
	const username = useSelector((state: { user: User }) => state.user.username);
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const token = useSelector((state: { user: User }) => state.user.token);

	function passwordRules(_: any, value: string) {
		const pattern = /^\w{6,18}$/;
		return new Promise((resolve, reject) => {
			if (!value) {
				reject("此为必填项");
			} else if (!pattern.test(value)) {
				reject("密码长度应为6-32位！");
			} else {
				resolve("");
			}
		});
	}

	const items: any = [
		{
			key: "changePassword",
			label: "修改密码",
			icon: <KeyOutlined />,
			onClick: () => {
				setModalType("changePassword");
				openModal();
			},
		},
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

	//修改个人密码
	function changePassword(e: object) {
		enterLoading(1, setLoadings);
		post({ url: API_USER_CHANGEPASSWORD, token, data: e })
			.then(() => {
				closeModal();
			})
			.finally(() => {
				leaveLoading(1, setLoadings);
			});
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
				) : modalType === "changePassword" ? (
					<MyForm
						name="change-password"
						onFinish={changePassword}
						fields={[
							{
								type: "inputPassword",
								required: true,
								rules: [{ validator: passwordRules }],
								label: "旧密码",
								name: "password",
								autoComplete: "new-password",
								placeholder: "请输入旧密码",
							},
							{
								type: "inputPassword",
								required: true,
								rules: [{ validator: passwordRules }],
								label: "新密码",
								name: "newPassword",
								autoComplete: "new-password",
								placeholder: "请输入新密码",
							},
						]}
						showCancel
						showOk
						onCancel={closeModal}
						okLoading={loadings[1]}
						footerStyle="end"
					/>
				) : null}
			</Modal>
		</>
	);
}
