import { MacScrollbar } from "mac-scrollbar";
import React from "react";
//mac os样式文件
import "mac-scrollbar/dist/mac-scrollbar.css";

interface MyMacScrollbarProps {
	children: React.ReactNode;
	className?: string;
	id?: string;
}
export default function MyMacScrollbar(props: MyMacScrollbarProps) {
	const { children, className, id } = props;

	return (
		<>
			<MacScrollbar
				id={id}
				className={className}
				style={{ height: "100%", width: "100%" }}
			>
				{children}
			</MacScrollbar>
		</>
	);
}
