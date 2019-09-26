<template>
  <div>
    <app-header></app-header>
    <app-navbar></app-navbar>
    <app-main></app-main>
  </div>
</template>
<script>
// 会导入 ./AppHeader 下面的 index.vue组件
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'

export default {
    components: {AppHeader, AppNavbar, AppMain}
}
</script>
<style scoped>
/* 头部区域 */
.header {
    position: absolute;
    line-height: 50px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: #2d3a4b
}
.navbar {
    position: absolute;
    width: 230px;
    top: 50px;
    left: 0px;
    bottom: 0px;
    overflow-y: auto;
    background-color: #545c64;
}
.main {
    position: absolute;
    top: 50px;
    left: 230px;
    right: 0px;
    bottom: 0px;
    padding: 10px;
    overflow-y: auto;
    /* background-color: red; */
}
</style>