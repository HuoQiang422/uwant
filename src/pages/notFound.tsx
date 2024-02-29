/**
 * @description 404页面
 */

import { RollbackOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { Button, Image, Result, Space } from "antd";

export default function NotFound() {
	const notFoundImage = "/images/404.svg";

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
							maxHeight: "calc(100dvh - 240px)",
							marginTop: "12px",
							marginBottom: "-24px",
						}}
					/>
				}
				title="ERROR"
				subTitle="不好意思，您访问的页面不存在～"
				extra={
					<Space>
						<Button
							onClick={() => window.history.back()}
							icon={<RollbackOutlined />}
						>
							返回上页
						</Button>
						<Button href={"/"} type="primary" icon={<StepBackwardOutlined />}>
							返回首页
						</Button>
					</Space>
				}
			/>
		</>
	);
}
