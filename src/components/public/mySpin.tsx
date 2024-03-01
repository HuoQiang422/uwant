import { Flex, Spin } from "antd";

interface mySpinProps {
	text?: string;
}
export default function MySpin(props: mySpinProps) {
	const { text } = props;

	return (
		<Flex
			style={{ width: "100%", height: "100%" }}
			align="center"
			vertical
			gap={24}
			justify="center"
		>
			<Spin size={"large"} />
			<p className="font-bold">{text}</p>
		</Flex>
	);
}
