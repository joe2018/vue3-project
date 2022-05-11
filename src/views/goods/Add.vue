<template>
<div>
<!--  卡片视图-->
  <el-card>
<!--    提示信息-->
  <el-alert
  title="添加商品信息"
  type="info"
  center
  show-icon
  :closable="false"
  >
  </el-alert>
<!--    步骤条区域-->
    <el-steps :active="activeIndex - 0" align-center finish-status="success" >
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <el-form
      ref="addGoodsFormRef"
      :model="addGoodsForm"
      :rules="addGoodsmRules"
      label-width="150px"
      label-position="top"
    >
    <el-tabs :tab-position="tabPosition" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
      <el-tab-pane label="基本信息" name="0" >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addGoodsForm.goods_name" />
        </el-form-item>
        <el-form-item label="商品价格（元）" prop="goods_price">
          <el-input type="number" v-model="addGoodsForm.goods_price" />
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input type="number" v-model="addGoodsForm.goods_weight" />
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input type="number" v-model="addGoodsForm.goods_number" />
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            clearable
            v-model="addGoodsForm.goods_cat"
            @change="parentCateChanged"
          />
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数" name="1" >
        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox :label="cb"  v-for="(cb,i) in item.attr_vals" :key="i" border/>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性" name="2" >
        <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
          <el-input v-model="item.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="3" >
        <el-upload
          :action="uploadURL"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :headers="headerObj"
          :on-success="handleSuccess"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" class="previewImg"/>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="4" >
        <!-- 富文本编辑器 -->
        <vue3-tinymce v-model="addGoodsForm.goods_introduce" :setting="setting"/>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
</div>
</template>

<script setup>
import api from '@/axios/config'
import { ref, reactive, onBeforeMount } from 'vue'
import Vue3Tinymce from '@jsdawn/vue3-tinymce'

const { Plus } = require('@element-plus/icons')
const { ElMessage } = require('element-plus')

const setting = reactive({
  height: 400,
  language: 'zh_CN',
  language_url: 'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js',
  // 开启组件拓展的 上传图片功能，工具栏 图片按钮 弹框中出现 `upload` 选项
  custom_images_upload: true,
  // 复用 图片上传 api 地址
  images_upload_url: 'http://127.0.0.1:8888/api/private/v1/upload/',
  // 上传成功回调函数，return 图片地址。默认 response.location
  custom_images_upload_callback: response => response.url,
  // 上传 api 请求头
  custom_images_upload_header: { Authorization: window.sessionStorage.getItem('token') }
})

// 启动执行
onBeforeMount(() => {
  getCateList()
})

// 步骤条Index
const activeIndex = ref(0)

// 标签页位置
const tabPosition = ref('left')

// 表单引用对象
const addGoodsFormRef = ref()

// 表单属性
const addGoodsForm = reactive({
  goods_name: '',
  goods_price: 0,
  goods_weight: 0,
  goods_number: 0,
  goods_cat: [],
  pics: [],
  goods_introduce: ''
})

// 指定级联选择器的配置对象
const cascaderProps = reactive({
  value: 'cat_id',
  label: 'cat_name',
  children: 'children',
  expandTrigger: 'hover'
})

// 表单验证
const addGoodsmRules = reactive({
  goods_name: [
    { required: true, message: '商品名不能为空', trigger: 'blur' },
    { min: 2, max: 26, message: '商品名长度在 3 到 26个字符', trigger: 'blur' }
  ],
  goods_price: [
    { required: true, message: '价格不能为空', trigger: 'blur' }
  ],
  goods_weight: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  goods_number: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  goods_cat: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ]
})

// 获取所有商品分类数据
const getCateList = async () => {
  const { data: res } = await api.get('/categories')
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  cateList.value = res.data
}

// 商品分类列表
const cateList = ref()

// 选中项发送变化时触发
const parentCateChanged = () => {
  if (addGoodsForm.goods_cat) {
    if (addGoodsForm.goods_cat.length !== 3) {
      addGoodsForm.goods_cat = []
    }
  }
}

// 标签页切换控制函数
const beforeTabLeave = (activeName, oldActiveName) => {
  if (addGoodsForm.goods_name === '' || addGoodsForm.goods_cat.length < 3) {
    ElMessage.error('未填写商品名称或未选择分类')
    return false
  }
  return true
}

// 标签点击触发函数
const tabClicked = async () => {
  if (activeIndex.value === '1') {
    const { data: res } = await api.get(`categories/${cateId()}/attributes`, { params: { sel: 'many' } })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    res.data.forEach(item => {
      item.attr_vals = item.attr_vals
        ? item.attr_vals.split(' ')
        : []
      manyTabData.value = res.data
    })
  } else if (activeIndex.value === '2') {
    const { data: res } = await api.get(`categories/${cateId()}/attributes`, { params: { sel: 'only' } })
    if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
    res.data.forEach(item => {
      item.attr_vals = item.attr_vals
        ? item.attr_vals.split(' ')
        : []
      onlyTabData.value = res.data
    })
  }
}

// 分类ID
const cateId = () => {
  if (addGoodsForm.goods_cat.length === 3) {
    return addGoodsForm.goods_cat[2]
  }
  return null
}

const uploadURL = ref('http://127.0.0.1:8888/api/private/v1/upload/')
// 参数数据
const manyTabData = ref()

// 静态属性
const onlyTabData = ref()

const dialogVisible = ref(false)
const dialogImageUrl = ref('')

// 图片上传组件的请求头
const headerObj = reactive({
  Authorization: window.sessionStorage.getItem('token')
})

// 移除图片
const handleRemove = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

// 预览图片
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

// 图片上传完成后的钩子函数
const handleSuccess = (response, uploadFile) => {
  const picInfo = { pic: response.data.tmp_path }
  console.log(uploadFile)
  addGoodsForm.pics.push(picInfo)
  console.log(addGoodsForm.pics)
}

</script>

<style lang="less" scoped>
.el-step__title {
  font-size: 13px;
}

.el-steps{
  margin: 15px 0;
  width: 100%;
  justify-content: space-between;
  font-size: 13px;
}
.el-checkbox{
  margin: 0 10px 0 0;
}
.previewImg{
  width: 100%;
}
</style>
