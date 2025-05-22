import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import LoginForm from "../components/login/loginForm";
import MyMacScrollbar from "../components/public/myMacScrollbar";
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
			<div className="flex flex-col min-h-full flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
				{/* 背景装饰 */}
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
					<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
					<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
				</div>

				<MyMacScrollbar>
					<div className="flex flex-col min-h-full relative z-10">
						<div className="flex flex-1 flex-col sm:justify-center px-6 py-12 lg:px-8 overflow-hidden">
							<animated.div style={loginBoxAnimation}>
								<LoginForm />
							</animated.div>
						</div>
						<div className="flex flex-wrap justify-center items-center font-medium *:mx-1 my-3 text-center text-xs text-gray-500">
							<div>{LOGIN_FOOTER_TEXT}</div>
						</div>
					</div>
				</MyMacScrollbar>
			</div>

			<style>
				{`
					@keyframes blob {
						0% {
							transform: translate(0px, 0px) scale(1);
						}
						33% {
							transform: translate(30px, -50px) scale(1.1);
						}
						66% {
							transform: translate(-20px, 20px) scale(0.9);
						}
						100% {
							transform: translate(0px, 0px) scale(1);
						}
					}
					.animate-blob {
						animation: blob 7s infinite;
					}
					.animation-delay-2000 {
						animation-delay: 2s;
					}
					.animation-delay-4000 {
						animation-delay: 4s;
					}
				`}
			</style>
		</>
	);
}
