<template>
  <div class="pos">
    <div>
      <el-row>
        <el-col :span="7" id="order-list" class="pos-order">
          <el-tabs>
            <el-tab-pane label="点餐">
              <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="goodsName" label="商品"></el-table-column>
                <el-table-column prop="count" label="数量" width="70"></el-table-column>
                <el-table-column prop="price" label="金额" width="70"></el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="挂单"></el-tab-pane>
            <el-tab-pane label="外卖"></el-tab-pane>
          </el-tabs>
          <div class="totalDiv">
            <span>数量：{{totalNum}}</span>
            <span>金额：{{totalMoney}}元</span>
          </div>
          <div class="order-btn">
            <el-button type="warning" @click="coming">挂单</el-button>
            <el-button type="danger" @click="delAllGoods">删除</el-button>
            <el-button type="success" @click="checkOut">结账</el-button>
          </div>
        </el-col>
        <el-col :span="17">
          <div class="often-goods">
            <div class="title">常用商品</div>
            <div class="often-goods-list">
              <ul>
                <li v-for="item in oftenGoods" :key="item.goodsId" @click="addOrderList(item)">
                  <span>{{item.goodsName}}</span>
                  <span class="o-price">￥{{item.price}}元</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-type">
            <el-tabs>
              <el-tab-pane label="汉堡">
                <ul class="cookList">
                  <li v-for="item in type0Goods" :key="item.goodsId" @click="addOrderList(item)">
                    <span class="foodImg">
                      <img :src="item.goodsImg" width="100%" />
                    </span>
                    <span class="foodName">{{item.goodsName}}</span>
                    <span class="foodPrice">￥{{item.price}}元</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="小食">
                <ul class="cookList">
                  <li v-for="item in type1Goods" :key="item.goodsId" @click="addOrderList(item)">
                    <span class="foodImg">
                      <img :src="item.goodsImg" width="100%" />
                    </span>
                    <span class="foodName">{{item.goodsName}}</span>
                    <span class="foodPrice">￥{{item.price}}元</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="饮品">
                <ul class="cookList">
                  <li v-for="item in type2Goods" :key="item.goodsId" @click="addOrderList(item)">
                    <span class="foodImg">
                      <img :src="item.goodsImg" width="100%" />
                    </span>
                    <span class="foodName">{{item.goodsName}}</span>
                    <span class="foodPrice">￥{{item.price}}元</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="套餐">
                <ul class="cookList">
                  <li v-for="item in type3Goods" :key="item.goodsId" @click="addOrderList(item)">
                    <span class="foodImg">
                      <img :src="item.goodsImg" width="100%" />
                    </span>
                    <span class="foodName">{{item.goodsName}}</span>
                    <span class="foodPrice">￥{{item.price}}元</span>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Pos",
  data() {
    return {
      tableData: [],
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: [],
      totalNum: 0,
      totalMoney: 0,
    };
  },
  created: function () {
    axios
      .get(
        "https://www.fastmock.site/mock/0bf6a5bae7eab8507e44b56191ddff36/vuepos/oftenGoods"
      )
      .then((response) => {
        this.oftenGoods = response.data.oftenGoods;
      })
      .catch((error) => {
        alert("网络错误，不能访问");
      });

    //读取分类商品列表
    axios
      .get(
        "https://www.fastmock.site/mock/0bf6a5bae7eab8507e44b56191ddff36/vuepos/typeGoods"
      )
      .then((response) => {
        this.type0Goods = response.data.data[0];
        this.type1Goods = response.data.data[1];
        this.type2Goods = response.data.data[2];
        this.type3Goods = response.data.data[3];
      })
      .catch((error) => {
        alert("网络错误，不能访问");
      });
  },
  mounted: function () {
    let orderHeight = document.body.clientHeight;
    document.getElementById("order-list").style.height = orderHeight + "px";
  },
  methods: {
    // 添加商品
    addOrderList(goods) {
      this.totalNum = 0;
      this.totalMoney = 0;
      //先判断是否已有该商品
      let isHave = false;

      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].goodsId === goods.goodsId) {
          isHave = true;
        }
      }

      //根据判断写商品的业务逻辑
      if (isHave) {
        var arr = this.tableData.filter((o) => o.goodsId == goods.goodsId);
        arr[0].count++;
      } else {
        let newGoods = {
          goodsId: goods.goodsId,
          goodsName: goods.goodsName,
          price: goods.price,
          count: 1,
        };

        this.tableData.push(newGoods);
      }
      this.tableData.forEach((element) => {
        this.totalNum += element.count;
        this.totalMoney =
          this.totalMoney + parseInt(element.price * element.count);
      });
    },
    //删除单个商品
    delSingleGoods(goods) {
      console.log(goods);
      this.tableData = this.tableData.filter((o) => o.goodsId != goods.goodsId);
      this.getAllMoney();
    },
    //计算总金额
    getAllMoney() {
      this.totalNum = 0;
      this.totalMoney = 0;
      if (this.tableData) {
        this.tableData.forEach((element) => {
          this.totalNum += element.count;
          this.totalMoney =
            this.totalMoney + parseInt(element.price * element.count);
        });
      }
    },
    //删除所有商品
    delAllGoods() {
      if (this.totalNum != 0) {
        this.tableData = [];
        this.totalNum = 0;
        this.totalMoney = 0;
      } else {
        this.$message.error("暂无商品");
      }
    },
    //模拟结账
    checkOut() {
      if (this.totalNum != 0) {
        this.tableData = [];
        this.totalNum = 0;
        this.totalMoney = 0;
        this.$message({
          message: "结账成功，感谢你为店里出了一份力！",
          type: "success",
        });
      } else {
        this.$message.error("不能空结，请添加商品重试！");
      }
    },
    //敬请期待
    coming() {
      this.$message("敬请期待");
    },
  },
};
</script>

<style scoped>
.pos {
  font-size: 12px;
}
.pos-order {
  background-color: #f9fafc;
  border-right: 1px solid #c0ccda;
}
.order-btn {
  margin-top: 10px;
  text-align: center;
}
.title {
  height: 20px;
  border-bottom: 1px solid #d3dce6;
  background-color: #f9fafc;
  padding: 10px;
}
.often-goods-list ul li {
  list-style: none;
  float: left;
  border: 1px solid #e5e9f2;
  padding: 10px;
  margin: 5px;
  background-color: #fff;
  cursor: pointer;
  min-width: 140px;
  text-align: center;
}
.goods-type {
  clear: both;
}
.o-price {
  color: #58b7ff;
}
.often-goods-list {
  border-bottom: 1px solid #c0ccda;
  height: auto;
  overflow: hidden;
  padding-bottom: 10px;
  background-color: #f9fafc;
}
.cookList li {
  list-style: none;
  width: 23%;
  border: 1px solid #e5e9f2;
  height: auot;
  overflow: hidden;
  background-color: #fff;
  padding: 2px;
  float: left;
  margin: 2px;
  cursor: pointer;
  min-height: 115px;
}
.cookList li span {
  display: block;
  float: left;
}
.foodImg {
  width: 40%;
  height: 115px;
}
.foodImg img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.foodName {
  width: 150px;
  font-size: 18px;
  padding-left: 10px;
  color: brown;
}
.foodPrice {
  font-size: 16px;
  padding-left: 10px;
  padding-top: 10px;
}
.totalDiv {
  height: auot;
  overflow: hidden;
  text-align: center;
  font-size: 16px;
  background-color: #fff;
  border-bottom: 1px solid #e5e9f2;
  padding: 10px;
}
.totalDiv span {
  display: inline-block;
  margin: 0 30px;
}

</style>
