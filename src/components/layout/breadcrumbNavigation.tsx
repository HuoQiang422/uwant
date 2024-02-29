/**
 * @description 面包屑导航组件
 * @author doxwant
 * @copyright onesee.net
 */

import { HomeFilled } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { MenuRedux } from "../../redux/menu";
import { findMenuItemById, findMenuOpenKeys } from "../../utils/findMenu";

interface BreadcrumbNavigationProps {
	style?: React.CSSProperties;
	className?: string;
}

export default function BreadcrumbNavigation(props: BreadcrumbNavigationProps) {
	const { style, className } = props;
	const location = useLocation();
	const [breadcrumbItems, setBreadcrumbItems] = useState([]);
	const databaseMenu = useSelector(
		(state: { menuRedux: MenuRedux }) => state.menuRedux.databaseMenu
	);

	useEffect(() => {
		generateBreadcrumb();
	}, [location]);

	//生成面包屑导航
	function generateBreadcrumb() {
		const pathname = location.pathname;
		const openKeys = findMenuOpenKeys(databaseMenu, pathname);
		const items: any = openKeys.reverse().map((key) => {
			const menuItem = findMenuItemById(databaseMenu, key);
			const breadcrumbItem = {
				title:
					menuItem.url && menuItem.url !== pathname ? (
						<Link to={menuItem.url}>{menuItem?.name}</Link>
					) : (
						menuItem?.name
					),
			};
			return breadcrumbItem;
		});
		setBreadcrumbItems(items);
	}

	return (
		<>
			<Breadcrumb
				items={[
					{
						title: <HomeFilled />,
					},
					...breadcrumbItems,
				]}
				className={className}
				style={{ ...style }}
			/>
		</>
	);
}
