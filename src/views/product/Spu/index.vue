<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 这部分有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示Spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu" >添加SPU</el-button>
        <el-table style="width:100%" border="" :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里按钮将来用hintButton替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                  <hint-button  type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器-->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          @current-change="currentChange"
          @size-change="sizeChange"
          :total="total">
        </el-pagination>
      </div>
      <!-- 
        自定义事件:
        给子组件打上一个ref=spu 之后在父组件的方法中就可以调用子组件的方法 
        而且调用时候可以传递row等一些参数给子组件的函数 从而实现传递参数
      而在子组件中直接使用挂载完毕后调用 会在页面展示完后直接调用 
      之后再点击不会再调用 -->
      <SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene==2" @changeScenes="changeScene" ref="sku"></SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示sku列表 -->
      <el-table :data="skuList"  style="width:100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入子组件
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      page:1,//分页器当前第几页
      limit:3,//一页多少数据
      records:[],//spu列表的数据
      total:0,//分页器一共需要展示的数据条数
      scene:0,//代表展示SPUI列表数据 1添加SPU|修改SPU 2添加SKU
      //控制对话框的显示隐藏
      dialogTableVisible: false,
      spu:{},
      skuList:[],//存储的是SKU列表的数据
      loading:true,
  };
  },
  methods: {
    //三级联动的自定义事件 把子的id传给父
    getCategoryId({categoryId,level}) {
      //categoryId 获取123级分类的id level 区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类的id有了
        this.category3Id = categoryId;
        //发请求获取品牌属性
        this.getSpuList();
      }
    },
    //获取Spu列表数据的方法
    async getSpuList(){
      const {page,limit,category3Id} = this;
      //带三个参数：page 第几页 limit 每一页多少条数据 三级分类id
      let result =  await this.$API.spu.reqSpuList(page,limit,category3Id);
      // console.log(result);
      if(result.code==200){
        this.total = result.data.total;
        this.records = result.data.records;
      }
      
    },
    //点击分页器的回调
    currentChange(page){
      this.page = page;
      this.getSpuList();
    },
    //当分页器一页展示几个的回调
    sizeChange(a){
      //修改参数 再发请求
      this.limit = a;
      this.getSpuList();
    },
    //添加SPU按钮的回调
    addSpu(){
      this.scene = 1;
      //通知子组件SpuForm组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个Spu
    updateSpu(row){
      this.scene = 1;
      //获取子组件SpuForm
      //在父组件当中可以通过$ref获取子组件等等
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调(SpuForm)
    changeScene({scene,flag}){
      //flag这个形参为了区分保存按钮是添加还是修改
      if(flag=='修改'){
        this.getSpuList(this.page);
      }else{
        this.getSpuList();
      }
      //取消按钮切换场景
      this.scene=scene;
    },
    //删除SPU按钮的回调
    async deleteSpu(row){
      // console.log(row);
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if(result.code==200){
        this.$message({type:'success',message:"删除成功"});
        //SPU数据个数大于1删除的时候留在当前页 小于1去上一页
        this.getSpuList(this.records.length>1?this.page:this.page-1);
      }
    },
    //添加Sku按钮的回调
    addSku(row){
      //切换场景为2
      this.scene = 2;
      //父组件调用子组件的方法,让子组件发请求---三个请求
      this.$refs.sku.getData(this.category1Id,this.category2Id,row);
    },
    //skuform通知父组件修改场景
    changeScene(scene){
      this.scene = scene;
      //清除数据
      Object.assign(this._data,this.$options.data());
    },
    //查看sku的按钮的回调
    async handler(spu){
      this.dialogTableVisible = true;
      this.spu = spu;
      let result = await this.$API.spu.reqSkuList(spu.id);
      // console.log(result);
      if(result.code==200){
        this.skuList = result.data;
        this.loading = false;
      }
      
    },
    //关闭对话框的回调
    close(done){
      //loading属性再次变为真
      this.loading = true;
      //清楚sku列表的数据
      this.skuList = [];
      //管理关闭对话框
      done();
    },
  },
  components:{
    SpuForm,
    SkuForm,
  }
};
</script>

<style>
</style>