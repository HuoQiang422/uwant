export const API_URL = "/smsProject";

/**
 * @description 系统登录注册
 */
export const API_LOGIN_LOGIN = API_URL + "/user/login"; // 登录
export const API_LOGIN_USERMENU = API_URL + "/menu"; //获取用户登录菜单
export const API_LOGIN_USERROUTER = API_URL + "/permission/myPermissions"; //获取用户登录路由

/**
 * @description 短信推送
 */
export const API_SMS_LIST = API_URL + "/sms/list"; //短信推送列表
export const API_SMS_SEND = API_URL + "/sms/send"; //短信推送

/**
 * @description 短信模版
 */
export const API_SMS_TEMPLATE_LIST = API_URL + "/template/list"; //短信模版列表
export const API_SMS_TEMPLATE_ADD = API_URL + "/template/add"; //短信模版新增
export const API_SMS_TEMPLATE_EDIT = API_URL + "/template/edit"; //短信模版修改
export const API_SMS_TEMPLATE_DELETE = API_URL + "/template/delete"; //短信模版删除
export const API_SMS_TEMPLATE_OPERATE = API_URL + "/template/operate"; //短信模版启用禁用
