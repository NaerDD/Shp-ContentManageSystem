<template>
  <div>
    首页
    <Card></Card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import Observe from './Observe'
import Sale from './Sale'
import Card from './Card'
export default {
  name:'',
  components:{
    Card,Sale,Observe
  },
  mounted(){
    this.$store.dispatch('getData');
  }
}
</script>

<style scoped>

</style>
