<template>
  <div class="addRiskDialog">
    <el-dialog
      v-model="addRiskVisible"
      title="新增风险人员"
      @close="handleClose">
      <el-form
        ref="addform"
        :rules="rules"
        :model="addRiskForm"
        label-width="120px"
        label-position="right">
        <el-row :gutter="30">
          <el-col :span="12"
            ><el-form-item label="姓名" prop="name"
              ><el-input
                v-model="addRiskForm.name"
                autocomplete="off"
                maxlength="10"
                show-word-limit
                placeholder="请输入姓名"></el-input></el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="身份证号" prop="id_card_num"
              ><el-input
                v-model="addRiskForm.id_card_num"
                maxlength="18"
                show-word-limit
                placeholder="请输入身份证号码"></el-input></el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="手机号" prop="phone"
              ><el-input
                v-model="addRiskForm.phone"
                maxlength="11"
                show-word-limit
                placeholder="请输入手机号码"></el-input></el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="反新时间" prop="departure_time"
              ><el-date-picker
                v-model="addRiskForm.departure_time"
                style="width: 100%"
                placeholder="请填写反新时间"></el-date-picker></el-form-item
          ></el-col>
          <el-col :span="12"
            ><el-form-item label="健康码色" prop="code_color"
              ><el-select
                v-model="addRiskForm.code_color"
                placeholder="请选择健康码状态"
                style="width: 100%">
                <el-option label="绿码" value="1"></el-option>
                <el-option label="黄码" value="2"></el-option>
                <el-option
                  label="红码"
                  value="3"></el-option> </el-select></el-form-item
          ></el-col>
        </el-row>
        <!---------------- 出发地 --------------------->

        <el-form-item label="出发地" prop="depart_prov_code">
          <!-- <el-row :gutter="20"> -->
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.depart_prov_code"
              placeholder="请选择省"
              @change="handlerCity">
              <el-option
                v-for="(c1, index) in provList"
                :key="index"
                :label="c1.name"
                :value="c1.code"></el-option> </el-select
          ></el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.depart_city_code"
              placeholder="请选择市"
              @change="handleArea">
              <el-option
                v-for="(c2, index) in cityList"
                :key="index"
                :label="c2.name"
                :value="c2.code"></el-option></el-select
          ></el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.depart_area_code"
              placeholder="请选择县"
              @change="handleCounty">
              <el-option
                v-for="(c3, index) in areaList"
                :key="index"
                :label="c3.name"
                :value="c3.code"></el-option> </el-select
          ></el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.depart_county_code"
              placeholder="请选择乡"
              @change="handleOrg">
              <el-option
                v-for="(c4, index) in countyList"
                :key="index"
                :label="c4.name"
                :value="c4.code"></el-option> </el-select
          ></el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.depart_org_code"
              placeholder="请选择村/区">
              <el-option
                v-for="(c5, index) in orgList"
                :key="index"
                :label="c5.name"
                :value="c5.code"></el-option> </el-select
          ></el-col>
          <!-- </el-row> -->
        </el-form-item>
        <el-form-item label="出发地详细地址" prop="depart_detail_address"
          ><el-input
            v-model="addRiskForm.depart_detail_address"
            placeholder="请输入详细地址"
            maxlength="50"
            show-word-limit />
        </el-form-item>

        <!-- ------------ 目的地 -------------------->

        <el-form-item label="目的地" prop="dest_city_code">
          <!-- <el-row :gutter="20"> -->
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.dest_city_code"
              placeholder="请选择市"
              @change="destArea">
              <el-option
                v-for="(c2, index) in destcityList"
                :key="index"
                :label="c2.name"
                :value="c2.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.dest_area_code"
              placeholder="请选择县"
              @change="destCounty">
              <el-option
                v-for="(c3, index) in destareaList"
                :key="index"
                :label="c3.name"
                :value="c3.code"></el-option>
            </el-select>
          </el-col>

          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.dest_county_code"
              placeholder="请选择乡"
              @change="destOrg">
              <el-option
                v-for="(c4, index) in destcountyList"
                :key="index"
                :label="c4.name"
                :value="c4.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="smallSpan">
            <el-select
              v-model="addRiskForm.dest_org_code"
              placeholder="请选择村/区">
              <el-option
                v-for="(c5, index) in destorgList"
                :key="index"
                :label="c5.name"
                :value="c5.code"></el-option>
            </el-select>
          </el-col>
          <!-- </el-row> -->
        </el-form-item>
        <el-form-item label="目的地详细地址" prop="dest_detail_address"
          ><el-input
            v-model="addRiskForm.dest_detail_address"
            autocomplete="off"
            placeholder="请输入详细地址"
            maxlength="50"
            show-word-limit
        /></el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="consoleBtn()">取消</el-button>
          <el-button type="primary" @click="enterEditBtn()">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
