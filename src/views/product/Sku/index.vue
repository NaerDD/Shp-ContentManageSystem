<template>
  <div>
    <!-- 表格 -->
    <el-table border stripe :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName"  label="名称" width="90"></el-table-column>
      <el-table-column prop="skuDesc"  label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight"   label="重量" width="width"></el-table-column>
      <el-table-column prop="price"   label="价格" width="width"></el-table-column>
      <el-table-column prop="prop"   label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale==1" @click="down(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="up(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getSkulist"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total">
      >
    </el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :before-close="handleClose"> 
      <span>我来啦!</span>
    </el-drawer>
    
  </div>
</template>

<script>
export default {
  name:'',
  data(){
    return{
      page:1,//当前第几页
      limit:10,//代表当前页面有几条数据
      records:[],//存储SKU列表的数据
      total:0,//存储分页器一共展示的数据
      skuInfo:{},//存储SKU信息
      show:false,
    }
  },
  //组件挂载完毕
  mounted(){
    //获取sku列表的方法
    this.getSkulist();
  },
  methods:{
    //获取sku列表数据的方法
    async getSkulist(pages = 1){
      this.page = pages;
      //解构出默认的参数
      const {page,limit} = this;
      let result = await this.$API.sku.reqSkuList(page,limit);
      console.log(result);
      if(result.code==200){
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    //每条展示数据发生变化的回调
    sizeChange(limit){
      //修改参数
      this.limit = limit;
      this.getSkulist();
    },
    //下架
    async down(row){
      let result = await this.$API.sku.reqCancel(row.id)
      if(result.code==200){
        this.$message({type:'success',message:'下架成功'});
      }
    },
    //上架
    async up(row){
      let result = await this.$API.sku.reqSale(row.id)
      if(result.code==200){
        row.isSale = 0;
        this.$message({type:'success',message:'上架成功'});
      }
    },
    //编辑
    edit(){
      this.$message('正在开发中');
    },
    //查看详情
    async getSkuInfo(sku){
      let result = await this.$API.sku.reqSkuById(sku.id);
      // console.log(result);
      if(result.code==200){
        this.skuInfo=result.data;
      }
    }
}
}
</script>

<style>

</style>