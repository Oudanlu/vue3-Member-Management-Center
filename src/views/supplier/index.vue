<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="供应商名称" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="linkman" v-if="!isDialog">
                <el-input v-model="searchMap.linkman" placeholder="联系人" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" v-if="!isDialog">
                <el-input v-model="searchMap.mobile" placeholder="联系电话" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData" >查询</el-button>
                <el-button v-if="!isDialog" type="primary" @click="handleAdd" >新增</el-button>
                <el-button v-if="!isDialog" @click="resetForm('searchForm')" >重置</el-button>
            </el-form-item>
        </el-form>
        <!-- highlight-current-row 激活单选行
            @current-change 当点击某一行后,会触发这个事件,从而调用对应的函数clickCurrentChange
            clickCurrentChange函数会接收两个参数:currentRow，oldCurrentRow
         -->
        <el-table
            :highlight-current-row="isDialog"
             @current-change="clickCurrentChange"
            :data="list"
            height="380"
            border
            style="width: 100%">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="name" label="供应商名称" ></el-table-column>
            <el-table-column prop="linkman" label="联系人" width="90"></el-table-column>
            <el-table-column v-if="!isDialog" prop="mobile" label="联系电话" ></el-table-column>
            <el-table-column v-if="!isDialog" prop="remark" label="备注" ></el-table-column>
             <el-table-column v-if="!isDialog" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
             </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination
            :layout="!isDialog ? 'total, sizes, prev, pager, next, jumper': 'prev, pager, next'"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"            
            :total="total">
        </el-pagination>


        <el-dialog v-if="!isDialog"
        title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
            <el-form 
            :rules="rules"
            ref="pojoForm"
            label-width="100px"
            label-position="right"
            style="width: 400px;"
            :model="pojo">
                <el-form-item label="供应商名称" prop="name" >
                    <el-input v-model="pojo.name" ></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="linkman" >
                    <el-input v-model="pojo.linkman" ></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="mobile" >
                   <el-input v-model="pojo.mobile" ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="pojo.remark" ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import supplierApi from '@/api/supplier'

export default {
    props: {
        // 接收父组件传递过来 的数据,通过isDialog来判断 是否为弹框
        // 如果为 true, 则是弹框, false 就是列表
        isDialog: Boolean
    },
    data() {
        return {
            list: [],
            pageSize: 10, // 每页显示条数 10条
            currentPage: 1, // 当前页码 
            total: 0, // 总记录数
            searchMap: {
                name: '',
                linkman: '',
                mobile: ''
            }, // 条件查询的绑定字段值
            dialogFormVisible: false,
            pojo: {
                id: null,
                name: '',
                linkman: '',
                mobile: '',
                remark: ''
            },
            rules: {
                name: [
                    {required: true, message: '供应商不能为空', trigger: 'blur'}
                ],
                linkman: [
                    {required: true, message: '联系人不能为空', trigger: 'blur'}
                ]
            }
        }
    },

    created() {
        this.fetchData()
    },
    methods: {
        fetchData() {
            // supplierApi.getList().then(response => {
            supplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const data = response.data.data
                this.list = data.rows
                this.total = data.total
                console.log(this.list)
            })
        },
        
        // 当每页显示条数改变后，进行调用该方法,val是当前改变后条数
        handleSizeChange(val) {
            this.pageSize = val
            this.fetchData()
        },
        // 当页码改变之后 会进行调用
        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchData()
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        // 打开新增窗口
        handleAdd() {
            this.dialogFormVisible = true
            this.$nextTick(() => { 
                // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
                // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
                this.$refs['pojoForm'].resetFields()
            })
        },
        // 提交新增表单
        addData(formName) {

            this.$refs[formName].validate(valid => {
                if(valid) {
                    //提交表单
                    supplierApi.add(this.pojo).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            this.fetchData()
                            this.dialogFormVisible = false
                        }else {
                            this.$message({
                                message: resp.message,
                                type: 'warning'
                            })
                        }
                    })
                }else {
                    return false
                }
            })

        },

        //打开编辑窗口
        handleEdit(id) {
            // console.log('编辑', id)
            // 清除原来的表单数据和校验结果
            this.handleAdd()
            supplierApi.getById(id).then(response => {
                const resp = response.data
                if(resp.flag) {
                    this.pojo = resp.data
                }else {
                    //提示获取数据失败
                    this.$message({
                        message: resp.message,
                        type: 'warning'
                    })
                }
            })
        },

        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if(valid) {
                    // 页面校验通过,才可发送请求进行更新
                    supplierApi.update(this.pojo).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            // 更新成功,刷新数据,关闭窗口
                            this.fetchData()
                            this.dialogFormVisible = false
                        }else {
                            //提示更新失败
                            this.$message({
                                message: resp.message,
                                type: 'warning'
                            })
                        }
                    })
                }else {
                    return false
                }
            })
            
        },

        handleDelete(id) {
            console.log('删除', id)
            this.$confirm('确认删除这条记录吗?', '提示', {
                confirmButtonText: '确认',
                cancleButtonText: '取消'
            }).then(() => {
                supplierApi.deleteById(id).then(response => {
                    const resp = response.data
                    //提示更新失败
                    this.$message({
                        message: resp.message,
                        type: resp.flag ? 'success': 'error'
                    })

                    if(resp.flag) {
                        // 删除成功,刷新数据
                        this.fetchData()
                    }
                })
            }).catch(() => {
                // 取消删除
            })
            
        },

        // 当点击某一行时,会调用这个函数进行处理
        clickCurrentChange(currentRow) {
            console.log('子组件', currentRow)
            // 点击后,要将点击的数据传递到父组件(商品管理中), 
            // 则可以通过触发父组件中的option-supplier, 触发之后 ,
            //父组件可以在 option-supplier 这个事件对应的处理函数中进行接收数据currentRow
            this.$emit('option-supplier', currentRow)
        }
    },
    
}
</script>