export default { name: 'AddRiskDialog' };
</script>
<script setup lang="ts">
import { ref, toRefs, onMounted, inject } from 'vue';
import { getChannel } from '@/api/backPerson';
import { addriskPersonnel } from '@/api/riskPersonnel';
import { ElMessage } from 'element-plus';
const alias = inject('reload');

const props = defineProps<{
  addRiskVisible: boolean;
}>();
const { addRiskVisible } = toRefs(props);
const emit = defineEmits(['changeVisible']);

//校验规则
const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  id_card_num: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern:
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号码',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
  code_color: [
    { required: true, message: '请选择健康码状态', trigger: 'blur' },
  ],
  departure_time: [
    { required: true, message: '请填写返乡时间', trigger: 'blur' },
  ],
  depart_detail_address: [
    { required: true, message: '请输入出发地详细地址', trigger: 'blur' },
  ],
  dest_detail_address: [
    { required: true, message: '请输入目的地详细地址', trigger: 'blur' },
  ],
  depart_prov_code: [
    { required: true, message: '请选择出发地级', trigger: 'blur' },
  ],
  dest_city_code: [
    { required: true, message: '请选择目的地级', trigger: 'blur' },
  ],
});

/**
 * 表单类型
 */
type AddRiskFormType = {
  // 健康码颜色
  code_color: string;
  // 出发地省
  depart_prov_code: string;
  // 地/市
  depart_city_code: string;
  // 县区
  depart_area_code: string;
  // 乡镇
  depart_county_code: string;
  // 村/社区
  depart_org_code: string;
  // 详细地址
  depart_detail_address: string;
  // 返乡时间
  departure_time: string;
  // 部门ID
  dept_id?: number;
  // 目的地地/市
  dest_city_code: string;
  // 县区
  dest_area_code: string;
  // 乡镇
  dest_county_code: string;
  // 村、社区
  dest_org_code: string;
  // 详细地址
  dest_detail_address: string;
  // 身份证号
  id_card_num: string;
  name: string;
  phone: string;
};
const defaultRiskForm = {
  code_color: '',
  depart_prov_code: '',
  depart_city_code: '',
  depart_area_code: '',
  depart_county_code: '',
  depart_org_code: '',
  depart_detail_address: '',
  departure_time: '',
  dest_city_code: '',
  dest_area_code: '',
  dest_county_code: '',
  dest_org_code: '',
  dest_detail_address: '',
  id_card_num: '',
  name: '',
  phone: '',
};
const addRiskForm = ref<AddRiskFormType>(defaultRiskForm);

type List = {
  name: string;
  code: number;
};
const provList = ref<List[]>([]);
const cityList = ref<List[]>([]);
const areaList = ref<List[]>([]);
const countyList = ref<List[]>([]);
const orgList = ref<List[]>([]);
const destcityList = ref<List[]>([]);
const destareaList = ref<List[]>([]);
const destcountyList = ref<List[]>([]);
const destorgList = ref<List[]>([]);
// 页面加载时获取出发地省级数据
const changePlace = ref<string>();
onMounted(async () => {
  const response = await getChannel({ parent_code: '156000000000' });
  provList.value = response.data;
  // 获取目的地的初始数据
  const list = await getChannel({ parent_code: '410000000000' });
  destcityList.value = list.data;
});

