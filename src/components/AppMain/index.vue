<template>
   <div class="main">
      <!-- 注意： link 不能使用，因为它是内置的标签
         你要使用另外一个名称就行了，一般加上一个前缀
       -->
      <app-link v-show="$route.path !== '/home'" ></app-link>
      <router-view></router-view>
   </div>
</template>

<script>
import AppLink from './Link.vue'
export default {
   components: {AppLink}
}
</script>
