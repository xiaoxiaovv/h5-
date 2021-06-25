<template>
  <div>
    <div class="payinput">
      <div class="payinput-container">
        <!--店铺信息-->
        <div class="shopinfo">
          <div class="inline-block">
            <div class="shop-imgname">
              <div class="shop-img icon-position"
                   :style="{backgroundImage: 'url(\''+ imgBg +'\')'}"></div>
              <div class="shop-name justcenter">
                <div class="ellipsis1 textleft">{{merchantName? merchantName:'测试商家名'}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--<p >{{ latitude}}****{{ longitude}}</p>
        <p>错误：{{errorData}}</p>
        <button @click="getLocation">试一下4w</button>
        金额输入框-->
        <div class="payprice"
             v-click-outside="hideKeyboard">
          <div class="payprice-container"
               @click.stop="showKeyboard">
            <div class="payprice-body justcenter">
              <div class="payprice-tips">支付金额</div>
              <div class="payprice-value"
                   :class="{'cursor-blue':showKeyboardStatus}"><span>¥</span>{{paymentMoney}}</div>
              <div class="payprice-tipred">{{priceTip}}</div>
            </div>
          </div>
          <keyboard v-model="paymentMoney"
                    v-if="showKeyboardStatus"
                    :maxVal="maxPrice"></keyboard>
        </div>
        <!--优惠券-->
        <div class="payselect"
             style="margin-top: 20px;"
             v-if="isMember && showMemberPay">
          <div class="payselect-li justcenter"
               @click="showCoupon">
            <div class="payselect-icon icon-position"
                 style="height: inherit;"><span class="text-blue iconfont  lf-icon-youhuiquan"></span></div>
            <div class="payselect-name"
                 style="padding-left: 30px;text-align: right;">
              <span v-if="isSelectCoupon">{{isSelectCoupon.name || isSelectCoupon.remark}}</span>
              <span v-else>{{ canUseCouponList.length ? canUseCouponList.length+'张可用优惠券': couponList.length ? '有'+couponList.length+'张优惠券':'暂无可用优惠'}}</span>
            </div>
            <div class="payselect-check"
                 style="height: inherit;color: #999;">
              <span class="iconfont lf-icon-right"></span>
            </div>
          </div>
        </div>
        <div class="payremark">
          <input v-model="wxRemark"
                 type="text"
                 maxlength="20"
                 placeholder="添加备注(20个字以内)">
          <div class="remark-close icon-position"
               :style="{backgroundImage: 'url(\''+ imgCloseBg +'\')'}"
               @click="clearRemark"
               v-if="wxRemark"></div>
        </div>
      </div>
      <div class="payinput-container">
        <!--支付选择-->
        <div class="payselect">
          <div class="payselect-li justcenter"
               @click="changeMemberPayWay(true)">
            <div class="payselect-icon icon-position"
                 :style="{backgroundImage: 'url(\''+ iconWeixin +'\')'}"></div>
            <div class="payselect-name">微信支付</div>
            <div class="payselect-check">
              <template v-if="isMember">
                <div class="icon-check icon-position"
                     :style="{backgroundImage: 'url(\''+ iconCheck +'\')'}"
                     v-if="isMemberRadio"></div>
                <div class="icon-check icon-position"
                     :style="{backgroundImage: 'url(\''+ iconChecked +'\')'}"
                     v-if="!isMemberRadio"></div>
              </template>
              <template v-else>
                <div class="icon-check icon-position"
                     :style="{backgroundImage: 'url(\''+ iconChecked +'\')'}"></div>
              </template>
            </div>
          </div>
        </div>
        <div class="payselect"
             v-if="isMember && showMemberPay">
          <div class="payselect-li justcenter"
               @click="changeMemberPayWay(false)">
            <div class="payselect-icon icon-position"
                 :style="{backgroundImage: 'url(\''+ iconBank +'\')'}"></div>
            <div class="payselect-name">会员储值支付({{yenSymbol}}{{memberMoney}})</div>
            <div class="payselect-check">
              <div class="icon-check icon-position"
                   :style="{backgroundImage: 'url(\''+ iconCheck +'\')'}"
                   v-if="!isMemberRadio"></div>
              <div class="icon-check icon-position"
                   :style="{backgroundImage: 'url(\''+ iconChecked +'\')'}"
                   v-if="isMemberRadio"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="paybtns btnsblue mt40 justcenter"
           @click="payConfirmModal"><span>付款 <template v-if="actualPayment !== '0' && actualPayment">{{yenSymbol}}{{actualPayment}}</template></span></div>
      <!--<div class="paybtns btnsblue mt40 justcenter"
           @click="onBridgeReady"><span>付款测试1 用这个<template v-if="actualPayment !== '0' && actualPayment">{{yenSymbol}}{{actualPayment}}</template></span></div>-->
      <div class="paybtns justcenter"
           v-if="(!isMember) && showMemberPay"
           @click="jumpAddMember"><span>加入会员</span></div>
    </div>

    <div>
      <!-- 优惠券选取 -->
      <transition name="couponSelect">
        <div v-if="isShowCoupon">
          <div class="lf-cover"
               @click="closeCoupon"></div>
          <div class="lf-coupon-modal padding"
               style="width: 100%;">
            <p class="confirm"><span class="text-sm">选择优惠券</span><span class="text-ssm btn"
                    @click="closeCoupon">确定</span></p>
            <div class="lf-no-coupon"
                 @click="changeSelection(-1)">
              <span class="text-ssm text-weight">不使用优惠券</span>
              <img src="../../../assets/selection_orange.png"
                   v-if="isShowSelection">
              <img src="../../../assets/selection_grey.png"
                   v-else>
            </div>
            <div class="lf-coupon-box">
              <!-- 可用优惠券 -->
              <div class="flex coupon-title">
                <div class="flex-1 line"></div>
                <div class="text">可用优惠券({{canUseCouponList.length}}张)</div>
                <div class="flex-1 line"></div>
              </div>
              <div class="counpnlist">
                <div class="counpnlist-li flex"
                     v-for="(card,key) in canUseCouponList"
                     :key="key"
                     @click="changeSelection(key)">
                  <div class="counpn-img">
                    <img :src="card.photoSrc? card.photoSrc:'../../../assets/icon_member_default.png'">
                  </div>
                  <div class="counpn-dec">
                    <div class="counpn-dec-sec">
                      <div class="coupon-name">{{card.name}}</div>
                      <div class="coupon-ptip flex">
                        <span class="coupon-price">{{yenSymbol}}{{card.money}}</span>
                        <span class="coupon-tip"><span>{{card.miniExpendLimit == 0 ? '满任意金额可用':'满'+card.miniExpendLimit+'金额可用'}}</span></span>
                      </div>
                      <div class="coupon-time">
                        <span>有效期：{{card.validTimeStart.split(' ')[0]}}—{{card.validTimeEnd.split(' ')[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="counpn-check">
                    <img src="../../../assets/selection_orange.png"
                         v-if="card.selectStatus">
                    <img src="../../../assets/circular_orange.png"
                         v-else>
                  </div>
                  <div class="counpn-circle top"></div>
                  <div class="counpn-circle bottom"></div>
                </div>
              </div>
              <!-- 不可用优惠券 -->
              <div class="flex coupon-title"
                   v-if="canNotUseCouponList.length">
                <div class="flex-1 line"></div>
                <div class="text">不可用优惠券({{canNotUseCouponList.length}}张)</div>
                <div class="flex-1 line"></div>
              </div>
              <div class="counpnlist counpnlist-invalid">
                <div class="counpnlist-li flex"
                     v-for="(card,key) in canNotUseCouponList"
                     :key="key">
                  <div class="counpn-img">
                    <img :src="card.photoSrc? card.photoSrc:'../../../assets/icon_member_default.png'">
                  </div>
                  <div class="counpn-dec">
                    <div class="counpn-dec-sec">
                      <div class="coupon-name">{{card.name}}</div>
                      <div class="coupon-ptip flex">
                        <span class="coupon-price">{{yenSymbol}}{{card.money}}</span>
                        <span class="coupon-tip"><span>{{card.miniExpendLimit == 0 ? '满任意金额可用':'满'+card.miniExpendLimit+'金额可用'}}</span></span>
                      </div>
                      <div class="coupon-time">
                        <span>有效期：{{card.validTimeStart.split(' ')[0]}}—{{card.validTimeEnd.split(' ')[0]}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="counpn-check">
                    <img src="../../../assets/circular_grey.png">
                  </div>
                  <div class="counpn-circle top"></div>
                  <div class="counpn-circle bottom"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <!-- 错误提示 -->
      <transition name="tip">
        <div class="lf-err-tip"
             v-if="isPayErr">付款金额有误</div>
        <div class="lf-err-tip"
             v-if="isBalanceErr">会员余额不足</div>
      </transition>
      <div class="confirm-dialog"
           v-if="showModal"
           @click="cancelPay">
        <div class="confirm-body"
             @click.stop>
          <div class="confirm-title">提示</div>
          <div class="confirm-content">确认要进行付款吗？</div>
          <div class="confirm-btns">
            <div class="confirm-cancel"
                 @click="cancelPay">取消</div>
            <div class="confirm-sure"
                 @click="confirmPay">确定</div>
          </div>
        </div>
      </div>
      <div v-if="tipShow"
           class="tipmodal">{{tipsText}}</div>
    </div>

    <div class="lf-box"
         v-if="false">
      <!-- 导航栏 -->
      <!-- <div class="lf-nav" :style=" {height: htmlProportion * 120 + 'px'} ">
        <div class="lf-nav-mat" :style=" {height: htmlProportion * 40 + 'px'} "></div>
        <div class="lf-nav-text" :style=" {height: htmlProportion * 80 + 'px'} ">
          <div>
            <span class="lf-icon-close text-lg"></span>
            <span>向商户付款</span>
          </div>
          <span class="lf-icon-ellipsis text-lg"></span>
        </div>
      </div>
      <div class="lf-mat" :style="{height: htmlProportion * 120 + 'px'}"></div> -->
      <!-- 内容 -->
      <!--  :style="{height: htmlheight  + 'px'}" -->
      <!-- <div class="lf-content"> -->
      <div class="lf-content-payPanel margin-0-auto"
           data-types="malian versions"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: (htmlProportion * 500 - 20) + 'px'}">
        <div>
          <div class="one">
            <span class="text-grey text-sm pricttip-size">付款金额<template v-if="priceTip"><span style="margin-left: 5px;color: red;">({{priceTip}})</span></template></span>
          </div>
          <div class="two"
               :class="equipmentId?'disabledinput':''"
               style="margin-top: 0.5rem;">
            <span class="text-lg">{{yenSymbol}}</span>
            <input type="number"
                   class="text-lg pay-price-input"
                   ref="inputEle"
                   style="padding:0 0.3125rem;"
                   v-model.trim="paymentMoney"
                   @change="judgeCoupon">
          </div>
          <!--<div class="two" @click="showCoupon" v-if="false">-->
          <div class="two"
               @click="showCoupon">
            <span class="text-blue iconfont  lf-icon-youhuiquan"></span>
            <div class="text-grey text-sm">
              <span v-if="isSelectCoupon">{{isSelectCoupon.remark}}</span>
              <span v-else>{{ canUseCouponList.length ? canUseCouponList.length+'张可用优惠券': couponList.length ? '有'+couponList.length+'张优惠券':'暂无可用优惠'}}</span>
              <span class="iconfont lf-icon-right"></span>
            </div>
          </div>
          <div class="three"
               v-if="!priceTip">
            <span class="text-grey text-sm">还需支付</span>
            <span class="text-llg"
                  style="line-height: 1.01;margin-top:0.5rem;">{{yenSymbol}} {{actualPayment}}</span>
          </div>
          <div class="three"
               v-if="priceTip">
            <span class="text-grey text-sm">{{priceTip}}</span>
          </div>
        </div>
      </div>
      <!-- 是会员 -->
      <div class="lf-content-payWay margin-0-auto"
           v-if="isMember"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 270 + 'px'}">
        <div v-if="showMemberPay">
          <span class="text-grey">选择付款方式</span>
          <span class="text-blue iconfont lf-icon-liwu"></span>
        </div>
        <div>
          <div>
            <span class="text-2dc26f iconfont lf-icon-weixinzhifu margin-right-10"></span>
            <span class="text-sm">微信支付</span>
          </div>
          <span v-if="isWxPay"
                class="text-blue iconfont lf-icon-icon-radio"
                :class="{'lf-icon-icon-radio1':isMemberRadio}"
                @click="changeMemberPayWay(true)"></span>
          <span v-else
                class="iconfont lf-icon-icon-radio1"></span>
        </div>
        <div v-if="showMemberPay">
          <div>
            <span class="text-blue iconfont lf-icon-huiyuanqia-copy margin-right-10"></span>
            <span class="text-sm">会员储值卡({{yenSymbol}}{{memberMoney}})</span>
          </div>
          <span v-if="isWxPay"
                class="text-blue iconfont lf-icon-icon-radio"
                :class="{'lf-icon-icon-radio1':!isMemberRadio}"
                @click="changeMemberPayWay(false)"></span>
          <span v-else
                class="iconfont lf-icon-icon-radio1"></span>
        </div>
      </div>
      <!-- 不是会员 -->
      <div class="lf-content-payWay margin-0-auto"
           v-else
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 180 + 'px'}">
        <div>
          <span class="text-grey">选择付款方式</span>
          <span class="text-blue iconfont lf-icon-liwu"></span>
        </div>
        <div>
          <div>
            <span class="text-2dc26f iconfont lf-icon-weixinzhifu margin-right-10"></span>
            <span>微信支付</span>
          </div>
          <span v-if="isWxPay"
                class="text-blue iconfont lf-icon-icon-radio"></span>
          <span v-else
                class="iconfont lf-icon-icon-radio1"></span>
        </div>
      </div>
      <!--如果是微信支付添加支付备注-->
      <div class="wxpay-input"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px'}"
           v-if="(!isMember && isWxPay) || !isMemberRadio">
        <input class="text-grey"
               v-model="wxRemark"
               type="text"
               maxlength="20"
               placeholder="添加备注(20个字以内)">
      </div>
      <div class="lf-content-btn lf-content-btn-one margin-0-auto"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 100 + 'px'}"
           @click="payConfirmModal">
        <span class="text-weight">付款</span>
      </div>

     <!-- <div class="lf-content-btn lf-content-btn-one margin-0-auto"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 100 + 'px'}"
           @click="onBridgeReady">
        <span class="text-weight">付款测试2</span>
      </div>-->
      <div class="lf-content-btn lf-content-btn-two margin-0-auto"
           v-if="(!isMember) && showMemberPay"
           :style="{width: htmlWidth - 60 * htmlProportion + 'px', height: htmlProportion * 100 + 'px'}"
           @click="jumpAddMember">
        <span class="text-weight">加入会员</span>
      </div>
      <div style="height: 2rem;"></div>
      <!-- <div></div> -->
      <!-- <div></div> -->
      <!-- <div></div> -->
      <!-- <div></div> -->
      <!-- </div> -->

    </div>
  </div>
