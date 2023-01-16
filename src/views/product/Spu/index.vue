<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!show"></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0">
      <!-- 这部分有三部分进行切换 -->
      <div>
        <!-- 展示Spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
        <el-table style="width:100%" border="">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里按钮将来用hintButton替换 -->
              <el-buttono type="success" icon="el-icon-plus" size="mini"></el-buttono>
              <el-buttono type="warning" icon="el-icon-edit" size="mini"></el-buttono>
              <el-buttono type="info" icon="el-icon-info" size="mini"></el-buttono>
              <el-buttono type="danger" icon="el-icon-delete" size="mini"></el-buttono>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器
                  @size-change="sizeChange"
          @current-change="currentChange"
         -->
        <el-pagination
          style="text-align:center"
          :current-page="6"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="23">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制三级联动的可操作性
      show:true
    };
  },
  methods: {
    //三级联动的自定义事件 把子的id传给父
    getCategoryId({ categoryId, level }) {
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
    getSpuList(){

    }
  },
};
</script>

<style>
</style>