// 改变出发地市级数据
const handlerCity = async () => {
  addRiskForm.value.depart_city_code = '';
  addRiskForm.value.depart_area_code = '';
  addRiskForm.value.depart_county_code = '';
  addRiskForm.value.depart_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.depart_prov_code}`,
  });
  cityList.value = response.data;
};
// 改变出发地县级数据
const handleArea = async () => {
  addRiskForm.value.depart_area_code = '';
  addRiskForm.value.depart_county_code = '';
  addRiskForm.value.depart_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.depart_city_code}`,
  });
  areaList.value = response.data;
};
// 改变出发地镇/乡级数据
const handleCounty = async () => {
  addRiskForm.value.depart_county_code = '';
  addRiskForm.value.depart_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.depart_area_code}`,
  });
  countyList.value = response.data;
};
// 改变出发地村、社区级数据
const handleOrg = async () => {
  addRiskForm.value.depart_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.depart_county_code}`,
  });
  orgList.value = response.data;
};

/*
 * *********************目的地***************************
 */
// 改变目的地县级数据
const destArea = async () => {
  addRiskForm.value.dest_area_code = '';
  addRiskForm.value.dest_county_code = '';
  addRiskForm.value.dest_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.dest_city_code}`,
  });
  destareaList.value = response.data;
};
// 改变目的地镇/乡级数据
const destCounty = async () => {
  addRiskForm.value.dest_county_code = '';
  addRiskForm.value.dest_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.dest_area_code}`,
  });
  destcountyList.value = response.data;
};
// 改变目的地村、社区级数据
const destOrg = async () => {
  addRiskForm.value.dest_org_code = '';
  const response = await getChannel({
    parent_code: `${addRiskForm.value.dest_county_code}`,
  });
  destorgList.value = response.data;
};

// 表单初始化
const addform = ref();
const resetAddRiskForm = async () => {
  if (addform.value) {
    addform.value.resetFields();
  }
  addRiskForm.value = defaultRiskForm;
};

// 取消提交
const consoleBtn = () => {
  resetAddRiskForm();
  emit('changeVisible', false);
};
// 确定提交;
const enterEditBtn = () => {
  // 进行表单验证
  addform.value.validate(async (valid: AddRiskFormType) => {
    if (valid) {
      emit('changeVisible', false);
      const response = await addriskPersonnel({
        // dept_id: userInfo.dept.ID,
        code_color: parseInt(addRiskForm.value.code_color),
        depart_prov_code: addRiskForm.value.depart_prov_code,
        depart_city_code: addRiskForm.value.depart_city_code,
        depart_area_code: addRiskForm.value.depart_area_code,
        depart_county_code: addRiskForm.value.depart_county_code,
        depart_org_code: addRiskForm.value.dest_org_code,
        depart_detail_address: addRiskForm.value.depart_detail_address,
        departure_time: Date.parse(addRiskForm.value.departure_time) / 1000,
        dest_city_code: addRiskForm.value.dest_city_code,
        dest_area_code: addRiskForm.value.dest_area_code,
        dest_county_code: addRiskForm.value.dest_county_code,
        dest_org_code: addRiskForm.value.dest_org_code,
        dest_detail_address: addRiskForm.value.dest_detail_address,
        id_card_num: addRiskForm.value.id_card_num,
        name: addRiskForm.value.name,
        phone: addRiskForm.value.phone,
      });
      if (response.code === 0) {
        ElMessage({
          type: 'success',
          message: '新增成功',
        });
        alias();
      } else {
        ElMessage({
          type: 'warning',
          message: '新增失败',
        });
      }
      resetAddRiskForm();
    }
  });
};

// 点击叉号时的事件
const handleClose = () => {
  emit('changeVisible', false);
  resetAddRiskForm();
};
</script>
<style lang="scss" scoped>
.addRiskDialog {
  .chufa {
    display: flex;
  }
  .smallSpan {
    margin-right: 20px;
  }
}
</style>
