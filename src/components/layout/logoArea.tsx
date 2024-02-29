import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LOGO_TEXT } from "../../config/staticInfo";

export default function LogoArea() {
	const navigator = useNavigate();

	return (
		<>
			<Button
				type="text"
				className="flex gap-3 px-2 h-10 items-center"
				onClick={() => {
					navigator("/");
				}}
			>
				<h2 className=" font-medium">{LOGO_TEXT}</h2>
			</Button>
		</>
	);
}
