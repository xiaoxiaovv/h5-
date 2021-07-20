<template>
	<div style="display: none">
		 <div>
			<button class="weui_btn primary" @click="jump('/zfb/paySuccess')">支付宝</button>
			<button class="weui_btn primary" @click="jump('/wx/paySelect')">微信</button>
			<button class="weui_btn primary" @click="jump('/qrcode')">二维码</button>
      <button class="weui_btn primary" @click="jump('/yl/paySuccess')">银联云闪付</button>
		</div>
		<div class="test">
			<p>当前进程: {{testText}}</p>
			<p>userId: {{testArr}}</p>
			<p>接口反馈: {{testRes}}</p>
		</div>
		<p class="lf-all-tip">{{tip}}</p>
	</div>
</template>

<script>
	import { wxLogin, baseURL, getDocmentTitle, wxLoginH5} from '../../api/vueAPI.js'
  import { initParams } from '@/utils/initParams.js'
  import MessageBox from 'muse-ui-message'
  import loading from '@/common/loading.js'
	export default {
		data() {
			return {
				testText: '初始',
				testArr: '',
				testRes:'暂无数据',
				tip: '',
				userId: '',
				totalPrice: '',
        settimeObj: null,
        reloadTime: 0
			};
		},
		created() {
		  let reloadTime = sessionStorage.getItem('reloadTime') || 0
      this.reloadTime = Number(reloadTime)
      sessionStorage.clear()
      localStorage.clear()
		},
    mounted() {
      loading.show()

      console.log("created")
      /* 判断过期 */
      let endTime = this.$route.query.endTime || 99999999999999
      let nowTime = new Date().getTime()
      if(nowTime > endTime){
        this.tip = "二维码已过期"
        return
      }
      // this.testText = ( ua.match(/MicroMessenger/i) == 'micromessenger' )? '微信':'非微信';
      // this.testArr = (ua.match(/AlipayClient/i) == 'alipayclient')? '支付宝':'非支付宝';
      /* 接收信息，空的则拒绝保存 */
      let userId = this.$route.query.userId;
      if(userId != null && userId != '' && userId != 'null' && userId){
        sessionStorage.setItem('userId',userId)
      } else {
        sessionStorage.removeItem('userId')
      }
      let totalPrice = this.$route.query.totalPrice;
      if(totalPrice != null && totalPrice != '' && totalPrice != 'null' && totalPrice){
        sessionStorage.setItem('totalPrice',totalPrice)
      } else {
        sessionStorage.removeItem('totalPrice')
      }
      let storeId = this.$route.query.storeId;
      if(storeId != null && storeId != '' && storeId != 'null' && storeId != 'undefined' && storeId){
        sessionStorage.setItem('storeId',storeId)
      } else {
        sessionStorage.removeItem('storeId')
      }

      let md5Str = this.$route.query.md5Str;
      if(md5Str != null && md5Str != '' && md5Str != 'null' && md5Str != 'undefined' && md5Str){
        sessionStorage.setItem('md5Str',md5Str)
      } else {
        sessionStorage.removeItem('md5Str')
      }

      let timestramp = this.$route.query.timestramp;
      if(timestramp != null && timestramp != '' && timestramp != 'null' && timestramp != 'undefined' && timestramp){
        sessionStorage.setItem('timestramp',timestramp)
      } else {
        sessionStorage.removeItem('timestramp')
      }
      // 预下单
      let goodsOrderId = this.$route.query.goodsOrderId;
      if(goodsOrderId != null && goodsOrderId != '' && goodsOrderId != 'null' && goodsOrderId != 'undefined' && goodsOrderId){
        sessionStorage.setItem('goodsOrderId',goodsOrderId)
      } else {
        sessionStorage.removeItem('goodsOrderId')
      }

      // 花呗分期
      let hbFqNum = this.$route.query.hbFqNum;
      if(hbFqNum != null && hbFqNum != '' && hbFqNum != 'null' && hbFqNum != 'undefined' && hbFqNum){
        sessionStorage.setItem('hbFqNum',hbFqNum)
      } else {
        sessionStorage.removeItem('hbFqNum')
      }

      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        this.testText = "进行微信授权登录"
        this.testArr = this.$route.query.userId
        let uuid = initParams(this.$route.query.uuid)
        let equipmentId = initParams(this.$route.query.equipmentId)
        let queryObj = {
          uuid: uuid,
          equipmentId: equipmentId
        }
        let queryArr = []
        for (let i in queryObj) {
          if (queryObj[i]) {
            queryArr.push(i + '=' + queryObj[i])
          }
        }
        let queryStr = queryArr.join('&')
        if (queryStr) {
          queryStr = '&' + queryStr
        } else {
          queryStr=''
        }
        // let loginParams = Object.assign({}, queryObj, {userId: this.$route.query.userId})
        window.location.href = baseURL + "/order/app/wx_login?userId="+ this.$route.query.userId + queryStr // 跳转外部链接
        this.turnToLogin(this.reloadTime + 1)
      } else if (ua.match(/AlipayClient/i) == 'alipayclient'){
        let uuid = initParams(this.$route.query.uuid)
        let equipmentId = initParams(this.$route.query.equipmentId)
        this.$router.push({
          path:'/zfb/paySuccess',
          query:{
            uuid: uuid,
            equipmentId: equipmentId
          }	//传参
        })
      } else {
        // 就在这里处理数据吧。
        // window.location.href = "https://baidu.com" // 跳转外部链接
        let d =  initParams(this.$route.query)//获取页面携带的参数集合
        this.$router.push({
          path:'/yl/paySuccess',
          query:{
            uuid: d.uuid,
            equipmentId: d.equipmentId
          }	//传参
        })
        // this.testText = '请用对应程序进行扫码';
        // this.tip = '请用对应程序进行扫码';
       //银联支付逻辑处理。如果需要跳转页面就对应好页面地址，加参数
      }
    },
		methods:{
			/* 对应页面跳转 */
			jump(url) {
				this.$router.push({
					path:url,
					query:{}	//传参
				})
			},
      turnToLogin(reloadTime) {
			  if (reloadTime > 3) {
          loading.hide()
          sessionStorage.removeItem('reloadTime')
          this.$alert('已失效，请重新扫码', '提示', {
            okLabel: '确定'
          }).then(() => {
          })
        } else {
          this.settimeObj = setTimeout(() => {
            sessionStorage.setItem('reloadTime', reloadTime)
            window.location.reload()
          }, 3000)
        }
      }
		},
    destroyed() {
      loading.hide()
		  if (this.settimeObj) {
		    clearTimeout(this.settimeObj)
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
	.lf-all-tip{
		height: 31.25rem;
		line-height: 31.25rem;
		text-align: center;
		font-size: 1.875rem;
	}
</style>
