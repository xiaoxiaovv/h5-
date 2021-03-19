import { textToast } from './utils.js'
import Fly from 'flyio/dist/npm/fly';
const fly = new Fly;
import * as base64 from '@/utils/base64Encode.js'
import * as configInfo from '@/config/index.js'
import Toast from 'muse-ui-toast'
import MessageBox from 'muse-ui-message'
import loading from './loading.js'
// const URL = "http://pay-adm.vmajy.com"	//全局总URL
const URL = window.serverUrl || window.location.protocol + '//' + window.location.host
//设置超时
fly.config.timeout = 10000;
//设置请求基地址
// fly.config.baseURL = "https://www.wubiaokeji.com";
// fly.config.baseURL = "https://test.pay.lingyundata.com";
// fly.config.baseURL = "http://www.yunqufu.com";
// fly.config.baseURL = "http://192.168.1.150:80";
fly.config.baseURL = URL;
//添加请求拦截器
// fly.interceptors.request.use((request)=>{
//     //给所有请求添加自定义header
// 	const token = sessionStorage.getItem('token');
//     if (token) {
//        request.headers['authorized'] = token;
//     }
//     return request;
// });
//添加请求拦截器
fly.interceptors.request.use((request)=>{
  // 版本号
  let headerVersion = base64.baseEncode('H5-' + configInfo.version)
  request.headers['version'] = headerVersion;
  if (request.headJson) {
    request.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
  }
  //给所有请求添加自定义header
  const token = sessionStorage.getItem('token');
  if (token) {
    request.headers['authorized'] = token;
  }
  loading.show()
  return request;
});
//添加响应拦截器
fly.interceptors.response.use(
    (response) => {
      loading.hide()
		// 根据后台的需求自定义
		let token = response.headers['authorized'];
		if (token) {
			sessionStorage.setItem('token', token);
		}
    // 只将请求结果的data字段返回
		let data = response.data
		if (data.code === 200) {
			 return data
		}else {
			if (data.code === 401) {
			} else {
			  // textToast(data.msg)
        Toast.error(data.msg)
			}
			return Promise.reject(data)
		}
    },
    (err) => {
     loading.hide()
      // 发生网络错误后会走到这里
      Toast.error(err.message)
		  // textToast(err.message);
      return Promise.reject(err)
      // return err
    }
);
export default fly;
