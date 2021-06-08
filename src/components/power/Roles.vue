<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 添加角色的对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRolesVisible" width="50%" @close="addRolesClosed">
        <!-- 内容主题区域 -->
        <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRuleFormRef" label-width="100px" status-icon>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色的对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRolesVisible" width="50%" @close="editRolesClosed">
        <!-- 主体区域 -->
        <el-form :model="editRolesForm" :rules="editRolesFormRules" ref="editRuleFormRef" label-width="100px" status-icon>
          <el-form-item label="角色ID">
            <el-input v-model="editRolesForm.roleId" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="editRuleName">
            <el-input v-model="editRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="editRuleDesc">
            <el-input v-model="editRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 设置权限对话框 -->
      <el-dialog title="设置权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border :cell-style="{ textAlign: 'center' }" :header-cell-style="{textAlign: 'center'}">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdtop':'','vecenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 第一列 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0 ? '' :'bdtop','vecenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级标签 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <!-- eslint-disable-next-line -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">设置权限</el-button>
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
      // 所以角色列表数据
      rolelist: [],
      // 控制添加角色信息的对话框的显示和隐藏
      addRolesVisible: false,
      // 控制设置权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 添加用户的表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色的验证规则对象
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '角色名的长度在1~6个字符之间',
            trigger: 'blur',
          },
        ],
        roleDesc: [{ required: false }],
      },
      // 控制编辑角色的对话框的显示和隐藏
      editRolesVisible: false,
      // 查询到的角色信息对象
      editRolesForm: {},
      // 编辑角色信息的验证规则对象
      editRolesFormRules: {
        editRuleName: [
          { required: false, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '角色名的长度在3~6个字符之间',
            trigger: 'blur',
          },
        ],
        editRuleDesc: [{ required: false }],
      },
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      // 默认选中的节点ID值
      defKeys: [],
      // 即将分配权限的角色id
      roleID: '',
    }
  },
  created() {
    this.getRoleslist()
  },
  methods: {
    // 获取所有角色列表
    async getRoleslist() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
      //   console.log(this.rolelist)
    },
    // 监听添加角色对话框的关闭事件
    addRolesClosed() {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 监听编辑角色对话框的关闭事件
    editRolesClosed() {
      this.$refs.editRuleFormRef.resetFields()
    },
    // 点击按钮添加新角色
    addRoles() {
      this.$refs.addRuleFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加用户成功~')
        // 隐藏添加角色的对话框
        this.addRolesVisible = false
        this.getRoleslist()
      })
    },
    // 展示编辑角色的对话框
    async showEditRoles(id) {
      //   console.log(id)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色信息失败！')
      }
      this.editRolesForm = res.data
      this.editRolesVisible = true
    },
    // 修改用户信息 并提交
    editRolesInfo() {
      this.$refs.editRuleFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        )
        if (res.meta.status !== 200) {
          return $message.error('更新角色信息失败！')
        }
        // 关闭对话框
        this.editRolesVisible = false
        // 刷新数据列表
        this.getRoleslist()
        // 提示刷新列表
        this.$message.success('更新角色信息成功')
      })
    },
    // 根据ID 删除对应的角色信息
    async removeRoleById(id) {
      //   console.log(id)
      // 弹框询问用户是否删除角色
      const confirmResult = await this.$confirm(
        '将删除该角色信息, 是否继续?',
        '删除角色',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 如果用户确认删除 则返回的是 字符串 confirm
      // 如果用户取消删除 则返回的是 字符串 cancel
      //   console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色信息失败！')
      }
      this.$message.success('删除角色成功~')
      this.getRoleslist()
    },
    // 根据对应ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // this.getRoleslist()
      role.children = res.data
    },
    // 展示设置权限的对话框
    async showSetRightDialog(role) {
      this.roleID = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      // 获取到的权限数据保存到data中
      this.rightsList = res.data

      // 递归获取三级节点ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式 获取角色下所有三级权限的id 并且保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前节点不包含children属性 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听设置权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定 为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleID}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功~')
      this.getRoleslist()
      this.setRightDialogVisible = false
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vecenter {
  display: flex;
  align-items: center;
}
</style>