</template>

<script>
import { getMemberCouponList, getWebPay, getCouponList, showMemberPay, getStoreName, getGaoDeKey } from '../../../api/vueAPI.js'
// import {getWebPay, getMerchantName} from '../../../api/vueAPI.js'
import { initParams } from '@/utils/initParams.js'
import imgBg from '@/assets/iconimg/icon-shop.png'
import imgCloseBg from '@/assets/iconimg/icon-close.png'
import iconCheck from '@/assets/iconimg/icon-check.png'
import iconChecked from '@/assets/iconimg/icon-checked.png'
import iconWeixin from '@/assets/iconimg/icon-weixin.png'
import iconBank from '@/assets/iconimg/icon-bank.png'
import keyboard from '@/components/keyboard.vue'
import AMapLoader from '@amap/amap-jsapi-loader';
import loading from '@/common/loading.js'
export default {
  components: { keyboard },
  data() {
    return {
      serviceId: '',
      gdWebSideKey: '',
      geolocation:null,
      errorData:'',
      longitude:'', //经度
      latitude:'', //纬度
      fence: 1,
      imgBg,
      imgCloseBg,
      iconCheck,
      iconChecked,
      iconWeixin,
      iconBank,
      showKeyboardStatus: false,
      showMemberPay: false, // 是否显示会员相关
      showModal: false, // 是否确认支付
      tipShow: false, // 金额无效提示
      cleartime: null, // 金额无效提示
      priceTip: '', // 金额无效提示
      maxPrice: 99999999, // 最大支付金额
      tipsText: '',
      wxRemark: '', // 微信支付，微信备注
      htmlProportion: '',		//屏幕长宽比例
      htmlWidth: '',		//屏幕宽
      htmlheight: '',		//屏幕高
      isWxPay: true,
      yenSymbol: '\u00A5',	//金钱符号
      paymentMoney: '',
      actualPayment: 0,
      isMember: false,		//会员判断
      isMemberRadio: true,	//是否会员支付
      isPayErr: false,		//付款金额有误错误提示框显示
      isBalanceErr: false,		//会员余额不足错误提示框显示
      isShowCoupon: false,	//优惠券列表模态框显示
      isShowSelection: true,	//是否不使用优惠券
      couponList: [],				//所有优惠券
      canUseCouponList: [],		//可使用优惠券列表
      canNotUseCouponList: [],		//不可使用优惠券列表
      isSelectCoupon: '',		//选中的优惠券
      memberMoney: '',
      memberId: '',
      openId: '',
      appId: '',
      userId: '',
      storeId: '',
      discountPrice: '',
      code: '',
      merchantId: '',
      equipmentId: '',
      industryCategory: '',
      goodsOrderId: '',
      merchantName: '',
      hbFqNum: '', // 花呗分期数
      // reg: /^([1-9][\d]{0,}|0)(\.[\d]{1,2})?$/,
      reg: /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
    }
  },
  created() {
    this.serviceId = this.$route.query.serviceId;
    // alert('serviceId:'+this.serviceId)

    let equipmentId = initParams(this.$route.query.equipmentId)
    if (equipmentId) {
      this.equipmentId = equipmentId
    }
    let industryCategory = this.$route.query.industryCategory
    if (industryCategory === null || industryCategory === 0 || industryCategory === 'null' || industryCategory === '0' || industryCategory === 'undefined' || industryCategory === undefined) {
      this.industryCategory = true
    }
    this.htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    this.htmlheight = document.documentElement.clientHeight || document.body.clientHeight;
    this.htmlProportion = this.htmlWidth / 750;
    // console.log(this.htmlWidth);
    // console.log(this.htmlheight);

    /* 获取openId和memberId信息 */
    let openId = this.$route.query.openId;
    if (openId != null && openId != '' && openId) {
      this.openId = openId
    }
    let memberId = this.$route.query.memberId;
    if (memberId != null && memberId != '' && memberId != 'null' && memberId) {
      this.memberId = memberId
    }
    let appId = this.$route.query.appId;
    if (appId != null && appId != '' && appId != 'null' && appId) {
      this.appId = appId
    }

    let goodsOrderId = sessionStorage.getItem("goodsOrderId")
    if (goodsOrderId != null && goodsOrderId != '' && goodsOrderId != 'null' && goodsOrderId != 'undefined' && goodsOrderId) {
      this.goodsOrderId = goodsOrderId
    }
    // 花呗分期---微信暂不支持
    let hbFqNum = sessionStorage.getItem("hbFqNum")
    if (hbFqNum != null && hbFqNum != '' && hbFqNum != 'null' && hbFqNum != 'undefined' && hbFqNum) {
      this.hbFqNum = hbFqNum
    }

    /* 获取merchantId信息 */
    let merchantId = this.$route.query.merchantId;
    if (merchantId != null && merchantId != '' && merchantId != 'null' && merchantId) {
      this.merchantId = merchantId
      sessionStorage.setItem("merchantId", this.merchantId)
    } else {
      this.merchantId = ''
      sessionStorage.removeItem('merchantId')
    }
    /* 判断是否为会员 */
    if (this.memberId) {
      this.isMember = true
    } else {
      this.isMember = false
    }
    /* 获取storeId信息（有的话） */
    let storeId = sessionStorage.getItem("storeId");
    if (storeId != null && storeId != '' && merchantId != 'null' && merchantId != 'undefined' && storeId) {
      this.storeId = storeId
    }
    /* 获取userId（有的话） */
    let userId = sessionStorage.getItem('userId');
    if (this.userId != null && userId != '' && userId) {
      this.userId = userId
    }
    /* 金额获取 */
    let totalPrice = sessionStorage.getItem('totalPrice')
    if (totalPrice != null && totalPrice != '' && totalPrice) {
      this.paymentMoney = totalPrice
      //计算还需支付金额
      this.doActualPayment()
    } else {
      this.paymentMoney = '';
    }
    this.md5Str = sessionStorage.getItem('md5Str')
    this.timestramp = sessionStorage.getItem('timestramp')
    // window.location.href = ''
    this.getMemberCouponList();
    this.getMerchantInfo()
  if(this.fence == 1){
      //电子围栏开，获取定位信息
      this.getGaoDeKey()
    }

  },
  watch: {
    isPayErr(val, oldVal) {
      if (val === true) {
        setTimeout(() => {
          this.isPayErr = false;
        }, 1500)
      }
    },
    isBalanceErr(val, oldVal) {
      if (val === true) {
        setTimeout(() => {
          this.isBalanceErr = false;
        }, 1500)
      }
    },
    paymentMoney(val, oldVal) {
      let status = this.checkInputPrice(val, true)
      if (!status) {
        this.doActualPayment()
      } else {
        this.actualPayment = '0'
      }
    },
    actualPayment(val, oldVal) {
      if (parseFloat(this.actualPayment) < 0) {
        this.actualPayment = '0'
      }
    }
  },
  mounted() {
    // this.geolocationFn()
    // 电子围栏开关
    // let fence = sessionStorage.getItem('fence')
    this.fence = this.$route.query.fence
    // alert('2fence:'+this.fence)


    // var x=document.getElementById("demo");
    this.getshowMemberPay()
    // this.weichatLatAndLon()

    if (this.paymentMoney <= 0) {
      this.$nextTick(() => {
        if (this.equipmentId) {
          return
        }
        this.paymentMoney = ''
        this.showKeyboardStatus = true
        // this.$refs.inputEle.focus()
      })
    }
  },
  methods: {
    //获取高德秘钥
    getGaoDeKey(){
      // alert('获取秘钥开始')
      getGaoDeKey(this.serviceId).then(res => {
        // this.gdWebServiceKey = res.obj.gdWebServiceKey;
        this.gdWebSideKey = res.obj.gdWebSideKey;
        // alert('gdWebSideKey:'+this.gdWebSideKey)
        this.initAmap();
      },err => {
        alert('警告：'+err.msg)
      })
    },
    initAmap(){

      AMapLoader.load({
        "key": this.gdWebSideKey,              // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ['AMap.Geolocation'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {             // 是否加载 AMapUI，缺省不加载
          "version": '1.1',   // AMapUI 缺省 1.1
          "plugins":[],       // 需要加载的 AMapUI ui插件
        },
        "Loca":{                // 是否加载 Loca， 缺省不加载
          "version": '1.3.2'  // Loca 版本，缺省 1.3.2
        },
      }).then((AMap)=>{
        // map = new AMap.Map('container');
        /*this.geocoder = new AMap.Geocoder({
          city: "", //城市设为北京，默认：“全国”
        });*/
        this.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          // position: 'RB', //定位按钮的停靠位置
          // buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          // zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        })
      }).catch(e => {
        console.log(e);
      })
    },
    //获取坐标转为中文地址
    geolocationFn(params,payType){
       let  that = this;
       let count = 0;
      this.geolocation.getCurrentPosition((status, result) => {
        if (status == 'complete') {
          // this.longitude = result.position.lng
          // this.latitude = result.position.lat
          params.longitude = result.position.lng
          params.latitude = result.position.lat
          // alert('获取经纬度：'+result.position.lng+'--'+result.position.lat)
          if(payType === 'member'){
            this.memberGetWebPay(params);
          }else if(payType === 'wx'){
            this.getWebPay(params);
          }


          console.log('获取坐标================',result.position.lng+','+result.position.lat)

          // 应该监听这四个数据 当全部存在时 执行
          // if(this.oilData.longitude && this.oilData.latitude && this.oilData.phone && this.startGet) {
          // this.init()
          // }

        } else {
          loading.hide();
          this.$toast.error('定位失败', result.message)
        }
      })
    },
  /*  weichatLatAndLon (callback, error) {
      var that = this;
      var timestamp = new Date().getTime() + "";
      timestamp = timestamp.substring(0, 10);
      var ranStr = randomString();

      //微信接口配置
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'XXXXXXXXXXXXXXXXX', // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: ranStr, // 必填，生成签名的随机串
        signature: 'XXXXXXXXXXXXXXXXX',// 必填，签名，见附录1
        jsApiList: ['checkJsApi',
          'getLocation'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      //参见微信JS SDK文档：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
      wx.ready(function () {

        wx.getLocation({
          success: function (res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
            var data = {
              latitude: latitude,
              longitude: longitude
            };
            if (typeof callback == "function") {
              callback(data);
            }
          },
          cancel: function () {
            //这个地方是用户拒绝获取地理位置
            if (typeof error == "function") {
              error();
            }
          }
        });

      });
      wx.error(function (res) {
        if (typeof error == "function") {
          error();
        }
      });
    },*/

    /*getLocation() {
      alert('开始定位')
      if (navigator.geolocation)
      {
        navigator.geolocation.getCurrentPosition(this.showPosition,this.positionError);
      }
      // else{this.latitude="Geolocation is not supported by this browser.";}
    },
    showPosition(position)
    {
      alert(this.latitude+'--'+this.longitude)
      this.latitude= position.coords.latitude
      this.longitude = position.coords.longitude;
    },
    positionError(err) {
      alert('ERROR(' + err.code + '): ' + 'GPS访问被拒绝 或 GPS未开启')
     /!* plus.geolocation.getCurrentPosition(function(p) {
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
      }*!/
      // console.warn('ERROR(' + err.code + '): ' + err.message);
  // this.errorData = 'ERROR(' + err.code + '): ' + err.message
},*/
    clearRemark() {
      this.wxRemark = ''
    },
    hideKeyboard() {
      this.showKeyboardStatus = false
    },
    showKeyboard() {
      if (this.equipmentId) {
        return
      }
      this.showKeyboardStatus = true
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
      /*
      if (!this.userId) {
        return
      }
      getMerchantName(this.userId).then(res => {
        this.merchantName = res.obj
      }).catch(err => {
        console.log(err)
      })
      */
    },
    /**
     * 是否显示会员信息
     **/
    getshowMemberPay() {
      let params = {
        merchantId: this.merchantId
      }
      showMemberPay(params).then(res => {
        this.showMemberPay = res.obj
        // industryCategory --true表示可以展示会员选择，false不能会员
        if (!(this.showMemberPay && this.industryCategory)) {
          this.showMemberPay = false
          this.isMemberRadio = false
          this.isMember = false
        } else {
          this.isMemberRadio = true
        }
      })
    },
    /* 页面跳转-加入会员 */
    jumpAddMember() {
      /* 加入会员 */
      this.$router.push({
        path: '/wx/memberCard',
        query: { openId: this.openId, merchantId: this.merchantId, appId: this.appId }	//传参
      })
    },
    /**
     * 显示提示框
     **/
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
          this.paymentMoney = arr.join('.')
        }
      } else {
        priceTip = '请输入有效金额'
      }
      if (showTip) {
        this.priceTip = priceTip
      }
      return priceTip
    },
    /* 付款确认框 */
    payConfirmModal() {
      let statut = this.checkInputPrice(this.paymentMoney)
      this.paymentMoney = Number(this.paymentMoney) + ''
      if (!statut) {
        this.showModal = true
      } else {
        this.showTips(statut)
      }
    },
    cancelPay() {
      this.showModal = false
    },
    confirmPay() {
      this.cancelPay()
      this.paymentJump()
    },
    /* 付款判断-微信/会员储值卡 */
    paymentJump() {
      /* 付款 */
      //确认付款


      if (this.paymentMoney.trim().match(/^[0-9]+([.]{1}[0-9]{1,2})?$/)) {
        console.log("付款判断")
        //会员储值卡支付
        if (this.isMemberRadio && this.isMember) {
          if (this.memberMoney >= this.actualPayment) {
            this.memberPayment()
          } else {
            this.isBalanceErr = true;
          }
          return
        }
        console.log("进入微信支付-即将跳转微信支付页")
        console.log(this.payMoney, this.discountPrice, this.openId, this.userId, this.storeId, this.memberId, this.code, this.merchantId,this.appId)
        //跳转微信支付页
        let params = {
          paymentMoney: this.actualPayment,
          appId:this.appId,
          openId: this.openId,
          userId: this.userId,
          storeId: this.storeId,
          discountPrice: this.discountPrice,
          memberId: this.memberId,
          code: this.code,
          merchantId: this.merchantId,
          md5Str: this.md5Str,
          timestramp: this.timestramp,
          goodsOrderId: this.goodsOrderId,
          hbFqNum: this.hbFqNum
        }
        this.payment(params) // 直接微信支付
        /*
        this.$router.push({
          path:'/wx/pay',
          query:{
            paymentMoney: this.paymentMoney,
            openId: this.openId,
            userId: this.userId,
            storeId: this.storeId,
            discountPrice: this.discountPrice,
            memberId: this.memberId,
            code: this.code,
            merchantId: this.merchantId
          }	//传参
        })
        */
      } else {
        console.log('支付End')
        this.isPayErr = true;
      }
    },
    /* 支付 */
    /* 会员储值支付 */
    memberPayment() {
      console.log("进行会员储值卡付款")
      let uuid = initParams(this.$route.query.uuid)
      let equipmentId = initParams(this.$route.query.equipmentId)
      let that = this
      let params = {
        scanAppType: 1, //转换坐标用("浏览器类型 1:微信2:支付宝3:云闪付")
        payWay: 4,
        totalPrice: this.actualPayment,
        userId: this.userId,
        openId: this.openId,
        appId:this.appId,
        storeId: this.storeId,
        discountPrice: this.discountPrice,
        memberId: this.memberId,
        code: this.code,
        merchantId: '',
        longitude: '',
        latitude: this. latitude,
        fence: this.fence,
        uuid: uuid,
        equipmentId: equipmentId,
        remarks: '',
        md5Str: this.md5Str,
        timestramp: this.timestramp,
        goodsOrderId: this.goodsOrderId,
        hbFqNum: ''
      }
      if(this.fence == -1){

        this.memberGetWebPay(params)
      }else if(this.fence == 1){
        this.geolocationFn(params,'member')
      }

    },
    memberGetWebPay(params){
      let that = this;
      getWebPay(params/*4, this.actualPayment, this.userId, this.storeId, uuid, equipmentId, '', this.md5Str, this.timestramp, this.goodsOrderId, '', this.openId, this.discountPrice, this.memberId, this.code, this.merchantId*/).then(res => {
        console.log(res)
        loading.hide();
        that.price = res.obj.price
        that.timeStamp = res.obj.timeStamp
        that.orderNumber = res.obj.orderNumber
        that.$router.push({
          path: "/wx/paySuccess",
          query: {
            price: that.price,
            timeStamp: that.timeStamp,
            orderNumber: that.orderNumber,
            merchantId: that.merchantId,
            payWay: 4
          }	//传参
        })
        // alert("支付成功")
        //跳转广告
        // this.$router.push({
        // 	path:'/advertisement',
        // 	query:{
        //     userId:this.userId,
        //     storeId:this.storeId,
        //     merchantId:this.merchantId
        // 	}	//传参
        // })
      }).catch(err => {
        loading.hide();
        console.log(err)
      })
    },
    /* 打开优惠券模态框 */
    showCoupon() {
      if (!this.isMember) {
        return
      }
      /* 正则判断付款金额 */
      let status = this.checkInputPrice(this.paymentMoney, true)
      if (status) {
        this.isPayErr = true;
        return
      }
      /* 处理优惠券 */
      this.canUseCouponList = [];
      this.canNotUseCouponList = [];
      for (let coupon of this.couponList) {
        if (coupon.miniExpendLimit <= parseInt(this.paymentMoney)) {
          this.canUseCouponList.push(coupon);
        } else {
          this.canNotUseCouponList.push(coupon);
        }
      }
      console.log(this.canUseCouponList)
      /* 查看是否有选中优惠券 */
      if (!this.isSelectCoupon) {
        this.isShowCoupon = true;
        return
      }
      for (let key in this.canUseCouponList) {
        if (this.canUseCouponList[key].id === this.isSelectCoupon.id) {
          this.canUseCouponList[key].selectStatus = true
        } else {
          this.canUseCouponList[key].selectStatus = false
        }
      }
      this.isShowCoupon = true;
      // this.getMemberCouponList();
    },
    /* 关闭优惠券模态框 */
    closeCoupon() {
      //计算还需支付金额
      this.doActualPayment()
      this.isShowCoupon = false;
    },
    /* 改变优惠券选择 */
    changeSelection(key) {
      console.log("选择优惠券", key)
      switch (parseInt(key)) {
        case -1:	//选择不使用优惠券
          console.log("不用")
          this.isShowSelection = true
          for (let i in this.canUseCouponList) {
            this.canUseCouponList[i].selectStatus = false
          }
          this.isSelectCoupon = ''
          this.code = ''
          this.discountPrice = ''
          break;
        default:
          console.log("用券")
          this.isShowSelection = false
          for (let i in this.canUseCouponList) {
            this.canUseCouponList[i].selectStatus = false
          }
          this.canUseCouponList[key].selectStatus = true
          this.isSelectCoupon = this.canUseCouponList[key]
          this.code = this.canUseCouponList[key].code
          this.discountPrice = this.canUseCouponList[key].money
          break;
      }
    },
    /* 改变会员支付方式 */
    changeMemberPayWay(boolean) {
      if (boolean) {
        this.isMemberRadio = false;
      } else {
        this.isMemberRadio = true;
      }
    },
    /* 获取个人会员优惠券列表 */
    getMemberCouponList() {
      console.log("会员判断", this.isMember, this.memberId)
      if (this.isMember === false) {
        return
      }
      // let obj = '{"code":200,"msg":null,"obj":{"personCoupons":[{"id":"1190088822876213248","name":"满10减1","createTime":"2019-11-01 10:11:01","updateTime":"2019-11-01 10:11:01","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173521310562672640","memberId":"1190087286922088448","money":1.00,"photoId":"1173521297308672000","validTimeStart":"2019-11-01 10:11:01","validTimeEnd":"2019-11-02 00:05:26","remark":"测试10元的卡券","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190088822876213248","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190088836117630976","name":"满5减4.9","createTime":"2019-11-01 10:11:04","updateTime":"2019-11-01 10:11:04","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173520581949153280","memberId":"1190087286922088448","money":4.90,"photoId":"1173520532406034432","validTimeStart":"2019-11-01 10:11:04","validTimeEnd":"2019-11-06 10:11:04","remark":"测试满5元","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190088836117630976","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190089027721826304","name":"满10减1","createTime":"2019-11-01 10:11:50","updateTime":"2019-11-01 10:11:50","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173521310562672640","memberId":"1190087286922088448","money":1.00,"photoId":"1173521297308672000","validTimeStart":"2019-11-01 10:11:50","validTimeEnd":"2019-11-02 00:06:15","remark":"测试10元的卡券","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190089027721826304","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190089050027134976","name":"满5减4.9","createTime":"2019-11-01 10:11:55","updateTime":"2019-11-01 10:11:55","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173520581949153280","memberId":"1190087286922088448","money":4.90,"photoId":"1173520532406034432","validTimeStart":"2019-11-01 10:11:55","validTimeEnd":"2019-11-06 10:11:55","remark":"测试满5元","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190089050027134976","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190089121279971328","name":"满10减1","createTime":"2019-11-01 10:12:12","updateTime":"2019-11-01 10:12:12","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173521310562672640","memberId":"1190087286922088448","money":1.00,"photoId":"1173521297308672000","validTimeStart":"2019-11-01 10:12:12","validTimeEnd":"2019-11-02 00:06:37","remark":"测试10元的卡券","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190089121279971328","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190089384170557440","name":"满5减4.9","createTime":"2019-11-01 10:13:15","updateTime":"2019-11-01 10:13:15","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173520581949153280","memberId":"1190087286922088448","money":4.90,"photoId":"1173520532406034432","validTimeStart":"2019-11-01 10:13:15","validTimeEnd":"2019-11-06 10:13:15","remark":"测试满5元","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190089384170557440","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190093878644117504","name":"满10减1","createTime":"2019-11-01 10:31:06","updateTime":"2019-11-01 10:31:06","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173521310562672640","memberId":"1190087286922088448","money":1.00,"photoId":"1173521297308672000","validTimeStart":"2019-11-01 10:31:06","validTimeEnd":"2019-11-02 00:25:32","remark":"测试10元的卡券","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190093878644117504","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190093890274922496","name":"满5减4.9","createTime":"2019-11-01 10:31:09","updateTime":"2019-11-01 10:31:09","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173520581949153280","memberId":"1190087286922088448","money":4.90,"photoId":"1173520532406034432","validTimeStart":"2019-11-01 10:31:09","validTimeEnd":"2019-11-06 10:31:09","remark":"测试满5元","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190093890274922496","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1190104209617522688","name":"满10减1","createTime":"2019-11-01 11:12:09","updateTime":"2019-11-01 11:12:09","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173521310562672640","memberId":"1190087286922088448","money":1.00,"photoId":"1173521297308672000","validTimeStart":"2019-11-01 11:12:09","validTimeEnd":"2019-11-02 01:06:35","remark":"测试10元的卡券","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1190104209617522688","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null}],"balance":0.00}}'
      // let objObj = JSON.parse(obj)
      // this.initConplist(objObj)
      // return
      getMemberCouponList(this.memberId, this.userId).then(res => {
        // res = {"code":200,"msg":null,"obj":{"personCoupons":[{"id":"1224969414230241280","name":"1202","createTime":"2020-02-05 16:14:02","updateTime":"2020-02-05 16:14:02","delFlag":1,"merchantId":"1154321588256616448","couponId":"1201410647268225024","memberId":"1201746421072867328","money":1.00,"photoId":"1201410489272987648","validTimeStart":"2020-02-05 16:14:02","validTimeEnd":"2020-02-10 16:14:02","remark":"满5减1","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1200302172795817984,1197078752865689600,1196810170289295360,1196775902364631040,1196358598380879872,1196358167403560960,1196346978338471936,1196346578826821632,1196324496672403456,1196324367571726336,1196324295807184896,1196324226508894208,1196324059378462720,1196317382983262208,1196315970257788928,1195601706971996160,1195553771206234112,1195530200695226368,1195169287921057792,1194895452053266432,1194547357359382528,1194538853374468096,1194511161834352640,1194458274153136128,1191287220182933504,1191249552027901952,1190191540225523712,1190191347757301760,1190191344682876928,1184033426807930880,1167340280589312000,1164516243983724544,1159017800192012288,1154321588260810752","code":"1224969414230241280","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1224969424514674688","name":"卡券名称太长吗不会","createTime":"2020-02-05 16:14:04","updateTime":"2020-02-05 16:14:04","delFlag":1,"merchantId":"1154321588256616448","couponId":"1199949238387544064","memberId":"1201746421072867328","money":0.01,"photoId":"1199949016726966272","validTimeStart":"2020-02-05 16:14:04","validTimeEnd":"2020-02-10 16:14:04","remark":"卡券说明","miniExpendLimit":0.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1197078752865689600,1196810170289295360,1196775902364631040,1196358598380879872,1196358167403560960,1196346978338471936,1196346578826821632,1196324496672403456,1196324367571726336,1196324295807184896,1196324226508894208,1196324059378462720,1196317382983262208,1196315970257788928,1195601706971996160,1195553771206234112,1195530200695226368,1195169287921057792,1194895452053266432,1194547357359382528,1194538853374468096,1194511161834352640,1194458274153136128,1191287220182933504,1191249552027901952,1190191540225523712,1190191347757301760,1190191344682876928,1184033426807930880,1167340280589312000,1164516243983724544,1159017800192012288,1154321588260810752","code":"1224969424514674688","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null},{"id":"1224969454478782464","name":"满5减4.9","createTime":"2020-02-05 16:14:11","updateTime":"2020-02-05 16:14:11","delFlag":1,"merchantId":"1154321588256616448","couponId":"1173520581949153280","memberId":"1201746421072867328","money":4.90,"photoId":"1173520532406034432","validTimeStart":"2020-02-05 16:14:11","validTimeEnd":"2020-02-10 16:14:11","remark":"测试满5元","miniExpendLimit":5.00,"useTimeWeek":"1,2,3,4,5,6,7","useTimeDay":"00:00-23:59","claimUpperLimit":99999999,"storeIds":"1167340280589312000,1159017800192012288,1154321588260810752","code":"1224969454478782464","status":1,"synStatus":1,"remindTimes":0,"userId":null,"userName":null,"validTime":null}],"balance":0.00}}
        console.log(res)
        this.initConplist(res)
      }).catch(err => {
        console.log(err)
      })
    },
    initConplist(res) {
      this.memberMoney = res.obj.balance;
      for (let s of res.obj.personCoupons) {
        s['selectStatus'] = false
        s['photoSrc'] = this.getPic(s.photoId)
      }
      this.couponList = res.obj.personCoupons;
    },
    /* 判断当前优惠券可用与不可用-change事件 */
    judgeCoupon() {
      console.log("判断优惠券是否可用")
      this.doActualPayment()
      /* 判断当前选中优惠券是否还可以使用 */
      if (this.isSelectCoupon) {
        if (this.isSelectCoupon.miniExpendLimit > parseInt(this.paymentMoney)) {
          this.isSelectCoupon = '';
        }
      }
      /* 处理优惠券列表 */
      this.canUseCouponList = [];
      this.canNotUseCouponList = [];
      for (let coupon of this.couponList) {
        if (coupon.miniExpendLimit <= parseInt(this.paymentMoney)) {
          this.canUseCouponList.push(coupon);
        } else {
          this.canNotUseCouponList.push(coupon);
        }
      }
      // console.log("选中优惠券",this.isSelectCoupon)
      // console.log("优惠券列表",this.couponList)
      // console.log("可用优惠券",this.canUseCouponList)
      // console.log("不可用优惠券",this.canNotUseCouponList)
    },
    /* 计算还需支付金额 */
    doActualPayment() {
      this.actualPayment = this.paymentMoney
      if (this.isSelectCoupon) {
        this.actualPayment = (this.actualPayment - this.isSelectCoupon.money).toFixed(2)
      }
    },
    /* 图片回显 */
    getPic(val) {
      let baseURL = window.serverUrl || window.location.protocol + '//' + window.location.host
      var url = baseURL + '/fms/upload/resource/' + val
      return url
    },
    /* 付款 */
    payment(param) {
      loading.show();
      // this.testProcess = '进行付款'
      let uuid = initParams(this.$route.query.uuid)
      let equipmentId = initParams(this.$route.query.equipmentId)
      let params = {
        scanAppType: 1, //转换坐标用("浏览器类型 1:微信2:支付宝3:云闪付")
        payWay: 1,
        totalPrice: param.paymentMoney,
        userId: param.userId,
        openId: param.openId,
        appId:param.appId,
        storeId: param.storeId,
        discountPrice: param.discountPrice,
        memberId: param.memberId,
        code: param.code,
        merchantId: param.merchantId,
        longitude: '',
        latitude: '',
        fence: this.fence,
        uuid: uuid,
        equipmentId: equipmentId,
        remarks: this.wxRemark,
        md5Str: this.md5Str,
        timestramp: this.timestramp,
        goodsOrderId: param.goodsOrderId,
        hbFqNum: ''
      }
      if(this.fence == -1){
        this.getWebPay(params)
      }else if(this.fence == 1){
        this.geolocationFn(params,'wx')
        return
      }

      // alert('params'+params.longitude)

      /* 跳转付款成功 */
      // this.$router.push({
      // 	path:'/wx/paySuccess',	//地址
      // 	query:{}	//传参
      // })
    },
    getWebPay(params){
      // alert('getWebPay经纬度'+params.longitude+'--'+params.latitude)
      getWebPay(params/*1, param.paymentMoney, param.userId, param.storeId, uuid, equipmentId, this.wxRemark, this.md5Str, this.timestramp, param.goodsOrderId, '', param.openId, param.discountPrice, param.memberId, param.code, param.merchantId*/).then(res => {
        loading.hide();
        // this.testProcess = '付款接口调取成功，进行付款跳转'
        console.log(res)
        this.testRes = JSON.stringify(res)
        switch (parseInt(res.obj.channel)) {
          case 1:		/* 微信官方支付 */
          case 11:		/* 第三方支付-传化 */
          case 12:		/* 第三方支付-天阙 */
          case 13:		/* 第三方支付-易生 */
          case 14:		/* 第三方支付-新大陆 */
            // this.testProcess = '进行官方支付'
            this.wxPay(res.obj.jsPayResponse);
            this.price = res.obj.jsPayResponse.price
            this.timeStamp = res.obj.jsPayResponse.timeStamp
            this.orderNumber = res.obj.jsPayResponse.orderNumber
            break
          case 2:		/* 第三方支付-会员宝 */
          case 3:		/* 第三方支付-易融码 */
          case 6:		/* 第三方支付-富友 */
          case 7:		/* 第三方支付-随行付 */
          case 9:		/* 第三方支付-银盛 */

          case 19:		/* 第三方支付-开店宝 */
            // this.testProcess = '进行第三方支付'
            window.location.href = res.obj.payUrl		//跳转外部链接
            break
          case 21:  /* 第三方支付-敏付 */
            this.wxPay(res.obj.jsPayResponse);
            this.price = res.obj.jsPayResponse.price
            this.timeStamp = res.obj.jsPayResponse.timeStamp
            this.orderNumber = res.obj.jsPayResponse.orderNumber
            break


        }

      }).catch(err => {
        loading.hide();
        console.log(err)
        //this.testProcess = '付款接口调取失败，尝试获得错误信息'
        // this.testFail = err
      })
    },

    /* 进行微信官方支付 */
    wxPay(payObj) {
      if (typeof WeixinJSBridge == "undefined") {
          console.log(document.addEventListener);
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        this.onBridgeReady(payObj);
        this.testData = payObj;
      }
    },
    /* 唤醒微信支付*/
    onBridgeReady(payObj) {
      let that = this;
      // alert(JSON.stringify(payObj))
      // this.testProcess = '进行微信唤醒'
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {

        "appId": payObj.appId,     		//公众号名称，由商户传入
        "timeStamp": payObj.timeStamp,         //时间戳，自1970年以来的秒数
        "nonceStr": payObj.nonceStr, 	//随机串
        "package": payObj.pkg,
        "signType": payObj.signType,         //微信签名方式：
        "paySign": payObj.paySign 		//微信签名
      },
        function (res) {
          // that.testProcess = '唤醒结束，进行返回值事件'
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            // alert("支付成功");
            // alert(JSON.stringify(res))
            that.$router.push({
              path: "/wx/paySuccess",
              query: {
                price: that.price,
                timeStamp: that.timeStamp,
                orderNumber: that.orderNumber,
                merchantId: that.merchantId,
                payWay: 1
              }	//传参
            })
            // alert("支付成功");
            // that.$router.push({
            // 	path: "/advertisement",
            // 	query:{
            //     userId:this.userId,
            //     storeId:this.storeId,
            //     merchantId:this.merchantId
            //   }	//传参
            // })
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            alert("支付取消");
            // alert(JSON.stringify(res))
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            alert('支付失败')
            // alert(JSON.stringify(res))
          } else if (res.err_msg == "total_fee") {
            alert('缺少参数')
          } else {
            alert(res.err_msg)
          }
        }
      );
    }
  }
}
</script>

