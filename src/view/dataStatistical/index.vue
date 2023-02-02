<template>
  <div class="page">
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchCriteria">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchCriteria.timeValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束" />
        </el-form-item>
        <el-form-item label="场所名称">
          <el-input
            v-model="searchCriteria.zoneName"
            placeholder="请输入场所名称" />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            icon="search"
            :disabled="disabled"
            @click="selectFunc">
            查询
          </el-button>
          <el-button
            size="small"
            icon="refresh"
            :disabled="disabled"
            @click="resetFunc">
            重置
          </el-button>
          <el-button icon="download" size="small" @click="exportFunc"
            >导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="locatName">当前定位区域：{{ deptName }}</div>
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="tree">
          <!-- 网格树形组件 -->
          <DeptTree :on-change="handleDeptChange" class="treeModel" />
        </div>
      </el-col>
      <el-col v-loading="loading" :span="20">
        <div class="topTable">
          <div class="healthCode">
            <div class="topic">
              <img src="@/assets/健康码.png" width="16" alt="" />
              健康码
            </div>
            <DataTable :table-data="healthCode" :cols="healthHead"></DataTable>
          </div>
          <div class="manageMeasure">
            <div class="topic">
              <img src="@/assets/健康码.png" width="16" alt="" />
              管控措施
            </div>
            <DataTable
              :table-data="manageMeasure"
              :cols="manageHead"></DataTable>
          </div>
        </div>
        <div class="midTable">
          <div class="dangerPerson">
            <div class="topic">
              <img src="@/assets/危险.png" width="17" height="16" alt="" />
              风险人员
            </div>
            <DataTable
              :table-data="dangerPerson"
              :cols="dangerHead"></DataTable>
          </div>
          <div class="returnXin">
            <div class="topic">
              <img src="@/assets/返回.png" width="14" height="12" alt="" />
              返新人员
            </div>
            <DataTable :table-data="returnXin" :cols="returnHead"></DataTable>
          </div>
        </div>
        <div class="bottomTable">
          <div class="zoneCode">
            <div class="topic">
              <img src="@/assets/场所.png" width="19" alt="" />
              场所码
            </div>
            <DataTable :table-data="zoneCode" :cols="zoneHead"></DataTable>
          </div>
          <div class="codeRecord">
            <div class="topic">
              <img src="@/assets/场所.png" width="19" alt="" />
              场所码扫码记录
            </div>
            <DataTable :table-data="zoneRecord" :cols="recordHead"></DataTable>
          </div>
          <div class="pagination">
            <el-pagination
              background
              :current-page="page.current"
              :page-size="page.size"
              :page-sizes="[5, 10, 30, 50, 100]"
              :total="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="currentChange"
              @size-change="sizeChange" />
          </div>
        </div>

        <div class="bottomTable">
          <div class="zoneCode">
            <div class="topic">
              <img src="@/assets/场所.png" width="19" alt="" />
              区县认领率统计
            </div>
            <DataTable :table-data="claimRecord" :cols="claimHead"></DataTable>
          </div>
          <div class="codeRecord">
            <div class="topic">
              <img src="@/assets/场所.png" width="19" alt="" />
              网格统计
            </div>
            <DataTable :table-data="gridRecord" :cols="gridHead"></DataTable>
          </div>
          <div class="pagination">
            <el-pagination
              background
              :current-page="page.current"
              :page-size="page.size"
              :page-sizes="[5, 10, 30, 50, 100]"
              :total="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="currentChange"
              @size-change="sizeChange" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
