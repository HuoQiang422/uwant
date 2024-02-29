import { useLocation } from "react-router-dom";

export default function Iframe() {
	const location = useLocation();
	const url = location.pathname.slice(1);

	return (
		<>
			<iframe src={url} className="w-full h-full rounded-md" />
		</>
	);
}
