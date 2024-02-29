import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import MyMacScrollbar from "../components/common/myMacScrollbar";
import LoginForm from "../components/login/loginForm";
import { LOGIN_FOOTER_TEXT } from "../config/staticInfo";

export default function Login() {
	const [loginBoxAnimation, loginBoxAnimationControl] = useSpring(
		{ from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
		[]
	);
	const location = useLocation();
	const [type, setType] = useState<string>(
		location.pathname.substring(1) || "login"
	);

	useUpdateEffect(() => {
		setType(location.pathname.substring(1) || "login");
	}, [location]);

	useUpdateEffect(() => {
		loginBoxAnimationControl.start({
			from: { opacity: 0, x: 60 },
			to: { opacity: 1, x: 0 },
		});
	}, [type]);

	return (
		<>
			<div className="flex flex-col min-h-full flex-1">
				<MyMacScrollbar>
					<div className="flex flex-col min-h-full">
						<div className="flex flex-1 flex-col sm:justify-center px-6 py-12 lg:px-8 overflow-hidden">
							<animated.div style={loginBoxAnimation}>
								<LoginForm />
							</animated.div>
						</div>
						<div className=" flex flex-wrap justify-center items-center font-medium *:mx-1 my-3 text-center text-xs text-gray-500">
							<div>{LOGIN_FOOTER_TEXT}</div>
						</div>
					</div>
				</MyMacScrollbar>
			</div>
		</>
	);
}
