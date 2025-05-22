import {
	ClockCircleOutlined,
	IdcardOutlined,
	MoneyCollectOutlined,
} from "@ant-design/icons";
import { Image, Tag } from "antd";
import { IMG_ERROR } from "../../config/staticInfo";
import { transformTime } from "../../utils/transformData";

interface MyTagProps {
	text: string | number;
	color?: string;
}

export function ImageTag(props: MyTagProps) {
	const { text } = props;

	return (
		<>
			<Tag className={text ? "flex justify-center items-center w-fit p-1" : ""}>
				{text && typeof text === "string" ? (
					<Image width={60} height={60} src={text} fallback={IMG_ERROR} />
				) : (
					"-"
				)}
			</Tag>
		</>
	);
}

export function TimeTag(props: MyTagProps) {
	const { text, color } = props;
	return (
		<Tag icon={<ClockCircleOutlined />} color={color}>{text ? transformTime(text) : "-"}</Tag>
	);
}

export function SexTag(props: MyTagProps) {
	const { text } = props;
	return (
		<Tag color={text === 1 ? "blue" : text === 2 ? "pink" : ""}>
			{text === 1 ? "男" : text === 2 ? "女" : "保密"}
		</Tag>
	);
}

export function IdTag(props: MyTagProps) {
	const { text } = props;
	return <Tag icon={<IdcardOutlined />}>{text ? text : "-"}</Tag>;
}

export function MoneyTag(props: MyTagProps) {
	const { text } = props;
	return (
		<Tag color="gold" icon={<MoneyCollectOutlined />}>
			{text ? text : "-"}
		</Tag>
	);
}
