/**
 * @description 登录表单
 */

import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { API_LOGIN_LOGIN } from "../../config/api";
import { LOGIN_BOX_TITLE, LOGO, LOGO_TEXT } from "../../config/staticInfo";
import { setName, setToken, setUsername } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { post } from "../../utils/request";
import MyForm from "../public/myForm";

export default function LoginForm() {
	const navigator = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const [initialValues, setInitialValues] = useState<object>();
	const [formKey, setFormKey] = useState<string>("");
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		if (location.state) {
			setInitialValues(location.state);
			setFormKey("loginFormWithInitialValues");
		}
		return () => {
			setFormKey("");
		};
	}, []);

	function login(e: object) {
		enterLoading(0, setLoadings);
		post({ url: API_LOGIN_LOGIN, data: e })
			.then((res: any) => {
				if (res) {
					const { token, name, username } = res.content;
					if (token) dispatch(setToken(token));
					if (name) dispatch(setName(name));
					if (username) dispatch(setUsername(username));
					navigator("/");
				}
			})
			.finally(() => {
				leaveLoading(0, setLoadings);
			});
	}

	return (
		<>
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					width={40}
					height={40}
					className="sm:mx-auto"
					src={LOGO}
					alt={LOGO_TEXT}
				/>
				<h2 className="m-0 mt-10 sm:text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					{LOGIN_BOX_TITLE}
				</h2>
			</div>
			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<MyForm
					form={form}
					id="login-form"
					key={formKey}
					name="login"
					autoComplete="off"
					size="large"
					onFinish={login}
					initialValues={initialValues}
					disabled={loadings[0]}
					childStyle={{ borderWidth: "1.5px" }}
					className="block text-sm font-medium text-gray-900 [&_.ant-btn]:h-[45px] [&_.ant-btn]:rounded-lg [&_.ant-btn]:text-base [&_.ant-btn]:bg-gradient-to-r [&_.ant-btn]:from-blue-500 [&_.ant-btn]:to-blue-600 [&_.ant-btn]:border-none [&_.ant-btn]:shadow-md [&_.ant-btn]:transition-all [&_.ant-btn]:duration-300 [&_.ant-btn:hover]:-translate-y-0.5 [&_.ant-btn:hover]:shadow-lg [&_.ant-input-affix-wrapper]:h-[45px] [&_.ant-input-affix-wrapper]:rounded-lg [&_.ant-input-affix-wrapper]:border-gray-200 [&_.ant-input-affix-wrapper]:transition-all [&_.ant-input-affix-wrapper]:duration-300 [&_.ant-input-affix-wrapper:hover]:border-blue-500 [&_.ant-input-affix-wrapper:focus]:border-blue-500 [&_.ant-input-affix-wrapper:focus]:shadow-[0_0_0_2px_rgba(24,144,255,0.1)] [&_.ant-form-item-label>label]:font-medium [&_.ant-form-item-label>label]:text-gray-700"
					fields={[
						{
							type: "label",
							label: "用户名",
						},
						{
							type: "input",
							name: "username",
							placeholder: "请输入用户名",
							rules: [
								{
									validator(_, value) {
										const pattern1 = /^[a-zA-Z]/;
										const pattern2 = /^[a-zA-Z][a-zA-Z0-9_-]{4,31}$/;
										const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
										return new Promise((resolve, reject) => {
											if (!value) {
												reject("请输入用户名");
											} else if (emailPattern.test(value)) {
												resolve("");
											} else if (!pattern1.test(value)) {
												reject("用户名应以字母开始");
											} else if (!pattern2.test(value)) {
												reject("用户名应包含英文、数字，长度为5至32位");
											} else {
												resolve("");
											}
										});
									},
								},
							],
						},
						{
							type: "label",
							label: "密码",
						},
						{
							type: "inputPassword",
							name: "password",
							visibilityToggle: false,
							rules: [
								{
									validator(_, value) {
										const pattern = /^\w{6,18}$/;
										return new Promise((resolve, reject) => {
											if (!value) {
												reject("请输入密码");
											} else if (!pattern.test(value)) {
												reject("密码长度应为6-32位！");
											} else {
												resolve("");
											}
										});
									},
								},
							],
							placeholder: "请输入密码",
						},
					]}
					showOk
					okText="登录"
					footerDirection="vertical"
					footerButtonStyle="full"
					okLoading={loadings[0]}
				/>
			</div>
		</>
	);
}