<style>
.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}
.coupon-title {
  height: 2.133rem;
}
.coupon-title .text {
  margin: 0 0.533rem;
  line-height: 2.133rem;
  font-size: 0.427rem;
  color: #666666;
}

.coupon-title .line {
  position: relative;
}
.coupon-title .line:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #eee;
}

.counpnlist-li {
  position: relative;
  padding: 0.48rem;
  margin-bottom: 0.533rem;
  border: 1px solid #ff3366;
  background-color: #fff9f0;
  border-radius: 0.267rem;
}
.counpnlist-li:after {
  content: '';
  position: absolute;
  top: 0;
  right: 2.96rem;
  height: 100%;
  border-left: 1px dashed #ff3366;
}
.counpn-img {
  width: 3.2rem;
  height: 3.2rem;
}

.counpn-img img {
  width: 100%;
  height: 100%;
}

.counpn-check {
  display: flex;
  width: 2.133rem;
  align-items: center;
  justify-content: center;
}

.counpn-check img {
  width: 1.067rem;
  height: 1.067rem;
}

.counpn-dec {
  flex: 1;
  display: flex;
  margin-left: 0.267rem;
  align-items: center;
  justify-content: flex-start;
}
.counpn-dec-sec {
  flex: 1;
}

.coupon-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
}

