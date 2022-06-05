<template>
  <div class="pagination">
    <!-- 上面部分 -->
    <button :disabled="pageNo == 1" @click="$emit('getPageNo', pageNo - 1)">
      上一页
    </button>
    <button
      v-show="startNumAndEndNumber.start > 1"
      @click="$emit('getPageNo', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <button v-show="startNumAndEndNumber.start > 2">···</button>
    <!-- 中间部分 -->
    <button
      v-for="(page, index) in startNumAndEndNumber.end"
      :key="index"
      v-show="page >= startNumAndEndNumber.start"
      @click="$emit('getPageNo', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>
    <!-- 下面部分 -->
    <button v-show="startNumAndEndNumber.end < totalPage - 1">···</button>
    <button
      v-show="startNumAndEndNumber.end < totalPage"
      @click="$emit('getPageNo', totalPage)"
      :class="{ active: pageNo == totalPage }"
    >
      {{ totalPage }}
    </button>
    <button @click="$emit('getPageNo', pageNo + 1)">下一页</button>
    <h1>{{ startNumAndEndNumber }}--{{ pageNo }}--{{ totalPage }}</h1>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageSize", "pageNo", "total", "continues"],
  computed: {
    // 总共多少页
    totalPage() {
      // 向上取整
      return Math.ceil(this.total / this.pageSize);
    },
    //计算出连续的页码的起始数字与结束数字[连续页码的数字：至少是5]
    startNumAndEndNumber() {
      let { totalPage, pageNo, total, continues } = this; //解构以后就不用写this了
      let start = 0,
        end = 0; //先定义两个变量存储起始数字与结束数字
      // 连续页码数字5【就是至少五面】，加果出现不正常的现象【就是不够五页】
      //不正常现象【总页数没有连续页码多】
      if (continues > total) {
        start = 1;
        end = totalPage;
      } else {
        // 正常现象【连续页码5，但是你的总页数一定是大于5的】
        start = pageNo - parseInt(continues / 2); //5/2就会出现不是整数
        end = pageNo + parseInt(continues / 2);
      }
      // 把出现不正常的现象【start数字出现0|负数】纠正
      if (start < 1) {
        start = 1;
        end = continues;
      }
      // 把出现不正常的现象【end数字大于总页数totalPage】纠正
      if (end > totalPage) {
        start = totalPage - continues + 1; //加入总页数是31的情况 start开始应该是27所以31-5+1才等于27 (27,28,29,30,31)
        end = totalPage;
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
.active {
  background-color: skyblue;
}
</style>