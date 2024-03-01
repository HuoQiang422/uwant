import React from "react";
import { useLocation } from "react-router-dom";
import { HOME_HAS_BG } from "../../config/settings";
import { homeUrl } from "../../utils/generateAuthList";

interface ContainerCardProps {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export default function ContainerCard(props: ContainerCardProps) {
	const { children, className, style } = props;
	const location = useLocation();

	return (
		<div
			className={`${
				HOME_HAS_BG
					? "flex flex-col bg-white p-3 rounded-md border"
					: location.pathname === homeUrl || location.pathname === "/"
					? ""
					: "flex flex-col bg-white p-3 rounded-md border"
			} ${className}`}
			style={style}
		>
			{children}
		</div>
	);
}
