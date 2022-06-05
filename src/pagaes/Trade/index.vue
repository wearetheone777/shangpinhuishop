<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <div
        class="address clearFix"
        v-for="(address, index) in addressInfo"
        :key="address.id"
      >
        <span class="username" :class="{ selected: address.isDefault == 1 }"
          >{{ address.consignee }}
        </span>
        <p @click="changeDefault(address, addressInfo)">
          <span class="s1">{{ address.fullAddress }}</span>
          <span class="s2">{{ address.phoneNum }}</span>
          <span class="s3" v-show="address.isDefault == 1">默认地址</span>
        </p>
      </div>

      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left: 5px">货到付款</span>
      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul
          class="list clearFix"
          v-for="(order, index) in orderInfo.detailArrayList"
          :key="order.skuId"
        >
          <li>
            <img :src="order.imgUrl" style="width: 100px; height: 100px" />
          </li>
          <li>
            <p>
              {{ order.skuName }}
            </p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{ order.orderPrice }}.00</h3>
          </li>
          <li>X{{ order.skuNum }}</li>
          <li>有货</li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea
          placeholder="建议留言前先与商家沟通确认"
          class="remarks-cont"
          v-model="msg"
        ></textarea>
      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b
            ><i>{{ orderInfo.totalNum }}</i
            >件商品，总商品金额</b
          >
          <span>¥{{ orderInfo.totalAmount }}.00</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">
        应付金额:　<span>¥{{ orderInfo.totalAmount }}.00</span>
      </div>
      <div class="receiveInfo">
        寄送至:
        <span>{{ userDefaultAddress.fullAddress }}</span>
        收货人：<span>{{ userDefaultAddress.consignee }}</span>
        <span>{{ userDefaultAddress.phoneNumber }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <!-- <router-link class="subBtn" to="/pay">提交订单</router-link> -->
      <a class="subBtn" @click="submitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Trade",
  data() {
    return {
      msg: "", //收集买家的留言信息
      orderId: "", //订单号
    };
  },
  mounted() {
    this.$store.dispatch("getUserAddress");
    this.$store.dispatch("getOrderInfo");
  },
  computed: {
    ...mapState({
      addressInfo: (state) => state.trade.address,
      orderInfo: (state) => state.trade.orderInfo,
    }),
    //将来提交订单最终选中地址
    userDefaultAddress() {
      //find:查找数组当中符合条件的元素返回，最为最终结果
      return this.addressInfo.find((item) => item.isDefault == 1) || {};
    },
  },
  methods: {
    //修改默认地址
    changeDefault(address, addressInfo) {
      addressInfo.forEach((item) => {
        //全部的为0
        item.isDefault = 0;
      });
      address.isDefault = 1; //点击的为1
    },
    //提交订单
    async submitOrder() {
      //交易编码
      let { tradeNo } = this.orderInfo;
      //其余的六个参数
      let data = {
        consignee: this.userDefaultAddress.consignee, //最终收件人的名字
        consigneeTel: this.userDefaultAddress.phoneNum, //最终收件人的手机号
        deliveryAddress: this.userDefaultAddress.fullAddress, //收件人的地址
        paymentWay: "ONLINE", //支付方式
        orderComment: this.msg, //买家的留言信息
        orderDetailList: this.orderInfo.detailArrayList, //商品清单
      };
      //需要带参数的：tradeNo
      let result = await this.$API.reqSubmitOrder(tradeNo, data);
      // console.log(result);
      if (result.code == 200) {
        (this.orderId = result.data),
          //路由跳转 + 路由传递参数
          this.$router.push("/pay?orderId=" + this.orderId);
      } else {
        alert(result.data);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
      }

      .username::after {
        content: "";
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;
        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-between;

        li {
          line-height: 30px;

          p {
            margin-bottom: 20px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {
            color: #e12228;
          }
        }
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px "微软雅黑";
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;
    }
  }
}
</style>