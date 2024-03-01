// export const API_URL = "/smsProject";
export const API_URL = "";

/**
 * @description 系统登录注册
 */
export const API_LOGIN_LOGIN = API_URL + "/user/login"; // 登录
export const API_LOGIN_USERMENU = API_URL + "/menu"; //获取用户登录菜单
export const API_LOGIN_USERROUTER = API_URL + "/permission/myPermissions"; //获取用户登录路由

/**
 * @description 用户管理
 */
export const API_USER_CHANGEPASSWORD = API_URL + "/user/editPassword"; //修改密码

/**
 * @description 短信推送
 */
export const API_SMS_LIST = API_URL + "/sms/list"; //短信推送列表
export const API_SMS_SEND = API_URL + "/sms/send"; //短信推送
export const API_SMS_EXPORT = API_URL + "/sms/export"; //短信推送启用禁用

/**
 * @description 短信模版
 */
export const API_SMS_TEMPLATE_LIST = API_URL + "/template/list"; //短信模版列表
export const API_SMS_TEMPLATE_ADD = API_URL + "/template/add"; //短信模版新增
export const API_SMS_TEMPLATE_EDIT = API_URL + "/template/edit"; //短信模版修改
export const API_SMS_TEMPLATE_DELETE = API_URL + "/template/delete"; //短信模版删除
export const API_SMS_TEMPLATE_OPERATE = API_URL + "/template/operate"; //短信模版启用禁用

/**
 * @description 配置中心
 */
export const API_SYSCONFIG_DETAIL = API_URL + "/sysConfig/configDeatil"; //配置详情
export const API_SYSCONFIG_SAVE = API_URL + "/sysConfig/configDoor"; //配置修改
