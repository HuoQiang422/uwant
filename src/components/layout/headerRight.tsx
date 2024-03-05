import LayoutSettings from "./layoutSettings";
import UserArea from "./userArea";

export default function HeaderRight() {
	return (
		<div className="flex flex-auto items-center justify-end">
			<LayoutSettings />
			<UserArea />
		</div>
	);
}