.coupon-price {
  padding-top: 0.133rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.88rem;
  font-weight: bold;
  color: #ff9b2f;
}

.coupon-tip span {
  margin-left: 0.267rem;
  margin-top: -0.08rem;
  padding: 0.08rem 0.347rem;
  border: 1px solid rgba(255, 155, 47, 1);
  border-radius: 0.08rem;
  font-size: 0.4rem;
  font-weight: bold;
  color: rgba(255, 155, 47, 1);
}
.coupon-time {
  font-size: 0.453rem;
  font-weight: bold;
  color: rgba(102, 102, 102, 1);
}
.counpn-circle {
  position: absolute;
  width: 0.533rem;
  height: 0.533rem;
  border: 1px solid #ff3366;
  border-radius: 50%;
  right: 2.667rem;
  background-color: #fff;
  z-index: 2;
}
.counpn-circle.top {
  top: -0.267rem;
}

.counpn-circle.bottom {
  bottom: -0.267rem;
}
.counpn-circle:before {
  content: '';
  position: absolute;
  left: -0.027rem;
  width: 0.533rem;
  height: 0.533rem;
  border: 1px solid #fff;
  background-color: #fff;
}
.counpn-circle.top:before {
  top: -0.347rem;
}
.counpn-circle.bottom:before {
  bottom: -0.347rem;
}

