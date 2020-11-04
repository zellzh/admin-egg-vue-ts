<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {

  },
}
</script>

<style lang="scss">
/* 全局样式  */
html, body, #app{
  width: 100%;
  height: 100%;
}

// 将 html 的滚动条变为容器内部的, 防止压缩页面
#app{
  // 同时解决弹窗抖动问题
  position: relative;
  overflow-y: auto;
}

p, h1, h2, h3{
  margin: 0
}

ul, ol{
  list-style: none;
  padding: 0;
  margin: 0;
}

image{
  vertical-align: bottom;
}

div{
  box-sizing: border-box;
}

a{
  color: #248397;
  text-decoration: none;
}
</style>
