import { Button, Image } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGO, LOGO_TEXT } from "../../config/staticInfo";
import { SettingsProps } from "../../redux/settings";

interface LogoAreaProps {
	showText?: boolean;
	showImage?: boolean;
}

export default function LogoArea(props: LogoAreaProps) {
	const { showImage = true, showText = true } = props;
	const handleLogoColor = useSelector(
		(state: { settings: SettingsProps }) => state.settings.handleLogoColor
	);
	const siderWidth = useSelector(
		(state: { settings: SettingsProps }) => state.settings.siderWidth
	);
	const layoutType = useSelector(
		(state: { settings: SettingsProps }) => state.settings.layoutType
	);
	const navigator = useNavigate();

	return (
		<>
			{showImage || showText ? (
				<Button
					type="text"
					className="flex gap-3 w-full px-2 h-10 items-center"
					onClick={() => {
						navigator("/");
					}}
					icon={
						showImage ? (
							<Image
								preview={false}
								src={LOGO}
								width={32}
								height={32}
								className={`${
									handleLogoColor ? "" : "filter-none transform-none"
								}`}
							/>
						) : null
					}
				>
					<h2
						className=" font-medium text-left overflow-hidden transition-all"
						style={{
							width:
								layoutType === "top-down"
									? "auto"
									: showText
									? siderWidth - 80
									: "0px",
						}}
					>
						{LOGO_TEXT}
					</h2>
				</Button>
			) : null}
		</>
	);
}
