import BreadcrumbNavigation from "./breadcrumbNavigation";
import LogoArea from "./logoArea";
import SiderOpen from "./siderOpen";

export default function HeaderLeft() {
	return (
		<>
			<div className="flex items-center gap-4 h-full">
				<div className="flex items-center h-full">
					<SiderOpen />
					<LogoArea />
				</div>
				<BreadcrumbNavigation />
			</div>
		</>
	);
}
