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
    .el-table .cell{
      width: auto;
    }
    // 表格操作栏宽度
    .table-handle>.cell{
      min-width: 180px;
    }
  }

  // 删除提示 pop
  .el-popover{
    box-shadow: 0 0 3px #bbb !important;
  }
}
</style>
