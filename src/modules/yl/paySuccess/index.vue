<template>
  <div>
    <div class="payinput">
      <div class="payinput-container">
        <!--店铺信息-->
        <div class="shopinfo">
          <div class="inline-block">
            <div class="shop-imgname">
              <div class="shop-img icon-position" :style="{backgroundImage: 'url(\''+ imgBg +'\')'}"></div>
              <div class="shop-name justcenter">
                <div class="ellipsis1 textleft">{{merchantName? merchantName:'测试商家名'}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--<p >{{latitude}}****{{longitude}}</p>
        <button @click="getLocation">试一下2z</button>-->
        <!--金额输入框-->
        <div class="payprice" v-click-outside="hideKeyboard">
          <div class="payprice-container" @click.stop="showKeyboard">
            <div class="payprice-body justcenter">
              <div class="payprice-tips">支付金额</div>
              <div class="payprice-value" :class="{'cursor-blue':showKeyboardStatus}"><span>¥</span>{{payMoney}}</div>
              <div class="payprice-tipred">{{priceTip}}</div>
            </div>
          </div>
          <keyboard v-model="payMoney" v-if="showKeyboardStatus" :maxVal="maxPrice"></keyboard>
        </div>
        <div class="payremark">
          <input v-model="remark" type="text" maxlength="20" placeholder="添加备注(20个字以内)">
          <div class="remark-close icon-position" :style="{backgroundImage: 'url(\''+ imgCloseBg +'\')'}" @click="clearRemark"
            v-if="remark"></div>
        </div>
      </div>
      <div class="paybtns btnsblue mt40 justcenter" @click="turnToPay"><span>云闪付付款</span></div>
      <!--弹窗提示-->
      <div class="zfb-mask" v-if="showMask"></div>
      <div class="confirm-dialog" v-if="showModal" @click="cancelPay">
        <div class="confirm-body" @click.stop>
          <div class="confirm-title">提示</div>
          <div class="confirm-content">确认要进行付款吗？</div>
          <div class="confirm-btns">
            <div class="confirm-cancel" @click="cancelPay">取消</div>
            <div class="confirm-sure" @click="confirmPay">确定</div>
          </div>
        </div>
      </div>
      <div v-if="tipShow" class="tipmodal">{{tipsText}}</div>
    </div>
    <div style="width: 100vw;overflow-x: hidden;" v-if="false">
      <!-- 导航栏 -->
      <!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
        <div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
        <div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
          <div>
            <span class="lf-icon-close text-lg"></span>
            <span>给商户付款</span>
          </div>
          <span class="lf-icon-ellipsis text-lg"></span>
        </div>
      </div>
      <div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
      <!-- 内容 -->
      <div class="lf-store-name" :style="{height: htmlProportion * 150 + 'px'}">
        <span class="text-lg" style="opacity: 0;">{{merchantName? merchantName:'测试商家名'}}</span>
      </div>
      <div class="lf-pay-panel" style="height: 10rem;">
        <div>
          <div class="one">
            <span class="text-sm">请向收银员询问应付金额</span>
          </div>
          <div class="two" :class="equipmentId?'disabledinput':''">
            <span class="text-llg">{{yenSymbol}}</span>
            <input class="text-lg pay-price-input" style="padding: 0.1875rem 0.3125rem;" type="number" v-model="payMoney"
              ref="inputRef">
          </div>
          <div class="three">
            <input v-model="remark" class="text-grey" type="text" maxlength="20" placeholder="添加备注(20个字以内)">
          </div>
        </div>
      </div>
      <div class="lf-pay-btn" :style="{height: htmlProportion * 200 + 'px'}">
        <div @click="turnToPay">
          <span class="text-lg text-fs">付 款</span>
        </div>
      </div>
      <!-- <p>userId: {{userId}}</p> -->
      <!-- <p>进程状态: {{testProcess}}</p> -->
      <!-- <p>支付金额: {{testMoney}}</p> -->
      <!-- <p>接口反馈: {{testRes}}</p> -->
      <!-- <p>错误信息: {{testFail}}</p> -->
      <div class="zfb-mask" v-if="showMask"></div>
      <div class="confirm-dialog" v-if="showModal" @click="cancelPay">
        <div class="confirm-body" @click.stop>
          <div class="confirm-title">提示</div>
          <div class="confirm-content">确认要进行付款吗？</div>
          <div class="confirm-btns">
            <div class="confirm-cancel" @click="cancelPay">取消</div>
            <div class="confirm-sure" @click="confirmPay">确定</div>
          </div>
        </div>
      </div>
      <div v-if="tipShow" class="tipmodal">{{tipsText}}</div>
    </div>
  </div>
</template>

<script>
  import {
    getWebPay,
    getMerchantName,
    getStoreName
  } from '../../../api/vueAPI.js'
  import {
    initParams
  } from '@/utils/initParams.js'
  import imgBg from '@/assets/iconimg/icon-shop.png'
  import imgCloseBg from '@/assets/iconimg/icon-close.png'
  import iconCheck from '@/assets/iconimg/icon-check.png'
  import iconChecked from '@/assets/iconimg/icon-checked.png'
  import iconWeixin from '@/assets/iconimg/icon-weixin.png'
  import iconBank from '@/assets/iconimg/icon-bank.png'
  import keyboard from '@/components/keyboard.vue'
  export default {
    components: {
      keyboard
    },
    data() {
      return {
        longitude: '', //经度
        latitude: '', //纬度
        imgBg,
        imgCloseBg,
        iconCheck,
        iconChecked,
        iconWeixin,
        iconBank,
        showKeyboardStatus: false, // 键盘显隐
        priceTip: '', // 金额无效提示
        maxPrice: 99999999, // 最大支付金额
        reg: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/,
        showModal: false,
        cleartime: null,
        tipShow: false,
        tipsText: '',
        htmlProportion: '', //屏幕长宽比例
        htmlWidth: '', //屏幕宽
        htmlheight: '', //屏幕高
        isWxPay: true,
        yenSymbol: '\u00A5', //金钱符号
        payMoney: '', //实付金额
        userId: '', //商户门店userId
        testProcess: '',
        testMoney: '',
        testRes: '暂无数据',
        testFail: '暂无错误信息',
        merchantName: '--',
        hasPoint: false,
        showMask: false,
        equipmentId: '',
        goodsOrderId: '',
        hbFqNum: '',
        remark: '' // 备注
      }
    },
    watch: {
      payMoney(val, oldVal) {
        this.checkInputPrice(val, true)
      }
    },
    created() {
      let equipmentId = initParams(this.$route.query.equipmentId)
      if (equipmentId) {
        this.equipmentId = equipmentId
      }
      this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
      this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
      this.htmlProportion = this.htmlWidth / 750;
      // console.log(this.htmlWidth);
      // console.log(this.htmlheight);
      let payMoney = sessionStorage.getItem('totalPrice')
      if (Number(payMoney) === 0) {
        payMoney = ''
      }
      this.payMoney = payMoney
      this.userId = sessionStorage.getItem('userId')
      let storeId = sessionStorage.getItem('storeId')
      this.storeId = '';
      if (storeId != null && storeId != '' && storeId) {
        this.storeId = storeId
      }
      // 预下单
      let goodsOrderId = sessionStorage.getItem("goodsOrderId")
      if (goodsOrderId != null && goodsOrderId != '' && goodsOrderId != 'null' && goodsOrderId != 'undefined' &&
        goodsOrderId) {
        this.goodsOrderId = goodsOrderId
      }
      // 花呗分期
      let hbFqNum = sessionStorage.getItem("hbFqNum")
      if (hbFqNum != null && hbFqNum != '' && hbFqNum != 'null' && hbFqNum != 'undefined' && hbFqNum) {
        this.hbFqNum = hbFqNum
      }

      this.testProcess = '创建页面'
      this.testMoney = this.payMoney
      this.getMerchantInfo()
      /*
			getMerchantName(this.userId).then(res => {
				this.testProcess = '商家信息调取成功'
				// this.testRes = res
				console.log(res)
				this.merchantName = res.obj
			}).catch(err => {
				console.log(err)
					this.testProcess = '商家信息调取失败，尝试获得错误信息'
					this.testFail = err
			})
			*/
    },
    mounted() {
      // var x=document.getElementById("demo");
      if (this.payMoney <= 0) {
        // 金额小于等于零的条件下，需要出发键盘
        this.$nextTick(() => {
          if (this.equipmentId) {
            return
          }
          this.payMoney = ''
          this.showKeyboardStatus = true
        })
      }
      /*
      let eles = this.$refs.inputRef
      this.numberPercent(eles)
      */
    },
    methods: {
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition, this.positionError);
        } else {
          this.latitude = "Geolocation is not supported by this browser.";
        }
      },
      showPosition(position) {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude;
      },
      positionError(err) {
        alert('ERROR(' + err.code + '): ' + 'GPS访问被拒绝 或 GPS未开启')
        /* plus.geolocation.getCurrentPosition(function(p) {
           //debugCom.log(JSON.stringify(p))
           data.result = true;
           data.position = p;
           data.code = 0;
           data.msg = '';
           //回调
           callback(data);
         }, function(e) {
           console.log(JSON.stringify(e))
           data.result = false;
           data.code = e.code;
           switch(e.code) {
             case 1:
               data.msg = "GPS访问被拒绝 或 GPS未开启";
               break;
             case 2:
               data.msg = "位置信息不可用";
               break;
             case 3:
               data.msg = "获取用户位置的请求超时";
               break;
             default:
               data.msg = e.message;
               break;
           }
           if(data.msg == '')
             data.msg = "获取用户位置的请求超时";
           //回调
           callback(data);
         }*/
        // console.warn('ERROR(' + err.code + '): ' + err.message);
        // this.errorData = 'ERROR(' + err.code + '): ' + err.message
      },
      /**
       * 获取门店信息
       * */
      getMerchantInfo() {
        let storeId = this.storeId
        let userId = this.userId
        if (storeId || userId) {
          let params = {
            storeId: storeId,
            userId: userId
          }
          getStoreName(params).then(res => {
            this.merchantName = res.obj
          }, err => {
            this.merchantName = '--'
          })
        } else {
          this.merchantName = '--'
        }
      },
      /**
       * 校验金额
       **/
      checkInputPrice(value, showTip) {
        let priceTip = ''
        let valueOrigin = value
        value = Number(value)
        if (isNaN(value)) {
          priceTip = '请输入有效金额'
        }
        let reg = this.reg
        if (reg.test(value)) {
          if (value > this.maxPrice) {
            priceTip = '金额不能大于' + this.maxPrice
          } else if (value === 0) {
            if (valueOrigin === '') {
              priceTip = '请输入有效金额'
            } else {
              priceTip = '金额不能为零'
            }
          } else {
            let arr = valueOrigin.split('.')
            if (arr[0] === '') {
              arr[0] = '0'
            } else {
              arr[0] = Number(arr[0])
            }
            if (arr[1] && arr[1].length > 2) {
              priceTip = '请输入有效金额'
            }
            this.payMoney = arr.join('.')
          }
        } else {
          priceTip = '请输入有效金额'
        }
        if (showTip) {
          this.priceTip = priceTip
        }
        return priceTip
      },
      /**
       * 清楚备注
       **/
      clearRemark() {
        this.remark = ''
      },
      /**
       * 键盘隐藏
       **/
      hideKeyboard() {
        this.showKeyboardStatus = false
        this.checkInputPrice(this.payMoney, true)
      },
      /**
       * 键盘显示
       **/
      showKeyboard() {
        if (this.equipmentId) {
          return
        }
        this.showKeyboardStatus = true
      },
      /*
		  numberPercent(eles) {
        let that = this
        eles.onkeydown = (e)=> {
          let key = e.keyCode
          if ((key > 95 && key < 106) || (key > 47 && key < 60) || key == 110 || key == 190 || key == 8 ||key == 46 || key == 13 || key == 9 || key == 37 || key == 39) {
            // 允许输入数字，小数点，删除键，回车键,8:BackSpace;9:Tab;46:Delete;37:Left;39:Right
            if (e.keyCode === 190 || e.keyCode === 110) {
              // 禁止多个点
              if (that.hasPoint) {
                return false
              } else {
                that.hasPoint = true
              }
            } else {
              // 禁止多个点
              let str = that.payMoney || ''
              if (str.indexOf('.') > -1) {
                that.hasPoint = true
              } else {
                that.hasPoint = false
              }
              if (!(e.keyCode === 8 || e.keyCode === 46)) {
                // 禁止小数点后多位
                let valArr = str.split('.')
                if (valArr[1] && valArr[1].length > 1 ) {
                  that.payMoney = parseFloat(str).toFixed(1)
                }
              }
            }
          } else {
            return false
          }
        }
      },
      */
      turnToPay() {
        let paymentMoney = Number(this.payMoney) + ''
        if (paymentMoney.trim().match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)) {
          paymentMoney = Number(paymentMoney) + ''
          if (paymentMoney === '0') {
            this.showTips('支付金额要大于零')
            this.payMoney = ''
            return
          }
        } else {
          this.showTips('请输入有效金额')
          this.payMoney = ''
          return
        }
        this.showModal = true
      },
      cancelPay() {
        this.showModal = false
      },
      confirmPay() {
        this.cancelPay()
        this.payment()
      },
      showTips(text) {
        if (this.cleartime) {
          this.tipShow = false
          this.tipsText = ''
          clearTimeout(this.cleartime)
        }
        this.tipShow = true
        this.tipsText = text
        this.cleartime = setTimeout(() => {
          this.tipsText = ''
          this.tipShow = false
        }, 800)
      },
      /* 付款 */
      payment() {
        this.testProcess = '进行付款'
        let uuid = initParams(this.$route.query.uuid)
        let equipmentId = initParams(this.$route.query.equipmentId)
        this.showMask = true
        let md5Str = sessionStorage.getItem('md5Str')
        let timestramp = sessionStorage.getItem('timestramp')
        getWebPay(9, this.payMoney, this.userId, this.storeId, uuid, equipmentId, this.remark, md5Str, timestramp, this
          .goodsOrderId, this.hbFqNum).then(res => {
          this.testProcess = '付款接口调取成功，进行付款跳转'
          console.log(res)
          this.testRes = JSON.stringify(res)
          window.location.href = res.obj.payUrl //跳转外部链接-银联支付链接
          setTimeout(() => {
            this.showMask = false
          }, 500)
        }).catch(err => {
          console.log(err)
          this.showMask = false
          this.testProcess = '付款接口调取失败，尝试获得错误信息'
          this.testFail = err
        })
      }
    }
  }
