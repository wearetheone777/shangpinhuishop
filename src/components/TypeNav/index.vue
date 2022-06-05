<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <div @mouseleave="leaveIndex" @mouseenter="enterShow">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="show">
            <!-- 一级菜单 -->
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item bo"
                v-for="(c1, index) in categoryList"
                v-bind:key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-categoryId1="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 二三级菜单 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    v-bind:key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-categoryId2="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em
                          v-for="c3 in c2.categoryChild"
                          v-bind:key="c3.categoryId"
                        >
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-categoryId3="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      //存储用户鼠标移上哪一个一级分类
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕：可以向服务器发请求
  mounted() {
    //通知Vuex发请求，获取数据，存储于仓库当中
    this.$store.dispatch("categoryList"); //第一个参数是路径,第二个参数是传值
    //如果不是Home路由组件，将typeNav进行隐藏
    if (this.$route.path != "/home") {
      this.show = false;
    }
  },
  computed: {
    ...mapState({
      //右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
      //注入一个参数state，其实即为大仓库中的数据
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    // 鼠标离开修改响应式数据currentIndex属性 并且让商品分类列表进行隐藏
    leaveIndex() {
      // 离开后把当前的index变成-1
      this.currentIndex = -1;
      //让商品分类列表进行隐藏判断 如果是search路由组件的时候才会执行
      if (this.$route.path != "/home") {
        this.show = false;
      }
    },
    // 鼠标进入修改响应式数据currentIndex属性
    changeIndex: throttle(function (index) {
      // console.log(index);
      // index：鼠标移上某一个一级分类的元素的索引值
      this.currentIndex = index;
      // console.log("工作了", index);
    }, 50),

    //最好的解决方案：编程式导航+事件委派
    goSearch(e) {
      // 存在一些问题：事件委派，是把全部的子节点【h3、dt、d1、em】的事件委派给父亲节点点击a标签的时候，才会进行路由跳转【怎么能确定点击的一定是a标签】I
      //存在另外一个问题：即使你能确定点击的是a标签，如何区分是一级、二级、三级分类的标签。
      //第一个问题：把子节点当中a标签，我加上自定义属性data-categoryName，其余的子节点是没有的
      let element = e.target;
      //节点有一个属性dataset属性，可以获取节点的自定义属性与属性值 解构赋值
      let { categoryname, categoryid1, categoryid2, categoryid3 } =
        element.dataset;
      //如果标签身上拥有categoryname一定是a标签
      if (categoryname) {
        //一级分类、二级分类、三级分类的a标签
        // 整理路由参数
        let location = { name: "soso" };
        let query = { categoryName: categoryname };
        if (categoryid1) {
          // 整理id1
          query.categoryId1 = categoryid1;
        } else if (categoryid2) {
          // 整理id2
          query.categoryId2 = categoryid2;
        } else {
          // 整理id3
          query.categoryId3 = categoryid3;
        }
        //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if (this.$route.params) {
          location.params = this.$route.params;
          // 合并路径和参数
          location.query = query;
          // 路由调转
          this.$router.push(location);
        }
      }
    },
    // 当鼠标移入的时候，让商品分类列表进行展示
    enterShow() {
      this.show = true;
    },
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
        }
        .cur {
          background-color: skyblue;
        }
      }
    }

    //过渡动画的样式
    // 过渡动画开始状态（进入）
    .sort-enter {
      height: 0px;
    }
    //过渡动画结束状态（进入）
    .sort-enter-to {
      height: 481px;
    }
    //定义动画时间、速率
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>