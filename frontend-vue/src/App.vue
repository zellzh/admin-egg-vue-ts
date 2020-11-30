<template>
  <div id="app">
    <!-- 加 key, 切换路由后更新数据, 防止复用组件导致数据不变, 引发权限等数据不变的 bug -->
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {

  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    // 通过对router-view的v-if属性赋值，重新加载路由
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    }
  },
}
</script>

<style lang="scss">
#app{
  width: 100%;
  height: 100%;

  // 将 html 的滚动条变为容器内部的, 防止压缩页面
  // 同时解决弹窗(dialog...)抖动问题
  position: relative;
  overflow-y: auto;

  /*app 中通用的 element 样式
    ====================================== */
  // 卡片区域
  .el-card{
    margin-bottom: 20px;
    // 搜索栏
    .search-bar{
      margin-bottom: 20px;
      .bar-left{
        min-width: 700px;
      }
      .bar-right{
        min-width: 200px ;
        text-align: right;

        .excel-uploader{
          display: inline-block;
          margin-left: 10px;
        }
      }
    }

    // 表格
    .el-table{
      // 通过组件 min-width 属性控制
      // 表格操作栏宽度
      //.table-handle>.cell{
      //  min-width: 180px;
      //}
    }

  }

  // 删除提示 pop
  .el-popover{
    box-shadow: 0 0 3px #bbb !important;
  }
}
</style>
