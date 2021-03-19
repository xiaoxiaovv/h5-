<template>
	<div class="box">
		<!-- 广告图 -->
		<div class="lf-advertisement" :style="advertisementStyle" @click="jumpLink"></div>
<!--		 <button @click="btn">测试</button>-->
<!--		 <a href="http://weixin://wxpay/bizpayurl?pr=89Fkczt">打开</a>-->
	</div>
</template>

<script>
	var wx = require('weixin-js-sdk');
	import { baseURL,getAdvertisement} from '../../api/vueAPI.js';
	export default{
		data() {
			return{
				htmlProportion: '',		//屏幕长宽比例
				htmlWidth: '',		//屏幕宽
				htmlheight: '',		//屏幕高
				isWxPay: true,	
				price: '',
				timeStamp: '',
				orderNumber: '',
        userId:'',
        storeId:'',
        merchantId:'',
				advertisementStyle:{background:'',width:'',height:'',backgroundSize:'100% 100%'},
        imageId:'',
        imageLink:'',//跳转url链接
				type:'',	//广告类型:1-点击跳转  2-展示量  3-直接跳转
        //1：显示图片，点击跳转链接，2：显示图片，点击不可跳转链接   3：无图片无广告直接跳转网页
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			console.log(this.htmlWidth);
			console.log(this.htmlheight);
			console.log('适配后的广告宽高');
			console.log(this.htmlWidth/1080*1920)
      this.advertisementStyle.width=this.htmlWidth + 'px',
      this.advertisementStyle.height=(this.htmlWidth/1080)*1920 + 'px'

      //因为图片的高度大于宽度，所以将宽度设置为100%就可以，高度根据宽度比例
			/* 图片回显 */
			// this.getPic(res.obj.photoId)
      let userId = "1146970360172109824"
      if(userId != null && userId != '' && userId){
        this.userId = userId;
      }
      let storeId = this.$route.query.storeId
      if(storeId != null && storeId != '' && storeId){
        this.storeId = storeId;
      }
      let merchantId = this.$route.query.merchantId
      if(merchantId != null && merchantId != '' && merchantId){
        this.merchantId = merchantId;
      }
		},
		mounted() {
			/* 判断广告类型三-自动跳转 */
      //获取广告类型状态
      getAdvertisement(this.userId,this.storeId,this.merchantId).then((res)=>{
        console.log('广告状态')
        console.log(res)
        this.type=res.obj[0].type;
        this.imageId=res.obj[0].imageId;
        this.imageLink=res.obj[0].imageLink;
        if(this.type==3)
        {
          console.log('直接跳转')
          window.location.href = 'http://www.baidu.com'
        }
        else if(this.type==2)
        {
          console.log('有图片，不可点击')
        }
        else if(this.type==1)
        {
          console.log('有图片点击跳转')
          var img = this.getPic(this.imageId)
          this.advertisementStyle.background="url('"+ img +"') no-repeat";
        }
      })

		},
		methods:{
			/* 页面跳转 */
			jumpLink () {
				/* 判断广告类型一-点击跳转 */
				if(this.type == 1){
					window.location.href = 'http://www.baidu.com'
				}
			},
			/* 图片回显 */
			getPic(val) {
			  console.log(val)
				var url = baseURL + '/fms/upload/resource/' + val
				return url
			},
			btn(){
				// window.location.href = 'weixin://wxpay/bizpayurl?pr=89Fkczt'
				
				// WeixinJSBridge.invoke("openUrlByExtBrowser",{
				// 		"url" : "http://www.baidu.com"
				// 	},
				// 	function(e){
				// 		alert(e.err_msg)
				// 	}
				// )
				
				// wx.scanQRCode({
				// 	needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				// 	scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				// 	success: function (res) {
				// 		var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				// 	}
				// });
				
				// WeixinJSBridge.invoke('scanQRCode',{
				// 	'appid': 'wx1234567890', // 公众号appID
				// 	'desc' : 'desc', // 描述
				// 	'needResult' : 1, // 非必填，扫码处理方式。1：直接返回扫描结果，0：扫码结果由微信处理。默认为0
				// 	'scanType':['qrCode','barCode'] // 非必填，扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，默认全选
				// },function(res){
				// 	alert(res.resultStr);
				// });
			},
			
		}
	}
</script>

<style>
	body,p{
		/* background-color: #FFF; */
		margin: 0;
		padding: 0;
		max-width:100%;
		/* font-size: 1.125rem; */
	}
	.text-sm{	/* 14 */
		font-size: 0.875rem;
	}
	.text-lg{	/* 24 */
		font-size: 1.5rem;
	}
	.text-llg{	/* 36 */
		font-size: 2.25rem;
	}
	.text-lllg{	/* 64 */
		font-size: 4rem;
	}
	.text-weight{
		font-weight: 800;
	}
	.text-ff4500{	/* 橙红 */
		color: #ff4500;
	}
	.text-2dc26f{	/* 绿 */
		color: #2dc26f;
	}
	.text-grey{		/* 草灰 */
		color: #a9a9a9;
	}
	.text-red{		/* 红色 */
		color: #E60000;
	}
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.lf-advertisement{
		/* background-color: #9ED99D; */
		/*background-image: url(../../assets/test02.png);*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
	}
	.box{
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
</style>
