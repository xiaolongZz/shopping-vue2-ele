<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table 表格区域 -->
      <el-table :data="goodsList" border stripe :header-cell-style="{textAlign: 'center'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="120px" align="center"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="250px" align="center">
          <template slot-scope="scope">{{scope.row.add_time | dataFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDiaLog(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 编辑对话框区域 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editRuleForm" :rules="editRules" ref="editRuleFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editRuleForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="editRuleForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="editRuleForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="editRuleForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品介绍">
          <el-input v-model="editRuleForm.goods_introduce" type="number"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editById()">提 交</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 控制编辑商品的显示和隐藏
      editDialogVisible: false,
      // 根据id查询到商品数据
      editRuleForm: {},
      // 编辑商品时的验证规则
      editRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败！')
      }
      // this.$message.success('获取商品列表成功~')
      // console.log(res.data)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async showEditDiaLog(id) {
      const { data: res } = await this.$http.get(`goods/${id}`)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.editRuleForm = res.data
      this.editDialogVisible = true
    },
    editById() {
      this.$refs.editRuleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('goods/' + this.editRuleForm.goods_id, {
          goods_name: this.editRuleForm.goods_name,
          goods_price: this.editRuleForm.goods_price,
          goods_number: this.editRuleForm.goods_number,
          goods_weight: this.editRuleForm.goods_weight,
          goods_introduce: this.editRuleForm.goods_introduce,
          pics: this.editRuleForm.pics,
          attrs: this.editRuleForm.attrs,
        })
        if (res.meta.status !== 400) {
          return this.$message.error('编辑商品信息失败！')
        }
        this.editDialogVisible = false
        this.getGoodsList()
        this.$message.success('更新商品信息成功~')
      })
    },
    async removeById(id) {
      const confiemResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confiemResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功~')
      this.getGoodsList()
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
  },
}
</script>
<style lang="less" scoped>
</style>