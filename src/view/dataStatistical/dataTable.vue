<template>
  <el-table
    :data="tableData"
    font-size="14px"
    :row-style="{ height: '35px' }"
    :header-cell-style="{
      color: '#fff',
      background: '#EBF4FF',
      fontWeight: '700',
      border: ' 0.5px solid #EBF4FF',
      color: '#000000',
      height: '35px',
      padding: '0px 0px 0px 0px',
    }">
    <template v-for="(col, index) in cols" :key="index">
      <el-table-column
        :label="col.label"
        :prop="col.prop"
        display="inline-block"
        min-width="124px">
        <template #default="scope">
          <!-- 插槽判断颜色 -->
          <template v-if="col.prop === 'redYellow'">
            <div class="yellow">{{ scope.row.redYellow }}</div>
          </template>
          <template v-if="col.prop === 'overdue'">
            <div class="red">{{ scope.row.overdue }}</div>
          </template>
          <template v-if="col.prop === 'unHanout'">
            <div class="red">{{ scope.row.unHanout }}</div>
          </template>
          <template v-if="col.prop === 'handout'">
            <div class="green">{{ scope.row.handout }}</div>
          </template>
          <template v-if="col.prop === 'decode'">
            <div class="green">{{ scope.row.decode }}</div>
          </template>
          <template v-if="col.prop === 'focus'">
            <div class="green">{{ scope.row.focus }}</div>
          </template>
          <template v-if="col.prop === 'home'">
            <div class="green">{{ scope.row.home }}</div>
          </template>
          <template v-if="col.prop === 'test'">
            <div class="green">{{ scope.row.test }}</div>
          </template>
          <template v-if="col.prop === 'unControl'">
            <div class="red">{{ scope.row.unControl }}</div>
          </template>
          <template v-if="col.prop === 'relieve'">
            <div class="green">{{ scope.row.relieve }}</div>
          </template>
          <template v-if="col.prop === 'riskPerson'">
            <div class="red">{{ scope.row.riskPerson }}</div>
          </template>
          <template v-if="col.prop === 'codePerson'">
            <div class="yellow">{{ scope.row.codePerson }}</div>
          </template>
          <template v-if="col.prop === 'handoutPercent'">
            <div class="yellow">{{ scope.row.handoutPercent }}</div>
          </template>
          <template v-if="col.prop === 'return'">
            <div class="yellow">{{ scope.row.return }}</div>
          </template>
          <template v-if="col.prop === 'sceneCode'">
            <div class="green">{{ scope.row.sceneCode }}</div>
          </template>
          <template v-if="col.prop === 'scanNumber'">
            <div class="green">{{ scope.row.scanNumber }}</div>
          </template>
          <template v-if="col.prop === 'scan_count'">
            <div class="green">{{ scope.row.scan_count }}</div>
          </template>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>
<script lang="ts">
export default {
  name: 'DataTable',
};
</script>
<script setup lang="ts">
defineProps({
  tableData: {
    type: Object,
    require: true,
    default: function () {
      return [{}];
    },
  },
  cols: {
    type: Object,
    require: true,
    default: function () {
      return [{}];
    },
  },
});
</script>
<style scoped lang="scss">
.red {
  color: #ff5b5b;
}
.green {
  color: #02b66a;
}
.yellow {
  color: #ffca41;
}
</style>
