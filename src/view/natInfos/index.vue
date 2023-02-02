<!-- 核酸信息页面 -->
<template>
  <div class="natInfo">
    <div class="header">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="身份证号码">
          <el-input
            v-model="searchInfo.card_num"
            placeholder="请输入身份证号码"
            class="input" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="search"
            size="small"
            :disabled="disabled"
            @click="onSubmit"
            >查询</el-button
          >
          <el-button icon="refresh" size="small" @click="clearValue"
            >重置</el-button
          >
          <el-button icon="upload" size="small" @click="importFunc"
            >批量核验</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div v-if="tableVisible" class="content">
      <el-table v-loading="loading" border :data="tableData">
        <el-table-column prop="sort" label="序号" width="120" type="index" />
        <el-table-column prop="patient_name" label="姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="upload_time" label="核酸报告时间">
          <template #default="scope">
            {{ UTCFormat(scope.row['upload_time']) }}
          </template>
        </el-table-column>
        <el-table-column prop="census_Address" label="核酸检测机构" />
        <el-table-column prop="state" label="核酸检测结果" />
      </el-table>
    </div>
    <!-- 批量核查 -->
    <import-excel ref="dialogRef"></import-excel>
    <!-- 检查核酸下载进度弹窗 -->
    <el-dialog v-model="processVisible" title="批量核查任务处理进度">
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="downloadProgress"
        status="success" />
      <el-button
        type="primary"
        icon="download"
        size="small"
        class="btn"
        :disabled="downloadDisabled"
        @click="downloadRes"
        >下载</el-button
      ></el-dialog
    >
    <!-- 任务处理完成，现在下载弹窗 -->
    <el-dialog v-model="downloadVisible" title="提示">
      <span>确认是否开始新的批量核查任务?</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="downloadRes">下载最近核查结果</el-button>
          <el-button type="primary" @click="uploadFile"
            >上传新核查文件</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: 'NatInfo' };
</script>
<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import ImportExcel from './importExcel.vue';
import { UTCFormat } from '@/utils/dateFormat';
import {
  idCardNucList,
  checkNuc,
  exportNuc,
  exportNucStatus,
} from '@/api/nacInfo';
type SearchInfoType = {
  card_num: string;
};
const searchInfo = ref<SearchInfoType>({
  card_num: '',
});

type tableType = {
  name: string;
  phone: string;
  upload_time: string;
  census_Address: string;
  state: string;
};

const tableVisible = ref(false);
const loading = ref(true);
const disabled = ref(false);
const tableData = ref<tableType[]>([]);
const onSubmit = async () => {
  loading.value = true;
  const res = await idCardNucList({
    certificate_num: searchInfo.value.card_num,
  });
  // console.log(searchInfo.value.card_num);
  if (res.data) {
    loading.value = false;
    disabled.value = false;
    tableVisible.value = true;
    tableData.value = res.data.AcidRecord;
  } else {
    ElMessage({
      type: 'warning',
      message: '无法查询此人信息！',
    });
  }

  // console.log('查询成功！');
};
const clearValue = () => {
  tableVisible.value = false;
  searchInfo.value.card_num = '';
};

//批量核查
//上传
interface DialogExpose {
  acceptParams: (params: any) => void;
}
const dialogRef = ref<DialogExpose>();
const downloadVisible = ref(false); //下载弹窗
const processVisible = ref(false); //进度条
const downloadProgress = ref(0); //显示下载进度
const downloadDisabled = ref(true); //控制下载按钮是否可用
const importFunc = async () => {
  let params = {
    title: '核查',
  };
  // dialogRef.value?.acceptParams(params);
  //先调接口，判断是否有上传任务
  const res = await exportNucStatus();
  if (res.data.has_task === true) {
    downloadProgress.value = res.data.processing_progress;
    // 进度条弹窗显示
    processVisible.value = true;
    // 任务未处理完成
    if (downloadProgress.value === 100) {
      //任务处理完成，可以下载
      downloadDisabled.value = false;
      // 判断是否已下载
      if (res.data.download_status) {
        // 已下载，确认是否开始新的批量核查任务
        downloadVisible.value = true;
        // 关闭进度条弹窗
        processVisible.value = false;
      }
    }
  } else {
    // 上传弹窗显示;
    dialogRef.value?.acceptParams(params);
  }
};
/**
 * 下载最近核查结果
 */
const downloadRes = () => {
  // console.log('下载最近核查结果');
  handeleFile();
};
/**
 * 上传新核查文件
 */
const uploadFile = () => {
  // 关闭下载弹窗
  downloadVisible.value = false;
  // 打开上传弹窗
  let params = {
    title: '核查',
  };
  dialogRef.value?.acceptParams(params);
  // console.log('上传新核查文件');
};

const handeleFile = async () => {
  // 下载
  const response = await exportNuc({ test: 1 });
  const blob = new Blob([response.data], {
    type: response.headers['content-type'],
  });
  // console.log(blob);
  const downloadElement = document.createElement('a');
  const hrefBlob = window.URL.createObjectURL(blob);
  downloadElement.href = hrefBlob;
  const fileName = decodeURI(
    response.headers['content-disposition']?.split('filename=')[1]
  ).slice(1, -1);
  // console.log(fileName);
  downloadElement.download = fileName || '个人核酸信息报表';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob);
};
</script>
<style lang="scss" scoped>
.natInfo {
  padding: 20px;
  .header {
    background-color: #fff;
    padding: 15px 15px 0 15px;
  }
  .content {
    margin-top: 15px;
    background-color: #fff;
  }
  .btn {
    margin-top: 15px;
  }
}
</style>
