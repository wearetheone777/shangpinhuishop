<template>
  <div>
    <Header></Header>
    <!-- 路由组件的出口 -->
    <router-view></router-view>
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
// 引入header
import Header from "./components/Header.vue";
// 引入Footer
import Footer from "./components/Footer.vue";
export default {
  name: "App",
  components: { Header, Footer },
};
</script>
<style>
</style>