import BreadcrumbNavigation from "./breadcrumbNavigation";
import LogoArea from "./logoArea";
import SiderOpen from "./siderOpen";

interface HeaderLeftProps {
	showSiderOpen?: boolean;
	showBreadcrumb?: boolean;
	showLogoArea?: boolean;
}

export default function HeaderLeft(props: HeaderLeftProps) {
	const {
		showBreadcrumb = true,
		showLogoArea = true,
		showSiderOpen = true,
	} = props;
	return (
		<>
			{showBreadcrumb || showLogoArea || showSiderOpen ? (
				<div className="flex flex-1 items-center gap-4 h-full">
					{showLogoArea || showSiderOpen ? (
						<div className="flex items-center h-full">
							{showSiderOpen ? <SiderOpen /> : null}
							{showLogoArea ? <LogoArea /> : null}
						</div>
					) : null}
					{showBreadcrumb ? <BreadcrumbNavigation /> : null}
				</div>
			) : null}
		</>
	);
}
