import request from '@/utils/request'
//获取SPU列表数据的接口
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}});

//获取Spu信息
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

//获取品牌的信息
export const reqTradeMarkList = ()=>request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'});

//获取SPU图标的接口
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});

//获取平台全部销售属性----一共三个
export const reqBaseSaleAttrList = ()=>request({url:`/admin/product/baseSaleAttrList`,method:'get'});


