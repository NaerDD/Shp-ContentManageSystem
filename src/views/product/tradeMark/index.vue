<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" size="default" icon="el-icon-plus" style="margin: 10px 0px" @click="
    showDialog">
      添加</el-button>
    <!-- 
      表格: 
        data:表格组件将来需要展示的数据----数组类型
        border:边框
        label:显示标题
        width:对应列的宽度
        align:标题的对齐方式
        prop:对应列内容的字段名
        注意1:elementUI当中的table组件,展示的数据是一列一列进行展示数据的
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80%"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器:
         当前第几页 current-page
         一共数据总条数 total
         每一页展示条数 page-sizes
         每一页展示多少条数据 page-sizes
         分页器布局 layout
         分页器展示多少个按钮 pager-count="7"
         @current-change="handleSizeChange" 当前点击页码的时候 返还你点击的index
         @size-change="handleSizeChange"  页码中数据条数发生变化的时候 调用该函数
    -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :pager-count="7"
      :total="total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev,pager,next,jumper,->,sizes,total"
    >
    </el-pagination>
    <!-- 
      对话框
      :visible.sync 控制对话框显示与隐藏用的
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible" >
      <!-- form表单 model属性,这个属性的作用是,把表单的数据收集到那个对象的身上,将来表单验证,也需要这个属性-->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            :on-success="handleAvatarSuccess" //上传成功的回调
            :before-upload="beforeAvatarUpload" //上传之前的回调
            action="" //设置图片上传地址
            这里收集数据:不能使用v-model 因为不是表单元素
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validatetmName = (rule, value, callback) => {
        if (value.length<2||value.length>10) {
          callback(new Error('品牌名称2-10位'));
        } else {
          callback();
        }
      };
    return {
      //代表的分页器第几页
      page: 1,
      //当前页数展示数据条数
      limit: 3,
      //总共数据条数
      total: 0,
      //列表展示的数据
      list: [],
      //对话框显示与隐藏控制的属性
      dialogFormVisible:false,
      //收集品牌信息
      tmForm:{
        tmName:'',
        logoUrl:''
      },
      //表单验证的规则
      rules:{
        //品牌名称的验证规则 required 必须填写 以及字段前方的红色标记 message 提示信息 trigger用户行为设置 blur change
        tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            //品牌名称长度 自定义校验规则
            { validator: validatetmName, trigger: 'change' }

          ],
          //品牌logo的验证规则
        logoUrl: [
            { required: true, message: '请选择品牌图片'},

          ],
      }
    };
  },
  //组件挂载完毕
  mounted() {
    console.log(this.$API);

    //获取列表数据方法
    this.getPageList();
  },
  methods: {
    //点击添加品牌的按钮
    showDialog(){
      //显示对话框
      this.dialogFormVisible = true;
      //清除取消后残留数据
      this.tmForm = {tmName:'',logoUrl:''}
    },
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      //解构出当前参数
      const { page, limit } = this;
      //获取品牌列表的接口 当前的页码
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      // console.log(result);
      if (result.code == 200) {
        //展示数据的总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当分页器某一页需要展示的数据条数发生变化的时候触发
    handleSizeChange(limit) {
      console.log("当前页面展示" + limit + "条数据");
      this.limit = limit;
      this.getPageList();
    },
    //修改某一个品牌
    updateTradeMark(row){
      this.dialogFormVisible = true;
      //row就是当前用户选中的这个品牌信息
      //将已有的品牌赋值给tmForm进行展示
      //将服务器返回品牌的信息,直接赋值给了tmForm进行展示
      //也就是tmForm存储即为服务器返回品牌信息
      this.tmForm = {...row};
    },
    //上传图片成功相关的回调
    handleAvatarSuccess(res, file) {
      //res: 上传成功之后返回前端的数据
      //file:上传成功之后服务器返回给前端的数据
      //收集品牌图片数据,因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    //上传图片之前相关的格式 大小判断
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    //添加按钮(添加品牌|修改品牌)
    addOrUpdateTradeMark(){
      //如果全部验证字段通过,再去书写业务逻辑
      this.$refs.ruleForm.validate(async(success)=>{
        if(success){
        this.dialogFormVisible = false;
      //发请求
      let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
      console.log(result);
      if(result.code==200){
        //弹出信息:添加/修改品牌成功
        this.$message({
          showClose: true,
          message:this.tmForm.id?'修改品牌成功':'添加品牌成功',
          type: 'success',
          }
          );
        //添加或修改之后
        //如果是添加品牌 停留在第一页,修改品牌留在当前页面
        this.getPageList(this.tmForm.id?this.page:1);
      }else{
        console.log('错误的提交!');
        return false;
        
      }
      }}
      )
    },
    //删除操作
    deleteTradeMark(row){
      //弹框
      this.$confirm(`确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          //当用户点击确定按钮后
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          //如果删除成功
          if(result.code == 200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //再次获取品牌列表数据
          this.getPageList(this.list.length>1?this.page:this.page-11);
          }
        }).catch(() => {
          //当用户点击取消按钮后
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>