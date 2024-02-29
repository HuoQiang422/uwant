import { ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";

interface TableFixProps {
	children: React.ReactNode;
}

export default function TableFix(props: TableFixProps) {
	const { children } = props;
	const [showContent, setShowContent] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setShowContent(true);
		}, 10);

		return () => clearTimeout(timeoutId); // 清除定时器以防止内存泄漏
	}, []);

	const renderEmpty = () => {
		return showContent ? null : <div style={{ height: "134px" }} />;
	};
	return <ConfigProvider renderEmpty={renderEmpty}>{children}</ConfigProvider>;
}
