<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightstList" border :cell-style="{ textAlign: 'center' }" :header-cell-style="{textAlign: 'center'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">王者</el-tag>
            <el-tag type="success" v-if="scope.row.level==='1'">黄金</el-tag>
            <el-tag type="warning" v-if="scope.row.level==='2'">黑铁</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 权限列表
      rightstList: [],
    }
  },
  created() {
    this.getRigthsList()
  },
  methods: {
    // 获取权限列表
    async getRigthsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightstList = res.data
    },
  },
}
</script>
<style lang="less" scoped>
</style>