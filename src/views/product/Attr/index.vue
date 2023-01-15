<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId"></CategorySelect>
    </el-card>
    <el-card>

      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>

      <!-- 表格:展示平台属性 -->
      <el-table style="width:100%" border :data="attrList">

        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>

        <el-table-column prop="prop" label="属性值列表" width="width">
          <template slot-scope="{row,$index}">
            <el-tag type="success" v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" style="margin:0px 10px"> {{attrValue.valueName}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{row,$index}">
            <el-button type="warning" size="mini" @click="" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" @click="" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接受平台属性的字段
      attrList: [],
    };
  },
  methods: {
    //自定义事件的回调 子给父传数据
    getCategoryId({ categoryId, level }) {
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
        this.getAttrList();
      }
    },
    //获取平台属性的数据 (当用户确定三级分类的数据时候)
    async getAttrList() {
      //获取分类的ID
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性

  },
};
</script>

<style></style>
