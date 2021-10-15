import fly from '../common/flyioRequest'
import qs from 'qs'
import URL from '../common/flyioRequest'

// export const baseURL = "https://www.wubiaokeji.com"
// export const baseURL = "http://www.yunqufu.com"
// export const baseURL = "https://test.pay.lingyundata.com"
// export const baseURL = "http://192.168.1.150:80"
// export const baseURL = "http://pay-adm.vmajy.com"
export const baseURL = window.serverUrl || window.location.protocol + '//' + window.location.host
/*
 * 查询使用get ， 修改使用post
 */

/* 网页支付 */
export function getWebPay (params/*payWay, totalPrice, userId='', storeId='', uuid = '', equipmentId = '', remarks = '',md5Str = '',timestramp = '', goodsOrderId = '', hbFqNum = '', openId = '', discountPrice='', memberId='', code='', merchantId = '',fence='-1'*/) {
	return fly.request( '/order/app/web_pay', qs.stringify(params/*{
		payWay,
		totalPrice,
		userId,
		openId,
		storeId,
		discountPrice,
		memberId,
		code,
		merchantId,
    fence,
    uuid,
    equipmentId,
    remarks,
    md5Str,
    timestramp,
    goodsOrderId,
    hbFqNum
    // kdbGcs:'114.515622|37.080864'
	}*/),{
		method: 'post',
	})
}
/* 网页支付 */
export function getMarketWebPay (params/*payWay, totalPrice, userId='', storeId='', uuid = '', equipmentId = '', remarks = '',md5Str = '',timestramp = '', goodsOrderId = '', hbFqNum = '', openId = '', discountPrice='', memberId='', code='', merchantId = '',fence='-1'*/) {
	return fly.request( '/merchant/order/web_pay', qs.stringify(params/*{
		payWay,
		totalPrice,
		userId,
		openId,
		storeId,
		discountPrice,
		memberId,
		code,
		merchantId,
    fence,
    uuid,
    equipmentId,
    remarks,
    md5Str,
    timestramp,
    goodsOrderId,
    hbFqNum
    // kdbGcs:'114.515622|37.080864'
	}*/),{
		method: 'post',
	})
}
/* 获取订单列表 */
export function getOrderList ( pageNumber, pageSize, start_payTime, end_payTime, payWay, status) {
	return fly.request({
		url : '/order/app/query_order',
		method: 'get',
		params: {
			pageNumber,
			pageSize,
			start_payTime,
			end_payTime,
			payWay,
			status
		}
	})
}
/* 获取订单详情 */
export function getOrderDetails ( orderNumber) {
	return fly.request({
		url : '/order/app/order_detail',
		method: 'get',
		params: {
			orderNumber
		}
	})
}

/* 微信授权登录 */
export function wxLogin ( userId) {
	return fly.request({
		url : '/order/app/wx_login',
		method: 'get',
		params: {
			userId
		}
	})
}

/* 微信授权登录 */
export function wxLoginH5 ( params) {
  return fly.request({
    url : '/order/app/wx_login/h5',
    method: 'get',
    params: params,
    headJson: true
  })
}

/* 扫描实体二维码支付 */
export function scanBlankQRcode ( blankQrCodeId) {
	return fly.request({
		url : '/merchant/qrcode/app/scan_blank_qrcode',
		method: 'get',
		params: {
			blankQrCodeId
		}
	})
}

/* 获取商家名 */
//参数:商户id:userId
export function getMerchantName ( userId, merchantId='') {
	return fly.request({
		url : '/merchant/admin/find_merchant_name',
		method: 'get',
		params: {
			userId,
			merchantId
		}
	})
}
// 获取高德秘钥
export function getGaoDeKey (companyId) {
  return fly.request({
    url: '/auth/gaode_map_config',
    method: 'get',
    params: {
      companyId
    }
  })
}
/* 获取会员卡详情 */
//参数:商户id:userId
export function getMerchantMemberCard ( userId, merchantId) {
	return fly.request({
		url : '/merchant/admin/find_card_detail',
		method: 'get',
		params: {
			userId,
			merchantId
		}
	})
}

/* 加入会员发送短信 */
export function webVerificationCode ( userId, phone, merchantId='') {
	return fly.request({
		url : '/member/admin/web_verification_code',
		method: 'get',
		params: {
			userId,
			phone,
			merchantId
		}
	})
}
/* 添加会员 */
export function webRegister (userId, phone, code, openId, merchantId='') {
	return fly.request( '/member/admin/web_register', qs.stringify({
		userId,
		phone,
		// code,
		openId,
		merchantId
	}),{
		method: 'post',
	})
}
/* 获取会员个人卡券 */
export function getMemberCouponList ( memberId, userId = '') {
	return fly.request({
		url : '/member/person_coupon/member_coupon_list',
		method: 'get',
		params: {
			memberId,
			userId,
		}
	})
}
/* 获取支付后广告地址*/
export function getAdvertisement (userId,storeId,merchantId) {
  return fly.request({
    url : '/advertise/on_management/select',
    method: 'get',
    params: {
      userId,
      storeId,
      merchantId,
    }
  })
}
//传给后端点击广告技术
export function getAdverCount (id,status) {
  return fly.request({
    url : '/advertise/on_management/cost',
    method: 'get',
    params: {
      id:id,
      status:status
    }
  })
}

/* 获取支付成功广告地址*/
export function getAdvertisementPaySuccess (params) {
  return fly.request({
    url : '/advertise/advertise/view/h5',
    method: 'get',
    params: params
  })
}

/* 获取网页title*/
export function getDocmentTitle (params) {
  return fly.request({
    url : '/merchant/merchant/getMerchantName',
    method: 'get',
    params: params
  })
}

/*  获取优惠券列表*/
export function getCouponList (params) {
  return fly.request({
    url : '/member/person_coupon/my_coupon_info',
    method: 'get',
    params: params
  })
}
/*  获取优惠券列表*/
export function showMemberPay (params) {
  return fly.request({
    url : '/merchant/admin/third/showMemberPay',
    method: 'get',
    params: params
  })
}

/* 获取门店名称*/
export function getStoreName (params) {
  return fly.request({
    url : '/merchant/merchant/getStoreName',
    method: 'get',
    params: params
  })
}

/* 判断商户是否开通了营销激励*/
export function isMarket (params) {
  return fly.request('/merchant/market/is_market', qs.stringify(params),{
  	method: 'post',
  })
}

/* 商户领劵*/
export function getVoucher (params) {
  return fly.request({
    url: '/merchant/market/get_voucher',
    params: params,
    method: 'get'
  })
}
/* 获取AppID*/
// export function getAppID () {
//   return fly.request({
//     url : '/pay/pay_config/find_top_pay_config',
//     method: 'get',
//     params: {
//     }
//   })
// }
