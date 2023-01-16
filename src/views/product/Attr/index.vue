<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 10px"
              >
                {{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" size="mini" @click="updateAttr(row)" icon="el-icon-edit"></el-button>
              <el-button type="danger" size="mini" @click="" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button  @click="isShowTable = true">取消</el-button>

        <el-table style="width: 100%; margin: 10px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" label="序号" width="80" type="index">
          </el-table-column>
          <el-table-column label="属性值名称" width="width" prop="prop">
            <template slot-scope="{row,$index}">

              <!-- 这里结构需要用到span与input进行来回的切换 -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm
                    @onConfirm="deleteAttrValue($index)"
                    confirm-button-text='确定'
                    cancel-button-text='取消'
                    icon="el-icon-info"
                    icon-color="red"
                    :title="`确定删除${row.valueName}吗？`"
                    >
                <el-button type="danger" size="mini" icon="el-icon-delete" slot="reference"></el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button  @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default {

  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接受平台属性的字段
      attrList: [],
      //控制table表格的展示与隐藏
      isShowTable: true,
      //收集新增属性|修改属性使用的
      attrInfo:{
                "attrName": "",       //属性名
                "attrValueList": [],  //属性值 可以有多个所以用数组,每一个属性值都是一个对象需要attrId,valueName
                "categoryId": 0,     //三级分类的id
                "categoryLevel": 3,  //服务器需要区分是几级id
                }
              }
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
    //添加属性值的回调
    addAttrValue(){
      //想属性值的数组里面添加元素
      //attrId 是你相应的属性的id 目前我们是添加属性的操作还没有相应的属性的id 目前带给服务器的id为undefined
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id, //对于修改某一个属性的时候,可以在已有的属性值基础上新增新的属性值(新增属性值的时候,需要把已有的属性的id带上)
        valueName: '',
        flag:true,
        //给每一个属性值添加一个标记flag,用户切换查看模式与编辑模式,好处,每一个属性值可以控制自己的显示隐藏模式切换
      });
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus();
      });
    },
    //添加属性按钮的回调 切换隐藏显示 将上次的数据置空
    addAttr(){
      this.isShowTable = false;
      //清空数据
      this.attrInfo = {
        "attrName": "",                    //属性名
        "attrValueList": [],               //属性值 可以有多个所以用数组,每一个属性值都是一个对象需要attrId,valueName
        "categoryId": this.category3Id,    //三级分类的id
        "categoryLevel": 3,                //服务器需要区分是几级id
      }
    },
    //修改某一个属性
    updateAttr(row){
      //先隐藏页面
      this.isShowTable=false;
      //将选中的属性赋值给attrInfo
      //由于数据结构当中存在对象里面套数组,数组里面套对象,因此需要使用深拷贝解决这类问题
      //深拷贝,浅拷贝在面试的时候出现多 需要手写
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候,将相应的属性值元素添加上flag这个标记
      this.attrInfo.attrValueList.forEach(item=>{
        //这样写也可以给属性值添加flag自动,但是不会点击变化 因为不是响应式数据
        // item.flag=false;
        this.$set(item,'flag',false)

      });

    },
    //气泡确认框---确定按钮的回调----删除某一个属性
    deleteAttrValue(index){
      //最新版本的confirm 改为了onConfirm
      //当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index,1);
    },
    //失去焦点的时间---切换为查看模式,展示span
    toLook(row){
      //row 形参是当前用户添加的最新的属性值
      console.log(row);
      //如果属性值为空不能作为新的属性值,给用户提示,让他输入一个其他的属性值
      if(row.valueName.trim()==''){
        this.$message('请输入一个正常的属性值')
        return;
      }
      //新增的属性值不能与已有的重复
      let isRepat = this.attrInfo.attrValueList.some(item=>{
        //将row去除 row从数组里面去除 row最新新增的属性值 some数组中的最后一项元素
        if(row!=item){
          // 将最后一项的值与前面的对比 如果有相同的字样 返回true  true时不让添加
          return row.valueName==item.valueName
        }
      })
      if(isRepat){
        this.$message('请输入不重复的属性值')
              return;
      }
      //当前的编辑模式变为查看模式[input消失 显示span]
      row.flag = false;
    },
    //点击span的回调,变为编辑模式
    toEdit(row,index){
      row.flag=true;
      //获取input节点,实现自动聚焦
      //点击span时,切换input为编辑模式 需要重绘重拍 不能一点击就马上获取到input
      this.$nextTick(()=>{
              this.$refs[index].focus();
      })
    },
    //保存按钮:进行添加属性或者修改属性
    async addOrUpdateAttr(){
      //整理参数 1空值排除 2不要flag字段 
    this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=>{
        //过滤掉不是空的
        if(item.valueName.trim()!=''){
          //删除掉flag属性
          delete item.flag;
          return true;
        }
      })
      try {
      //发请求
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
      this.isShowTable = true,
      //提示小时

      this.$message({type:'success',message:'保存成功'})
      //保存成功以后需要再次获取平台属性进行展示
      this.getAttrList();
      } catch (error) {
      this.$message('保存失败')
      }
    }
  },
};
</script>

<style>

</style>



