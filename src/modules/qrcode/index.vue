<template>
	<div>
		<!-- <p>二维码</p> -->
		<p class="lf-tip">{{tip}}</p>
	</div>
</template>

<script>

	import { wxLogin, scanBlankQRcode, baseURL} from '../../api/vueAPI.js'
	export default {
		data() {
			return {
				testText: '初始',
				testArr: '',
				testRes:'暂无数据',
				tip: '',
				userId: '',
				totalPrice: '',
				blankQrCodeId: '',
        aliAppId:'',
			};
		},

		created() {
			console.log("created-qrcode")
			// this.testText = ( ua.match(/MicroMessenger/i) == 'micromessenger' )? '微信':'非微信';
			// this.testArr = (ua.match(/AlipayClient/i) == 'alipayclient')? '支付宝':'非支付宝';
			this.blankQrCodeId = this.$route.query.id
			scanBlankQRcode(this.blankQrCodeId).then(res => {
				console.log(res)
				/* 链接信息保存 */
				this.userId = res.obj.userId;
				this.totalPrice = res.obj.totalPrice;
				this.storeId = res.obj.storeId;
				// sessionStorage.setItem('userId',this.userId)
				// sessionStorage.setItem('totalPrice',this.totalPrice)
				// sessionStorage.setItem('storeId',this.storeId)
				/* 接收信息，空的则拒绝保存 */
				let userId = this.userId;
				if(userId != null && userId != '' && userId != 'null' && userId){
					sessionStorage.setItem('userId',userId)
				} else {
          sessionStorage.removeItem('userId')
        }
				let totalPrice = this.totalPrice;
				if(totalPrice != null && totalPrice != '' && totalPrice != 'null' && totalPrice){
					sessionStorage.setItem('totalPrice',totalPrice)
				} else {
          sessionStorage.removeItem('totalPrice')
        }
				let storeId = this.storeId;
				if(storeId != null && storeId != '' && storeId != 'null' && storeId != 'undefined' && storeId){
					sessionStorage.setItem('storeId',storeId)
				} else {
          sessionStorage.removeItem('storeId')
        }
				let ua = window.navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) == 'micromessenger'){
					window.location.href = baseURL + "/order/app/wx_login?userId="+ this.userId		//跳转外部链接
					return
				}
				if(ua.match(/AlipayClient/i) == 'alipayclient'){
					this.$router.push({
						path:'/zfb/paySuccess',
						query:{}	//传参
					})
					return
				}
				this.tip = '请用对应程序进行扫码';
			}).catch(err => {
				console.log(err)
			})

		},
    methods:{
      GetQueryString(name)
      {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
      }
		}
	}
</script>

<style>
	button{
		width: 100%;
		height: 3.125rem;
		margin: 2rem 0;
	}
	.test{
		position: fixed;
		bottom: 30%;
		left: 10%;
		height: 6.25rem;
		width: 70%;
		background-color: #FFF;
		border: 0.1875rem solid #000;
		z-index: 100;
		color: #000;
	}
	.lf-tip{
		height: 31.25rem;
		line-height: 31.25rem;
		text-align: center;
		font-size: 1.875rem;
	}
</style>