.counpnlist-invalid .counpnlist-li {
  border: 1px solid #ccc;
  background-color: #f3f3f3;
}
.counpnlist-invalid .counpnlist-li:after {
  border-left: 1px dashed #ccc;
}
.counpnlist-invalid .counpn-circle {
  border: 1px solid #ccc;
}

.counpnlist-invalid .coupon-price {
  color: #999;
}

.counpnlist-invalid .coupon-tip span {
  margin-left: 0.267rem;
  padding: 0.08rem 0.347rem;
  border: 1px solid #999;
  color: #999;
}

.lf-no-coupon {
  width: 100% !important;
  border-radius: 0.133rem;
}

.lf-coupon-box {
  padding-bottom: 2.4rem !important;
}

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
  border: 0.053rem solid #4ba8ff;
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
  border-right: 0.053rem solid #2c97fd;
  animation: blink 1s infinite steps(1, start);
}
@keyframes blink {
  0% {
    border-right: 0.053rem solid #fff;
  }
  50% {
    border-right: 0.053rem solid #2c97fd;
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
  color: #4ba8ff;
  font-size: 0.96rem;
  font-weight: 500;
  border: 1px solid #4ba8ff;
  border-radius: 0.267rem;
}

.paybtns span {
  display: block;
  width: 100%;
  text-align: center;
}

.btnsblue {
  background-color: #4ba8ff;
  color: #fff;
}
/*-------------------------------------------------改版结束----------------------------*/

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
  z-index: 6;
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
  color: #4ba8ff;
}
.confirm-btns > div {
  flex: 1;
}
/*-弹窗--结束-*/

