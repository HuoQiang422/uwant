import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyForm from "../components/public/myForm";
import { API_SYSCONFIG_DETAIL, API_SYSCONFIG_SAVE } from "../config/api";
import { User } from "../redux/user";
import { enterLoading, leaveLoading } from "../utils/controllerUtils";
import { post } from "../utils/request";
import { postClear } from "../utils/requestClear";

export default function Settings() {
	const [loadings, setLoadings] = useState<boolean[]>([]);
	const token = useSelector((state: { user: User }) => state.user.token);
	const [sysConfig, setSysConfig] = useState<any>();
	const [formKey, setFormKey] = useState<string>("");

	function getSettings() {
		enterLoading(1, setLoadings);
		postClear({
			url: API_SYSCONFIG_DETAIL,
			token,
		})
			.then((res: any) => {
				if (res) {
					const content = res.content;
					if (content.isSend && content.isSend === "是") {
						content.isSend = true;
					} else {
						content.isSend = false;
					}
					setSysConfig(content);
					setFormKey(content.id);
				}
			})
			.finally(() => {
				leaveLoading(1, setLoadings);
			});
	}

	useEffect(() => {
		getSettings();
	}, []);

	function saveSettings(e: any) {
		enterLoading(0, setLoadings);
		post({
			url: API_SYSCONFIG_SAVE,
			token,
			data: { ...e, id: formKey },
		}).finally(() => {
			leaveLoading(0, setLoadings);
		});
	}

	return (
		<div style={{ margin: "20px" }}>
			<MyForm
				key={formKey}
				labelWidth={120}
				initialValues={sysConfig}
				fields={[
					{
						type: "input",
						name: "tenantId",
						label: "租户ID",
						required: true,
						placeholder: "请输入租户ID",
					},
					{
						type: "input",
						name: "secret",
						label: "秘钥",
						required: true,
						placeholder: "请输入秘钥",
					},
					{
						type: "input",
						name: "tokenUrl",
						label: "三方接口地址",
						required: true,
						placeholder: "请输入三方接口获取tokenURL地址",
					},
					{
						type: "input",
						name: "sendUrl",
						label: "短信发送接口",
						required: true,
						placeholder: "请输入发送短信接口",
					},
					{
						type: "input",
						name: "overageUrl",
						label: "余额查询地址",
						required: true,
						placeholder: "请输入余额查询地址",
					},
					{
						type: "input",
						name: "username",
						label: "短信平台账号",
						required: true,
						placeholder: "请输入短信平台账号",
					},
					{
						type: "input",
						name: "password",
						label: "短信平台密码",
						required: true,
						placeholder: "请输入短信平台密码",
					},
					{
						type: "input",
						name: "userId",
						label: "短信平台企业ID",
						required: true,
						placeholder: "请输入短信平台企业ID",
					},
					{
						type: "input",
						name: "whUrl",
						label: "问卷地址",
						required: true,
						placeholder: "请输入问卷地址",
					},
					{
						type: "switch",
						required: true,
						name: "isSend",
						label: "开启短信发送",
						checkedText: "开启",
						uncheckedText: "关闭",
					},
				]}
				showOk
				okText="保存配置"
				okLoading={loadings[1] || loadings[0]}
				footerButtonStyle={"full"}
				footerDirection="vertical"
				onFinish={(e) => {
					if (e.isSend === false) e.isSend = "否";
					else e.isSend = "是";
					saveSettings(e);
				}}
			/>
		</div>
	);
}
