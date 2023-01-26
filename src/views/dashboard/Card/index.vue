<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 第一个Card -->
          <Detail title="总销售额" count="$ 126560">
            <template slot="charts">
                <span>周同比&nbsp;&nbsp;56.67% <svg t="1674713867117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3759" width="16" height="16"><path d="M936.170667 669.952L534.613333 268.394667a32 32 0 0 0-42.986666-2.069334l-2.282667 2.069334L87.829333 669.952a8.533333 8.533333 0 0 0-2.496 6.037333v66.346667a8.533333 8.533333 0 0 0 14.570667 6.058667l412.074667-412.096 412.117333 412.096a8.533333 8.533333 0 0 0 14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 0-2.496-6.058667z" fill="#333333" p-id="3760"></path></svg></span>
                &nbsp;&nbsp;&nbsp;
                <span>日同比&nbsp;&nbsp;19.96% <svg t="1674713913866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4769" width="16" height="16"><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" fill="#666666" p-id="4770"></path></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额$ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第二个Card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <lineCharts></lineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第三个Card -->
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <barCharts></barCharts>
            </template>
            <template slot="footer">
              <span>转化率65%</span>
            </template>
          </Detail>
        </el-card>        
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 第四个Card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <progressCharts></progressCharts>
            </template>
            <template slot="footer">
                <span>周同比&nbsp;&nbsp;12% <svg t="1674713867117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3759" width="16" height="16"><path d="M936.170667 669.952L534.613333 268.394667a32 32 0 0 0-42.986666-2.069334l-2.282667 2.069334L87.829333 669.952a8.533333 8.533333 0 0 0-2.496 6.037333v66.346667a8.533333 8.533333 0 0 0 14.570667 6.058667l412.074667-412.096 412.117333 412.096a8.533333 8.533333 0 0 0 14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 0-2.496-6.058667z" fill="#333333" p-id="3760"></path></svg></span>
                &nbsp;&nbsp;&nbsp;
                <span>日同比&nbsp;&nbsp;11% <svg t="1674713913866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4769" width="16" height="16"><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" fill="#666666" p-id="4770"></path></svg></span>
            </template>
          </Detail>
        </el-card>        
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail';
import barCharts from './barCharts';
import lineCharts from './lineChart';
import progressCharts from './progressCharts';
export default {
  name:'',
  components:{
    Detail,lineCharts,barCharts,progressCharts
  }
}
</script>

<style>

</style>