.pricttip-size {
  font-size: 1.15rem !important;
}

body {
  background-color: #f1f1f1;
  margin: 0;
  padding: 0;
  /* font-size: 1.125rem; */
}
.text-ssm {
  /* 10 */
  font-size: 0.625rem;
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
.text-orange {
  /* 橙色 */
  color: #ff4500;
}
.text-grey {
  /* 草灰 */
  color: #a9a9a9;
}
.text-blue {
  /* 主色蓝 */
  color: #4ba8ff;
}
.relative {
  position: relative;
}
.margin-right-10 {
  margin-right: 0.625rem;
}
.padding {
  padding: 0.625rem;
}
.lf-box > div {
  margin: 0 auto;
  margin-top: 20px;
}
.lf-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  /* height: 80px; */
  background-color: #f1f1f3;
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
.lf-nav-text > div {
  display: flex;
  align-items: center;
}
.lf-nav-text span {
  margin: 0 0.625rem;
}
.lf-content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.margin-0-auto {
  margin: 0 auto;
}
.pay-price-input:focus {
  outline: none;
  border: none;
}
.lf-content-payPanel {
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lf-content-payPanel > div {
  width: 90%;
  height: 80%;
}
.lf-content-payPanel .one {
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
}
.lf-content-payPanel .two {
  width: 100%;
  height: 3.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.0625rem solid #bdbdc6;
}
.lf-content-payPanel .two input {
  width: 90%;
  height: 3rem;
  border: 0;
}
.lf-content-payPanel .three {
  width: 100%;
  height: 65%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.lf-content-payWay {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.lf-content-payWay > div {
  width: 90%;
  height: 45%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lf-content-payWay > div > div {
  display: flex;
  align-items: center;
}
.lf-content-btn {
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.0625rem solid #4ba8ff;
  border-radius: 0.1875rem;
}
.lf-content-btn-one {
  background-color: #4ba8ff;
  color: #fff;
}
.lf-content-btn-two {
  background-color: #fff;
  color: #4ba8ff;
}
.lf-err-tip {
  width: 9.375rem;
  height: 2.1875rem;
  position: fixed;
  top: 6.25rem;
  left: calc(50% - 4.6875rem);
  text-align: center;
  line-height: 2.1875rem;
  font-weight: 800;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 0.3125rem;
}
.tip-leave-active {
  transition: opacity 0.5s;
}
.tip-enter, .tip-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.lf-cover {
  width: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}
.lf-coupon-modal {
  /* width: 100vh; */
  height: 50vh;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 101;
  background-color: #fff;
}
.lf-coupon-modal .confirm {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
}
.lf-coupon-modal .confirm .btn {
  padding: 0.3rem 0.65rem;
  color: #fff;
  background-color: #4ba8ff;
  border-radius: 0.1875rem;
}
.lf-no-coupon {
  width: 94%;
  border: 0.0625rem solid #f1f1f3;
  padding: 3% 2%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
}
.lf-no-coupon img {
  width: 0.9375rem;
  height: 0.9375rem;
}
/* .couponSelect-leave-active {
		transition: opacity .3s;
	}
	.couponSelect-enter, .couponSelect-leave-to {
		opacity: 0;
	} */
.lf-coupon-box {
  width: 100%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
}
/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.lf-coupon-card {
  width: 94%;
  height: 29%;
  padding: 3% 3%;
  margin-bottom: 0.625rem;
  display: flex;
  justify-content: flex-start;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.coupon-bg-01 {
  background-image: url(../../../assets/coupon_card_01.png);
}
.coupon-bg-02 {
  background-image: url(../../../assets/coupon_card_02.png);
}
.lf-coupon-card .one {
  height: 100%;
  width: 74%;
}
.lf-coupon-card .two {
  height: 100%;
  width: 26%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lf-coupon-card .two img {
  height: 1.875rem;
  width: 1.875rem;
  margin-left: 0.625rem;
}
.lf-coupon-card .one .up {
  width: 100%;
  height: 75%;
  /* background-color: #0077AA; */
  display: flex;
  justify-content: flex-start;
}
.lf-coupon-card .one .up div {
  width: 100%;
  height: 75%;
  /* background-color: #0077AA; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lf-coupon-card .one .up img {
  width: 3.125rem;
  height: 3.125rem;
  margin-right: 0.625rem;
}
.lf-coupon-card .one .up .lf-coupon {
  padding: 0.125rem 0.3125rem;
  margin-left: 0.3125rem;
  border: 0.0625rem solid #ff4500;
  border-radius: 0.125rem;
}
.lf-coupon-card .one .up .lf-coupon-no {
  padding: 0.125rem 0.3125rem;
  margin-left: 0.3125rem;
  border: 0.0625rem solid #e0e0e0;
  border-radius: 0.125rem;
}
.lf-coupon-card .one .down {
  width: 100%;
  height: 25%;
}
.lf-count-canCoupon {
  width: 100%;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0.3125rem 0;
  /* background-color: #F1F1F3; */
}
.lf-count-canCoupon .img {
  width: 30%;
  height: 0.125rem;
}
.lf-coupon-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.lf-content {
  background-color: #fff;
}
.wxpay-input {
  width: 100%;
  height: 3rem;
  margin-top: 1rem;
  background-color: #fff;
  text-align: center;
}
.wxpay-input input {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  color: #666;
}
.wxpay-input input:focus {
  outline: none;
  border: none;
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
.opacity0 {
  opacity: 0;
}
</style>
