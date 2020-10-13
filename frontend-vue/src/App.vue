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
