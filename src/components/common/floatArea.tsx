/**
 * @description 悬浮菜单
 */
import { FloatButton } from "antd";
import { useEffect, useState } from "react";

export default function FloatArea() {
	const [targetElement, setTargetElement] = useState<any>(null);

	useEffect(() => {
		const element = document.getElementById("layout-content");
		if (element) {
			setTargetElement(element);
		}
	}, []);

	return (
		<>{targetElement && <FloatButton.BackTop target={() => targetElement} />}</>
	);
}
