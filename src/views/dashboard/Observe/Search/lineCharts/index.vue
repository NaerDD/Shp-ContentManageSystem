<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg t="1674711824214" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2630" width="26" height="26"><path d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z" fill="#2c2c2c" p-id="2631"></path></svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <svg t="1674713867117" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3759" width="16" height="16"><path d="M936.170667 669.952L534.613333 268.394667a32 32 0 0 0-42.986666-2.069334l-2.282667 2.069334L87.829333 669.952a8.533333 8.533333 0 0 0-2.496 6.037333v66.346667a8.533333 8.533333 0 0 0 14.570667 6.058667l412.074667-412.096 412.117333 412.096a8.533333 8.533333 0 0 0 14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 0-2.496-6.058667z" fill="#333333" p-id="3760"></path></svg>
    </div>

    <svg t="1674713913866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4769" width="16" height="16"><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" fill="#666666" p-id="4770"></path></svg>

    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
//引入echarts
import * as echarts from 'echarts';
export default {
  name:"",
    mounted(){
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis:{
        //隐藏x轴
        show:false,
        type:'category'
      },
      yAxis:{
        //隐藏y轴
        show:false
      },
      //系列
      series:[
        {
          //平滑设置
          smooth:true,
          type:'line',
          data:[10,7,33,12,48,9,29,10,44],
          //拐点的样式的设置
          itemStyle:{
            opacity:0
          },
          //线条的演示
          lineStyle:{
            color:'blue',
          },
          //填充颜色设置
          areaStyle:{
            color:{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0, color: 'blue' // 0% 处的颜色
            }, {
                offset: 1, color: '#fff' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
        }
      ],
      //布局的调试
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      }
    })
  }

}
</script>

<style scoped>
.header{
  display: flex;
  align-items: center;

}
.search-header{
  margin-right:5px;
}
.main-title{
  margin-right: 30px;
}
.main{
  margin-top: 10px 0px;
}
.main-content{
  margin-right: 10px;
}
.charts{
  width: 100%;
  height: 50px;
}
</style>