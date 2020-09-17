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

<style>
/* 全局样式  */
html,body, #app{
    width: 100%;
    height: 100%;
}

p, h1, h3{
  margin: 0
}
div{
  box-sizing: border-box;
}
a{
  color: #248397;
}
</style>
