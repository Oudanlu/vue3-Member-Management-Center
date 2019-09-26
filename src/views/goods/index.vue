<template>
    <div>
        <!-- :inline="true" 表单一行显示 -->
        <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
            <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
            <el-form-item prop="name">
                <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input v-model="searchMap.code" placeholder="商品编号" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="supplierName">
                <el-input readonly
                @click.native="dialogSupplierVisible = true"
                v-model="searchMap.supplierName" placeholder="选择供应商" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData" >查询</el-button>
                <el-button type="primary" @click="handleAdd" >新增</el-button>
                 <el-button @click="$refs['searchForm'].resetFields()" >重置</el-button>
            </el-form-item>
        </el-form>

         <el-table
            :data="list"
            height="380"
            border
            style="width: 100%">
            <!-- type="index"获取索引值，从1开始 ，label显示标题，prop 数据字段名，width列宽 -->
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="name" label="商品名称" ></el-table-column>
            <el-table-column prop="code" label="商品编码" width="90"></el-table-column>
            <el-table-column prop="spec" label="商品规格" ></el-table-column>
            <el-table-column prop="retailPrice" label="零售价" ></el-table-column>
            <el-table-column prop="purchasePrice" label="进货价" ></el-table-column>
            <el-table-column prop="storageNum" label="库存数量" ></el-table-column>
            <el-table-column prop="supplierName" label="供应商" ></el-table-column>
             <el-table-column label="操作" width="150">
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>

        <!-- 选择供应商对话框 -->
        <el-dialog title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
            <supplier @option-supplier="optionSupplier" :isDialog="true"></supplier>
        </el-dialog>


        <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="500px">
            <el-form 
            :rules="rules"
            ref="pojoForm"
            label-width="100px"
            label-position="right"
            style="width: 400px;"
            :model="pojo">
                <el-form-item label="商品名称" prop="name" >
                    <el-input v-model="pojo.name" ></el-input>
                </el-form-item>
                <el-form-item label="商品编码" prop="code" >
                    <el-input v-model="pojo.code" ></el-input>
                </el-form-item>
                <el-form-item label="商品规格" prop="spec" >
                   <el-input v-model="pojo.spec" ></el-input>
                </el-form-item>
                <el-form-item label="零售价" prop="retailPrice">
                    <el-input v-model="pojo.retailPrice" ></el-input>
                </el-form-item>
                <el-form-item label="进货价" prop="purchasePrice">
                    <el-input v-model="pojo.purchasePrice" ></el-input>
                </el-form-item>
                <el-form-item label="库存数量" prop="storageNum">
                    <el-input v-model="pojo.storageNum" ></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplierName">
                    <el-input 
                    readonly
                    @click.native="editOptionSupplier"
                    v-model="pojo.supplierName" placeholder="选择供应商"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button>
                <!-- <el-button type="primary" @click="addData('pojoForm')">确 定</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
import goodsApi from '@/api/goods'
import Supplier from '@/views/supplier'


export default {
    // 注册 Supplier 作为子组件
    components: {Supplier},

    data() {
        return {
            list: [],
            pageSize: 10,
            currentPage: 1,
            total: 0,
            searchMap: {
                name: '',
                code: '',
                supplierName: ''
            },
            dialogSupplierVisible: false, // 弹出选择供应商对话框
            dialogFormVisible: false, // 编辑窗口
            rules: {
                name: [
                    {required: true, message:'商品名称不能为空', trigger: 'blur'}
                ],
                code: [
                    {required: true, message:'商品编码不能为空', trigger: 'blur'}
                ],
                retailPrice: [
                    {required: true, message:'零售价不能为空', trigger: 'blur'}
                ]
            },
            pojo: {
                id: null,
                name: '',
                code: '',
                spec: '',
                retailPrice: 0.0,
                purchasePrice: 0.0,
                storageNum: 0,
                supplierName: '',
                supplierId: null
            },
            isEdit: false // 是否为编辑窗口
        }
    },

    created() {
        this.fetchData()
    },

    methods: {
        fetchData() {
            goodsApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const data = response.data.data
                this.list = data.rows
                this.total = data.total
                // console.log(this.list)
            })
        },

        handleSizeChange(val) {
            this.pageSize = val
            this.fetchData() 
        },

        handleCurrentChange(val) {
            this.currentPage = val
            this.fetchData() 
        },

        optionSupplier(currentRow) { // currentRow 子组件传递的数据
            console.log('parent', currentRow)
            if(this.isEdit) {
                // 是编辑窗口打开的选择供应商
                this.pojo.supplierName = currentRow.name
                this.pojo.supplierId = currentRow.id // 供应商ID
            }else {
                // 就是搜索区域打开的选择供应商
                this.searchMap.supplierName = currentRow.name // 供应商名称
                this.searchMap.supplierId = currentRow.id // 供应商ID
            }
            this.isEdit = false // 注意重新赋值 false
            this.dialogSupplierVisible = false //关闭窗口
            
        },

        handleAdd() {
            this.dialogFormVisible = true
            this.$nextTick(() => { 
                // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
                // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
                this.$refs['pojoForm'].resetFields()
            })
        },
        // 提交新增数据
        addData(formName) {
            this.$refs[formName].validate(valid => {
                if(valid) {
                    //提交表单
                    goodsApi.add(this.pojo).then(response => {
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

        editOptionSupplier() {
            this.isEdit = true // 当前是通过编辑窗口中的选择供应商打开的窗口
            this.dialogSupplierVisible = true
        },

        // 打开编辑窗口
        handleEdit(id) {
            this.handleAdd()
            goodsApi.getById(id).then(response => {
                const resp = response.data
                if(resp.flag) {
                    this.pojo = resp.data
                }
            })
        },
        // 提交更新的数据
        updateData(formName) {
            console.log('更新')
            this.$refs[formName].validate(valid => {
                if(valid) {
                    // 校验通过
                    goodsApi.update(this.pojo).then(response => {
                        const resp = response.data
                        if(resp.flag) {
                            // 修改成功, 刷新数据, 关闭窗口
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
                    //页面没有校验通过
                    return false
                }
            })
        },

        handleDelete(id) {
            console.log(id)
            this.$confirm('确认删除这条记录吗?', '提示', {
                confirmButtonText: '确认',
                cancleButtonText: '取消'
            }).then(() => {
                goodsApi.deleteById(id).then(response => {
                    const resp = response.data
                    this.$message({
                        message: resp.message,
                        type: resp.flag ? 'success': 'error'
                    })

                    if(resp.flag) {
                        // 删除成功,刷新列表
                        this.fetchData()
                    }
                })
            }).catch(() => {
                // 取消删除
            })
        }
    },
}
</script>