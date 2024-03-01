import { useState } from "react";
import { useSelector } from "react-redux";
import { API_SMS_TEMPLATE_ADD, API_SMS_TEMPLATE_EDIT } from "../../config/api";
import { User } from "../../redux/user";
import { enterLoading, leaveLoading } from "../../utils/controllerUtils";
import { post } from "../../utils/request";
import MyForm from "../public/myForm";

interface AddOrEditSmsTemplateProps {
	modalType: string;
	handleItem: any;
	reFresh: () => void;
	closeModal: () => void;
}

export default function AddOrEditSmsTemplate(props: AddOrEditSmsTemplateProps) {
	const { modalType, handleItem, reFresh, closeModal } = props;
	const token = useSelector((state: { user: User }) => state.user.token);
	const [loadings, setLoadings] = useState<boolean[]>([]);

	function addSmsTemplate(e: object) {
		enterLoading(0, setLoadings);
		post({ url: API_SMS_TEMPLATE_ADD, token, data: e })
			.then((res) => {
				if (res.code === 200) {
					reFresh();
					closeModal();
				}
			})
			.finally(() => {
				leaveLoading(0, setLoadings);
			});
	}

	function editSmsTemplate(e: object) {
		enterLoading(0, setLoadings);
		post({
			url: API_SMS_TEMPLATE_EDIT,
			token,
			data: { ...e, id: handleItem.id },
		})
			.then((res) => {
				if (res.code === 200) {
					reFresh();
					closeModal();
				}
			})
			.finally(() => {
				leaveLoading(0, setLoadings);
			});
	}

	return (
		<>
			<MyForm
				initialValues={handleItem ? handleItem : undefined}
				fields={[
					{
						type: "input",
						required: true,
						rules: [{ required: true, message: "请输入模版标题" }],
						name: "title",
						label: "模版标题",
						placeholder: "请输入模版标题",
					},
					{
						type: "textArea",
						required: true,
						rules: [{ required: true, message: "请输入模版内容" }],
						name: "text",
						rows: 3,
						label: "模版内容",
						placeholder: "请输入模版内容",
					},
				]}
				showOk
				showCancel
				footerStyle="end"
				okLoading={loadings[0]}
				onFinish={modalType === "add" ? addSmsTemplate : editSmsTemplate}
				onCancel={closeModal}
			/>
		</>
	);
}
