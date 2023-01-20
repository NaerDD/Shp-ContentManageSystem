<template>
  <div>
    <el-form ref="form" label-width="80px">

      <el-form-item label="SPU名称">
        海绵宝宝
      </el-form-item>

      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4"></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="屏幕尺寸">
            <el-select value-key="" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            
          </el-form-item>
          <el-form-item>

          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="屏幕尺寸">
            <el-select value-key="" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            
          </el-form-item>
          <el-form-item>

          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table style="width:100%"  border>
          <el-table-column
            label="label"
            width="80"
            type="selection">
          </el-table-column>
          <el-table-column 
            label="图片"
            width="width">
          </el-table-column>
          <el-table-column 
            label="名称"
            width="width">
          </el-table-column>
          <el-table-column 
            label="操作"
            width="width">
          </el-table-column>
        </el-table>
        
      </el-form-item>

      <el-form-item >
          <el-button type="primary">保存</el-button>
          <el-button >取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name:'',
}
</script>

<style>

</style>