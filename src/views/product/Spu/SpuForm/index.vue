<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>

      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>

      <el-form-item label="SPU图片">
        <!-- 
          file-list:照片墙需要展示的数据[数组:数组里面的元素务必要有name/url属性]
          on-preview 图片预览功能
          on-remove 删除图片时候触发

         -->
        <el-upload
          action="/dev-api/admin/product/fileUpload/"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdandAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect,index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdandAttrName" @click="addSaleName">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column
            prop="prop"
            label="属性值名称列表"
            width="width"
          >
          <!-- @close="handleClose(tag)" -->
             <template slot-scope="{row,$index}">
              <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)" closable>
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- 前面的span与input切换 -->
              <!-- 
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
               -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small">
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //平台id
        tmId: 0,
        //spu图片信息
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          },
        ],
        //spu名称
        spuName: "",
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: "string",
          // spuId: 0,
          // spuSaleAttrValueList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     isChecked: "string",
          //     saleAttrName: "string",
          //     saleAttrValueName: "string",
          //     spuId: 0,
          //   },
          // ],
          // },
        ],
      },
      tradeMarkList: [], //存储的是品牌的信息
      spuImageList: [], //存储SPU图片的数据
      saleAttrList: [], //销售属性的数据(项目全部的销售属性)
      attrIdandAttrName:'',//收集未选择的销售属性的ID
    };
  },
  methods: {
    //删除图片的回调
    handleRemove(file, fileList) {
      //file 代表的是删除的那张图片
      //fileList 代表删除后的剩余其他图片
      //收集照片墙图片的数据
      //对于已有的图片[墙上显示的 有name/url字段的] 因为照片墙显示必须要这两个属性
      //对于服务器而言 不需要name/url字段,讲来对于有的图片的数据在提交给服务器的时候,需要处理
      this.spuImageList = fileList;
      
    },
    //图片预览功能回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //初始化SpuForm数据
    async initSpuData(spu) {
      //获取SPU信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      let TradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (TradeMarkResult.code == 200) {
        this.tradeMarkList = TradeMarkResult.data;
      }
      //获取SPU图片的数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组,数组里面的元素需要有name和url字段
        //需要把服务器返回的数据修改
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        //把整理好的数据给spuImageList
        this.spuImageList = listArr;
      }
      //获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //照片墙上传成功回调
    handlerSuccess(response, file, fileList){
      //file 上传的图
      //fileList 上传后的照片墙
      this.spuImageList = fileList;
    },
    //添加新的销售属性
    addSaleName(){
      //已经收集到新的销售属性
      //把收集到的销售属性进行分割
      const [baseSaleAttrId,saleAttrName] = this.attrIdandAttrName.split(':');
      //向spuSaleAttrList添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]};
      //添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
    }
  },
  computed:{
    //计算出还未选择的销售属性
    unSelectSaleAttr(){
      //整个平台的销售属性一共三个 颜色 尺寸 版本
      let result =  this.saleAttrList.filter(item=>{
        //every数组的方法 会返回一个布尔值[真假]
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name!=item1.saleAttrName
        })
      })
      return result;
    }
  },

};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>