export default {
  name: 'DataStatistical',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import DataTable from './dataTable.vue';
import DeptTree from '@/components/deptTree/index.vue';
import { TreeType } from '@/components/deptTree/types';
import {
  getDataStaticstics,
  getSceneCode,
  getCode,
  exportExcel,
  claimRate,
} from '@/api/dataStatistics';
import { getDeptById } from '@/api/dept';
import { getUserInfo } from '@/api/user';

const loading = ref(false);
const disabled = ref(false);
interface sceneCode {
  scene_name: string;
  scene_type: number;
  scan_count: number;
  scene_type_name: string;
}
interface zoneType {
  code: number;
  name: string;
}
// 搜索条件
type searchCriteriaType = {
  timeValue?: [Date, Date];
  zoneName?: string;
};
const searchCriteria = ref<searchCriteriaType>({});

const health_code = ref([] as number[]);
const healthCode = computed(() => [
  {
    redYellow: health_code.value[0],
    overdue: health_code.value[1],
    unHanout: health_code.value[2],
    handout: health_code.value[3],
    decode: health_code.value[4] + '%',
  },
]);
const healthHead = ref([
  { label: '红黄码量', prop: 'redYellow' },
  { label: '超期数量', prop: 'overdue' },
  { label: '未派发量', prop: 'unHanout' },
  { label: '已派发量', prop: 'handout' },
  { label: '解码比率', prop: 'decode' },
]);

//管控措施表格
const control_measure = ref([] as number[]);
const manageMeasure = computed(() => [
  {
    focus: control_measure.value[0],
    home: control_measure.value[1],
    test: control_measure.value[2],
    unControl: control_measure.value[3],
    relieve: control_measure.value[4] + '%',
  },
]);
const manageHead = ref([
  { label: '集中隔离', prop: 'focus' },
  { label: '居家隔离', prop: 'home' },
  { label: '居家检测', prop: 'test' },
  { label: '失控人员', prop: 'unControl' },
  { label: '解除隔离', prop: 'relieve' },
]);
//风险人员表格
const risk_personnel = ref([] as number[]);
const dangerPerson = computed(() => [
  {
    riskPerson: risk_personnel.value[0],
    codePerson: risk_personnel.value[1],
    unHanout: risk_personnel.value[2],
    handout: risk_personnel.value[3],
    handoutPercent: risk_personnel.value[4] + '%',
  },
]);
const dangerHead = ref([
  { label: '风险人员', prop: 'riskPerson' },
  { label: '赋码人员', prop: 'codePerson' },
  { label: '未派发量', prop: 'unHanout' },
  { label: '已派发量', prop: 'handout' },
  { label: '派发比率', prop: 'handoutPercent' },
]);
// 返新人员表格
const back_personnel = ref([] as number[]);
const returnXin = computed(() => [
  {
    return: back_personnel.value[0],
    unHanout: back_personnel.value[1],
    handout: back_personnel.value[2],
    handoutPercent: back_personnel.value[3] + '%',
  },
]);
const returnHead = ref([
  { label: '返新人员', prop: 'return' },
  { label: '未派发量', prop: 'unHanout' },
  { label: '已派发量', prop: 'handout' },
  { label: '派发比率', prop: 'handoutPercent' },
]);
// 场所码表格
const scene_code = ref([] as number[]);
const zoneCode = computed(() => [
  {
    sceneCode: scene_code.value[0],
    scanNumber: scene_code.value[1],
    handout: scene_code.value[2],
    handoutPercent: scene_code.value[3] + '%',
  },
]);
const zoneHead = ref([
  { label: '场所码量', prop: 'sceneCode' },
  { label: '已扫码量', prop: 'scanNumber' },
  { label: '已派发量', prop: 'handout' },
  { label: '派发比率', prop: 'handoutPercent' },
]);

//场所码扫码记录
const zoneRecord = ref();
const recordHead = ref([
  { label: '场所码名称', prop: 'scene_name' },
  { label: '场所类型', prop: 'scene_type_name' },
  { label: '扫码次数', prop: 'scan_count' },
]);

//区县认领率统计
const claimRecord = ref();
const claimHead = ref([
  { label: '县市区名称', prop: 'dept_name' },
  { label: '红黄码认领率', prop: 'health_code' },
  { label: '场所码认领率', prop: 'scene_code' },
  { label: '报备人员认领率', prop: 'back_personnel' },
  { label: '总分', prop: 'total' },
]);

//网格统计
const gridRecord = ref();
const gridHead = ref([
  { label: '归属县/区', prop: 'scene_name' },
  { label: '归属乡镇/街道', prop: 'scene_type_name' },
  { label: '网格名称', prop: 'scan_count' },
  { label: '红黄码失控率', prop: 'scan_count' },
  { label: '健康码解码率', prop: 'total' },
  { label: '场所码使用率', prop: 'total' },
  { label: '报备人员核酸率', prop: 'total' },
  { label: '总分', prop: 'total' },
]);

/**********************
 *初始化
 ***********************/
const deptName = ref(''); //初始化时的地区名称
onMounted(() => {
  getUserInfo().then(res => {
    deptName.value = res.data.userInfo.dept.deptName;
  });
  loading.value = true;
  const obj = {
    dept_id: 0,
    time_frame: JSON.parse(JSON.stringify(searchCriteria.value)).timeValue,
  };

  // 获取上面五个表格的数据
  getDataStaticstics(obj).then(res => {
    health_code.value = res.data.health_code;
    control_measure.value = res.data.control_measure;
    risk_personnel.value = res.data.risk_personnel;
    back_personnel.value = res.data.back_personnel;
    scene_code.value = res.data.scene_code;
    if (res.code === 0) {
      loading.value = false;
    }
  });
  const obj1 = {
    dept_id: 0,
    page: 1,
    pageSize: 10,
    scene_name: '',
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
    });
  });

  // claimRate().then(res => {
  //   claimRecord.value = res.data;
  // });
});

