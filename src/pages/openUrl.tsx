/**
 * @description 外链地址页面
 */

import { ExportOutlined } from "@ant-design/icons";
import { Button, Image, Result, Space } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function OpenUrl() {
	const location = useLocation();
	const notFoundImage = "/images/notify_page.svg";
	const url = location.pathname.slice(1);
	const [open, setOpen] = useState<boolean>(false);
	const [key, setKey] = useState<number>(0);

	useEffect(() => {
		setOpen(false);
		setTimeout(() => {
			window.open(url, "_blank");
			setOpen(true);
		}, 500);
		return () => {}; // 清除副作用，避免内存泄露。
	}, [key]);

	return (
		<>
			<Result
				className=" flex flex-col items-center pt-0 w-full"
				icon={
					<Image
						alt=""
						src={notFoundImage}
						preview={false}
						style={{
							width: "100%",
							minHeight: "200px",
							height: "100dvh",
							maxHeight: "calc(100dvh - 300px)",
							marginTop: "12px",
							marginBottom: "-24px",
						}}
					/>
				}
				title={open ? "已为您打开外链地址" : "即将为你打开外链地址"}
				subTitle="如无法打开，请查看是否被浏览器阻止"
				extra={
					<Space>
						<Button
							loading={!open}
							type="primary"
							onClick={() => {
								setKey(Math.random());
							}}
							icon={<ExportOutlined />}
						>
							{open ? "再次打开" : "正在打开"}
						</Button>
					</Space>
				}
			/>
		</>
	);
}