</script>

<style>
  .payprice-tipred {
    position: absolute;
    bottom: 0;
    right: 0.8rem;
    color: red;
    font-size: 0.373rem;
  }

  .mt40 {
    margin-top: 1.067rem !important;
  }

  .ellipsis1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }

  .justcenter {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .textleft {
    text-align: left;
  }

  .icon-position {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .payinput-container {
    margin-top: 0.533rem;
    background-color: #fff;
  }

  .shopinfo {
    padding: 0.8rem 0;
    text-align: center;
  }

  .inline-block {
    display: inline-block;
  }

  .shop-imgname {
    display: flex;
  }

  .shop-img {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f0f0f0;
  }

  .shop-name {
    margin-left: 0.533rem;
    max-width: calc(92vw - 3.2rem);
    font-size: 0.853rem;
    color: #333;
    font-weight: 500;
  }

  .payprice-container {
    position: relative;
    width: 92%;
    height: 0;
    margin: 0 auto;
    height: 3.733rem;
    /*padding-top: 20.29%;*/
    border: 0.053rem solid #4BA8FF;
    border-radius: 0.267rem;
  }

  .payprice-body {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .payprice-tips {
    margin-left: 0.8rem;
    font-size: 0.96rem;
    color: #666;
  }

  .payprice-value {
    margin-right: 0.8rem;
    padding-right: 0.267rem;
    font-size: 1.493rem;
    line-height: 1.1;
    color: #333;
    font-weight: 500;
    border-right: 0.053rem solid #fff;
  }

  .cursor-blue {
    border-right: 0.053rem solid #2C97FD;
    animation: blink 1s infinite steps(1, start)
  }

  @keyframes blink {
    0% {
      border-right: 0.053rem solid #fff;
    }

    50% {
      border-right: 0.053rem solid #2C97FD;
    }

    100% {
      border-right: 0.053rem solid #fff;
    }
  }

  .payremark {
    position: relative;
    width: 92%;
    margin: 0 auto;
    margin-top: 0.267rem;
    padding: 0.267rem 0;
  }

  .payremark input {
    width: 100%;
    height: 2.4rem;
    line-height: 2.4rem;
    border: none;
    font-size: 0.853rem;
  }

  .payremark input:focus {
    outline: none;
  }

  .remark-close {
    position: absolute;
    width: 0.853rem;
    height: 0.853rem;
    right: 0;
    top: 1.067rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .payselect {
    display: flex;
    padding: 0 4%;
    height: 2.4rem;
    border-bottom: 1px solid #eee;
  }

  .payselect:last-child {
    border-bottom: 1px solid #fff;
  }

  .payselect-li {
    width: 100%;
  }

  .payselect-icon {
    width: 1.067rem;
    height: 1.067rem;
  }

  .payselect-name {
    margin: 0 0.267rem;
    flex: 1;
  }

  .payselect-check {
    position: relative;
    width: 1.067rem;
    height: 1.067rem;
  }

  .icon-check {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .paybtns {
    width: 84%;
    height: 2.613rem;
    margin: 0 auto;
    margin-top: 0.533rem;
    color: #4BA8FF;
    font-size: 0.96rem;
    font-weight: 500;
    border: 1px solid #4BA8FF;
    border-radius: 0.267rem;
  }

  .paybtns span {
    display: block;
    width: 100%;
    text-align: center;
  }

  .btnsblue {
    background-color: #4BA8FF;
    color: #fff;
  }

  /*-------------------------------------------------改版结束----------------------------*/
  body {
    background-color: #F5F2F0;
    /* font-size: 1.125rem; */
  }

  .text-sm {
    /* 14 */
    font-size: 0.875rem;
  }

  .text-lg {
    /* 24 */
    font-size: 1.5rem;
  }

  .text-llg {
    /* 36 */
    font-size: 2.25rem;
  }

  .text-fs {
    font-size: 1.2rem;
  }

  .text-weight {
    font-weight: 800;
  }

  .text-ff4500 {
    /* 橙红 */
    color: #ff4500;
  }

  .text-2dc26f {
    /* 绿 */
    color: #2dc26f;
  }

  .text-grey {
    /* 草灰 */
    color: #a9a9a9;
  }

  .margin-right-10 {
    margin-right: 0.625rem;
  }

  .lf-nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    /* height: 80px; */
    background-color: #F1F1F3;
    border-bottom: 0.0625rem solid #bdbdc6;
  }

  .lf-nav-mat {
    width: 100%;
    /* height: 40px; */
  }

  .lf-nav-text {
    width: 100%;
    /* height: 80px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lf-nav-text>div {
    display: flex;
    align-items: center;
  }

  .lf-nav-text span {
    margin: 0 0.625rem;
  }

  .lf-store-name {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lf-pay-panel {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFF;
    border-top: 0.0625rem solid #bdbdc6;
    border-bottom: 0.0625rem solid #bdbdc6;
  }

  .lf-pay-panel>div {
    width: 80%;
    height: 9rem;
  }

  .lf-pay-panel .one {
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
  }

  .lf-pay-panel .two {
    width: 100%;
    height: 3.5rem;
    display: flex;
    align-items: center;
    border-bottom: 0.0625rem solid #bdbdc6;
  }

  .lf-pay-panel .three {
    width: 100%;
    height: 30%;
    margin-top: 2.5%;
    display: flex;
    align-items: center;
  }

  .lf-pay-panel .three input {
    border: 0;
    width: 100%;
    height: 100%;
  }

  .lf-pay-panel .three input:focus {
    outline: none;
    border: none;
  }

  .lf-pay-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lf-pay-btn>div {
    width: 80%;
    height: 50%;
    background-color: #4BA8FF;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.625rem;
    color: #FFF;
  }

  .pay-price-input {
    border: none;
  }

  .pay-price-input:focus {
    outline: none;
    border: none;
  }

  .zfb-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 9;
  }

  .disabledinput {
    position: relative;
  }

  .disabledinput:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
  }

  /*-弹窗--开始-*/
  .confirm-dialog {
    position: fixed;
    margin-top: 0 !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 3;
  }

  .confirm-body {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 80%;
    background-color: #fff;
    border-radius: 10px;
    transform: translate(-50%, -50%);
  }

  .confirm-title {
    padding-top: 10px;
    line-height: 30px;
    font-size: 16px;
    font-weight: 500;
  }

  .confirm-content {
    padding: 10px;
    min-height: 60px;
    font-size: 14px;
    line-height: 20px;
    color: #666;
  }

  .confirm-btns {
    position: relative;
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-top: 1px solid #dedede;
  }

  .confirm-btns:after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    border-right: 1px solid #dedede;
  }

  .confirm-sure {
    color: #4BA8FF;
  }

  .confirm-btns>div {
    flex: 1;
  }

  /*-弹窗--结束-*/
  .tipmodal {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 20px;
    border-radius: 5px;
    fotn-size: 14px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 6;
  }
</style>