/**********************
 *查询功能
 ***********************/
function selectFunc() {
  loading.value = true;
  disabled.value = true;
  const obj = {
    dept_id: deptSelected.value,
    time_frame: JSON.parse(JSON.stringify(searchCriteria.value)).timeValue,
  };
  // 获取上面五个表格的数据
  getDataStaticstics(obj).then(res => {
    health_code.value = res.data.health_code;
    control_measure.value = res.data.control_measure;
    risk_personnel.value = res.data.risk_personnel;
    back_personnel.value = res.data.back_personnel;
    scene_code.value = res.data.scene_code;
    if (res.code === 0) {
      loading.value = false;
      disabled.value = false;
    }
  });
  const obj1 = {
    dept_id: deptSelected.value,
    page: 1,
    pageSize: page.value.size,
    scene_name: JSON.parse(JSON.stringify(searchCriteria.value)).zoneName,
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
    });
  });
}

/**********************
 *重置功能
 ***********************/
function resetFunc() {
  loading.value = true;
  disabled.value = true;
  const obj = {
    dept_id: 0,
  };
  getDataStaticstics(obj).then(res => {
    health_code.value = res.data.health_code;
    control_measure.value = res.data.control_measure;
    risk_personnel.value = res.data.risk_personnel;
    back_personnel.value = res.data.back_personnel;
    scene_code.value = res.data.scene_code;
    if (res.code === 0) {
      loading.value = false;
      disabled.value = false;
    }
  });
  const obj1 = {
    dept_id: 0,
    page: 1,
    pageSize: page.value.size,
    scene_name: '',
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
    });
  });
  searchCriteria.value = {};
  deptSelected.value = 0;
}

/**********************
 *点击树形组件搜索功能
 ***********************/
const deptSelected = ref(0);
const handleDeptChange = (dept: TreeType) => {
  deptSelected.value = dept.id;
  deptName.value = dept.label; //点击树形结构改变部门名
  loading.value = true;
  const obj = {
    dept_id: deptSelected.value,
    time_frame: JSON.parse(JSON.stringify(searchCriteria.value)).timeValue,
  };
  // 获取上面五个表格的数据
  getDataStaticstics(obj).then(res => {
    health_code.value = res.data.health_code;
    control_measure.value = res.data.control_measure;
    risk_personnel.value = res.data.risk_personnel;
    back_personnel.value = res.data.back_personnel;
    scene_code.value = res.data.scene_code;
    if (res.code === 0) {
      loading.value = false;
    }
  });
  const obj1 = {
    dept_id: deptSelected.value,
    page: 1,
    pageSize: page.value.size,
    scene_name: JSON.parse(JSON.stringify(searchCriteria.value)).zoneName,
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      console.log(resu);
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
    });
  });
};

