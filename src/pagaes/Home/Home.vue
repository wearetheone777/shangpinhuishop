<template>
  <div>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="(floor, index) in floorList" :key="floor.id" :list="floor" />
    <Brand></Brand>
  </div>
</template>

<script>
import ListContainer from '@/pagaes/Home/ListContainer/index.vue';
import Recommend from '@/pagaes/Home/Recommend/index.vue';
import Rank from '@/pagaes/Home/Rank/index.vue';
import Like from '@/pagaes/Home/Like/index.vue';
import Floor from '@/pagaes/Home/Floor/index.vue';
import Brand from '@/pagaes/Home/Brand/index.vue';
import { mapState } from 'vuex';

export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  mounted() {
    this.$store.dispatch('getFloorList');
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>

<style>
</style>