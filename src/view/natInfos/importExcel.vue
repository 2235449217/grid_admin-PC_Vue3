<template>
  <div class="importExcel">
    <el-dialog
      v-model="dialogVisible"
      :title="`批量${parameter.title}`"
      :destroy-on-close="true"
      width="580px"
      draggable>
      <el-form class="drawer-multiColumn-form" label-width="100px">
        <el-form-item label="模板下载 :">
          <el-button type="primary" icon="download" @click="downloadTemp"
            >点击下载</el-button
          >
        </el-form-item>
        <el-form-item label="文件上传:">
          <el-upload
            action=""
            class="upload-demo"
            drag
            accept=".xlsx, .xls"
            :on-exceed="exceedFile"
            :on-error="handleError"
            :on-success="handleSuccess"
            :http-request="uploadExcel"
            :before-upload="beforeUPload"
            :show-file-list="true"
            :limit="excelLimit">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">请上传 .xls , .xlsx 标准格式文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: 'ImportExcel' };
</script>
<script setup lang="ts">
import { ref } from 'vue';
import { ElNotification } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { checkNuc } from '@/api/nacInfo';
import { importTemplate } from '@/api/healthCode';

export interface ExcelParameterProps {
  title: string; // 标题
}
// 最大文件上传数
const excelLimit = ref(1);
// dialog状态
const dialogVisible = ref(false);
//父组件传过来的参数
const parameter = ref<Partial<ExcelParameterProps>>({});
/**
 * Partial修饰符
 * 作用：声明一个新类型，该类型与T拥有相同的属性，但是所有属性皆为可选项
 */

// 接收父组件参数
const acceptParams = (params?: any): void => {
  parameter.value = params;
  dialogVisible.value = true;
};

// Excel模板下载
const downloadTemp = async () => {
  const response = await importTemplate({ section_type: 2 });
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
  downloadElement.download = fileName || '批量核查模板';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob);
};

// 文件上传
const uploadExcel = async (param: any) => {
  console.log(1111111111111111);
  let fileFormData = new FormData();
  fileFormData.append('file', param.file);
  // 调接口
  const response = checkNuc && (await checkNuc(fileFormData));
  if (response.code !== 0) return param.onError();
  dialogVisible.value = false;
  // 下载
  /** const blob = new Blob([response.data], {
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
  downloadElement.download = fileName || '个人核酸信息报表';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(hrefBlob); **/
};

// 文件上传之前判断
const beforeUPload = (file: any) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isExcel)
    ElNotification({
      title: '温馨提示',
      message: '上传文件只能是 xls / xlsx 格式！',
      type: 'warning',
    });
  if (!isLt2M)
    ElNotification({
      title: '温馨提示',
      message: '上传文件大小不能超过 20MB!',
      type: 'warning',
    });
  return isExcel && isLt2M;
};
// 文件数超出提示
const exceedFile = () => {
  ElNotification({
    title: '温馨提示',
    message: '最多只能上传一个文件！',
    type: 'warning',
  });
};
// 上传错误提示
const handleError = () => {
  ElNotification({
    title: '温馨提示',
    message: '导入数据失败，请您重新上传！',
    type: 'error',
  });
};

//上传成功提示
const handleSuccess = () => {
  ElNotification({
    title: '温馨提示',
    message: '导入数据成功！',
    type: 'success',
  });
};
// 将方法主动暴露出来
defineExpose({
  acceptParams,
});
</script>
<style lang="scss" scoped>
.upload-demo {
  width: 80%;
}
</style>
