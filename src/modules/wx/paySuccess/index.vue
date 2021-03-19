<template>
	<div>
		<!-- 导航栏 -->
		<!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
			<div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
			<div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
				<div>
					<span class="lf-icon-close text-lg"></span>
					<span>支付成功</span>
				</div>
				<span class="lf-icon-ellipsis text-lg"></span>
			</div>
		</div>
		<div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
		<!-- 内容 -->
		<div class="lf-center" :style="{height: htmlProportion * 260 + 'px'}">
			<span class="iconfont lf-icon-checkcircleo text-lllg text-color-blue"></span>
		</div>
		<div class="lf-center" :style="{height: htmlProportion * 40 + 'px'}">
			<span class="text-lg text-w">{{price}}</span>
		</div>
		<div class="lf-center" :style="{height: htmlProportion * 120 + 'px'}">
			<span class="text-sm text-grey">{{timeStamp | timeStampFilters}}</span>
		</div>
		<div class="lf-text">
			<div class="lf-between" :style="{height: htmlProportion * 80 + 'px'}">
				<span class="text-grey">订单编号</span>
				<span class="text-sm">{{orderNumber}}</span>
			</div>
      <!--
			<div class="lf-between" :style="{height: htmlProportion * 80 + 'px'}">
				<span class="text-grey">商家折扣</span>
				<span class="text-sm">0.00元</span>
			</div>
			-->
			<div class="lf-between lf-border-line" :style="{height: htmlProportion * 80 + 'px'}">
				<span class="text-grey">支付方式</span>
				<span class="text-sm">{{showPayWay()}}</span>
			</div>
		</div>
    <!--广告-->
    <div class="adver-ban" v-if="imgArr.length">
      <div class="adver-ban-body">
        <mu-carousel class="adver-ban-carousel"
                     :interval="12000"
                     hide-controls>
          <mu-carousel-item v-for="(item, index) in imgArr" :key="index">
            <img :src="item.imageUrl" @click="turnUrl(item)">
          </mu-carousel-item>
        </mu-carousel>
      </div>
    </div>
	</div>
</template>

<script>
  import { getAdvertisementPaySuccess } from '../../../api/vueAPI.js'
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
        imgArr: []
			}
		},
		created() {
			this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
			this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
			this.htmlProportion = this.htmlWidth / 750 ;
			// console.log(this.htmlWidth);
			// console.log(this.htmlheight);
			this.price = this.$route.query.price;
      this.timeStamp = this.$route.query.timeStamp;
			this.orderNumber = this.$route.query.orderNumber;
      this.merchantId = this.$route.query.merchantId;
      this.getAdvertiseInfo() // 获取广告地址
		},
		filters:{
			timeStampFilters(val) {
				if(val == null && val == '' && val == undefined){
					return
				}
        val = val + ''
        if (val.length > 10) {
          val = parseInt(Number(val) / 1000)
        }
				let date = new Date(parseInt(val) * 1000);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			}
		},
		methods:{
		  showPayWay() {
		    let payWay = parseInt(this.$route.query.payWay)
        let payName = '未知'
		    switch (payWay) {
          case 1:
            payName = '微信支付'
            break
          case 2:
            payName = '支付宝支付'
            break
          case 3:
            payName = '银行卡支付'
            break
          case 4:
            payName = '会员支付'
            break
          default:
            payName = '未知'
            break
        }
        return payName
      },
		  getAdvertiseInfo() {
		    let params = {
          merchantId: this.merchantId,
          fromRange: 7
        }
        getAdvertisementPaySuccess(params).then(res => {
          this.imgArr = res.obj
        })
      },
      turnUrl(data) {
		    if (data.imageLink) {
          window.location.href = data.imageLink
        }
      }
			/* 页面跳转 */
			// jump (url) {
			// 	this.$router.push({
			// 		path:url,
			// 		query:{}	//传参
			// 	})
			// }
		}
	}
</script>

<style>
	body{
		background-color: #FFF;
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
  .text-color-blue{
    color: #4BA8FF;
  }
	.margin-right-10{
		margin-right: 0.625rem;
	}
	.lf-nav{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 80px; */
		background-color: #F5F2F0;
		/* border-bottom: 0.0625rem solid #bdbdc6; */
	}
	.lf-nav-mat{
		width: 100%;
		/* height: 40px; */
	}
	.lf-nav-text{
		width: 100%;
		/* height: 80px; */
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-nav-text > div{
		display: flex;
		align-items: center;
	}
	.lf-nav-text span{
		margin: 0 0.625rem;
	}
	.lf-center{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.lf-text{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: center;
	}
	.lf-between{
		width: 90%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.lf-border-line{
		border-bottom: 0.0625rem solid #bdbdc6;
	}
  .adver-ban{
    margin-top: 1.2rem;
    position: relative;
    height: 0;
    width: 100%;
    padding-top: 80%;
  }
  .adver-ban-body{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .adver-ban-carousel{
    width: 100% !important;
    height: 100% !important;
  }
  .adver-ban-carousel img{
    width: 100%;
    height: 100%;
  }
  .adver-ban-carousel .mu-carousel-indicator-icon {
    width: 7px;
    height: 7px;
  }
  .adver-ban-carousel .mu-carousel-indicator-button{
    width: 7px;
    height: 7px;
    margin: 0 5px;
  }
  .adver-ban-carousel .mu-carousel-indicator-icon{
    opacity: 1;
    background-color: #fff;
  }
  .adver-ban-carousel .mu-carousel-indicator-button__active .mu-carousel-indicator-icon {
    background-color: #4BA8FF;
  }
</style>
