import {
	StyleProvider,
	legacyLogicalPropertiesTransformer,
} from "@ant-design/cssinjs";
import { App } from "antd";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import MyMessage from "./components/public/myMessage";
import "./index.less";
//redux全局状态管理
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { store } from "./redux/store";
import { Router, RouterBeforeEach } from "./router/router";
import "./styles/antd.less";
import "./styles/common.less";

dayjs.locale("zh-cn");

ReactDOM.createRoot(document.getElementById("root")!).render(
	<>
		{/* redux状态控制 */}
		<Provider store={store}>
			{/* 样式设置 */}
			<StyleProvider
				transformers={[legacyLogicalPropertiesTransformer]}
				hashPriority="high"
			>
				{/* 消息提醒，全局上下文 */}
				<App>
					<MyMessage />
				</App>
				{/* 路由控制区域 */}
				<BrowserRouter>
					<RouterBeforeEach>
						<Router />
					</RouterBeforeEach>
				</BrowserRouter>
			</StyleProvider>
		</Provider>
	</>
);