/**********************
 *场所码分页数据改变列表
 ***********************/
const page = ref({
  current: 1,
  size: 5,
  total: 0,
});
// 改变页码
const currentChange = (val: number) => {
  page.value.current = val;
  loading.value = true;
  const obj1 = {
    dept_id: deptSelected.value,
    page: page.value.current,
    pageSize: page.value.size,
    scene_name: JSON.parse(JSON.stringify(searchCriteria.value)).zoneName,
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
      loading.value = false;
    });
  });
};
// 改变页数大小
const sizeChange = (val: number) => {
  page.value.size = val;
  loading.value = true;
  const obj1 = {
    dept_id: deptSelected.value,
    page: page.value.current,
    pageSize: page.value.size,
    scene_name: JSON.parse(JSON.stringify(searchCriteria.value)).zoneName,
  };
  // 获取下面表格的数据
  getCode().then(res => {
    getSceneCode(obj1).then(resu => {
      let i: sceneCode;
      for (i of resu.data.SceneCodeData) {
        let j: zoneType;
        for (j of res.data) {
          if (i.scene_type === j.code) {
            i.scene_type_name = j.name;
          }
        }
      }
      zoneRecord.value = resu.data.SceneCodeData;
      page.value.total = resu.data.count;
      loading.value = false;
    });
  });
};

/**********************
 *导出功能
 **********************/
const exportFunc = async () => {
  const response = await exportExcel();
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  console.log(blob);
  const downloadElement = document.createElement('a');
  const hrefBlob = window.URL.createObjectURL(blob);
  downloadElement.href = hrefBlob;
  const fileName = decodeURI(
    response.headers['content-disposition']?.split('filename=')[1]
  ).slice(1, -1);
  console.log(fileName);
  downloadElement.download = fileName || '导出表格';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob);
};
</script>
<style lang="scss" scoped>
.page {
  .gva-search-box {
    margin-bottom: 5px;
  }
  .locatName {
    background-color: #ffffff;
    margin-bottom: -5px;
    padding: 8px;
    text-align: center;
  }
  .tree {
    background-color: #ffffff;
    .treeModel {
      padding: 0px;
    }
  }
  .topTable {
    height: 126px;
    background-color: #ffffff;
    display: flex;
    margin-bottom: 11px;
    padding-left: 17px;
    padding-right: 17px;
    padding-bottom: 13px;
    border-radius: 2px;
    .healthCode {
      width: 49%;
      margin-right: 17px;
      color: #424242;
      font-size: 16px;
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }
    .manageMeasure {
      width: 47%;
      margin-left: 15px;
      color: #424242;
      font-size: 16px;
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }
  }
  .midTable {
    height: 126px;
    display: flex;
    background-color: #ffffff;
    padding-left: 17px;
    padding-right: 17px;
    padding-bottom: 13px;
    border-radius: 2px;
    .dangerPerson {
      color: #424242;
      font-size: 16px;
      width: 49%;
      margin-right: 17px;
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }

    .returnXin {
      width: 47%;
      color: #424242;
      font-size: 16px;
      margin-left: 16px;
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }
  }
  .bottomTable {
    background-color: #ffffff;
    padding-left: 17px;
    padding-right: 17px;
    padding-bottom: 13px;
    border-radius: 2px;
    .zoneCode {
      margin-top: 11px;
      margin-bottom: 11px;
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }
    .codeRecord {
      .topic {
        display: flex;
        padding-top: 14px;
        padding-bottom: 11px;
        img {
          margin-right: 5px;
        }
      }
    }
    .pagination {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
