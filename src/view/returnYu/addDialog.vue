<template>
  <el-dialog v-model="visible" title="添加" @open="onOpen" @close="onClose">
    <el-form
      ref="addForm"
      :model="form"
      label-width="100px"
      label-position="right"
      :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="form.name"
              autocomplete="off"
              placeholder="请输入姓名"
              maxlength="10"
              show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号码" prop="personId">
            <el-input
              v-model="form.personId"
              autocomplete="off"
              placeholder="请输入身份证号码"
              maxlength="18"
              show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="手机号码" prop="phone">
            <el-input
              v-model="form.phone"
              autocomplete="off"
              placeholder="请输入手机号码"
              maxlength="11"
              show-word-limit /> </el-form-item
        ></el-col>
        <el-col :span="12"
          ><el-form-item label="管控方式" prop="control_mode">
            <el-select v-model="form.control_mode" placeholder="请选择管控方式">
              <el-option
                v-for="(item, index) in control_list"
                :key="index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
          ><el-form-item label="返回方式" prop="returnMethod">
            <el-select v-model="form.returnMethod" placeholder="请选择返回方式">
              <el-option label="驾车" value="1"></el-option>
              <el-option label="火车" value="2"></el-option>
              <el-option label="飞机" value="3"></el-option>
              <el-option label="其他" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12"
          ><el-form-item label="返乡时间" prop="returnTime">
            <el-date-picker
              v-model="form.returnTime"
              placeholder="请选择返乡时间" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="出发地" prop="cityOptionsValue">
        <!-- <el-row :gutter="20"> -->
        <el-col :span="4">
          <el-select
            v-model="form.proOptionsValue"
            style="margin-right: 20px"
            placeholder="选择省"
            @change="proChange">
            <el-option
              v-for="item in proOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.cityOptionsValue"
            style="margin-right: 20px"
            placeholder="选择市"
            @change="cityChange">
            <el-option
              v-for="item in cityOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.couOptionsValue"
            style="margin-right: 20px"
            placeholder="选择县"
            @change="couChange">
            <el-option
              v-for="item in couOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.vliOptionsValue"
            style="margin-right: 20px"
            placeholder="选择乡"
            @change="vliChange">
            <el-option
              v-for="item in vliOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="form.hamOptionsValue" placeholder="选择村">
            <el-option
              v-for="item in hamOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <!-- </el-row> -->
      </el-form-item>
      <el-form-item label="详细地址" prop="fromAddress"
        ><el-input
          v-model="form.fromAddress"
          autocomplete="off"
          placeholder="请输入详细地址"
          maxlength="50"
          show-word-limit
      /></el-form-item>

      <el-form-item label="目的地" prop="tocityOptionsValue">
        <!-- <el-row :gutter="20"> -->
        <el-col :span="4">
          <el-select
            v-model="form.tocityOptionsValue"
            style="margin-right: 20px"
            placeholder="选择市"
            @change="toCityChange">
            <el-option
              v-for="item in tocityOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.tocouOptionsValue"
            style="margin-right: 20px"
            placeholder="选择县"
            @change="toCouChange">
            <el-option
              v-for="item in tocouOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="form.tovliOptionsValue"
            style="margin-right: 20px"
            placeholder="选择乡"
            @change="toVliChange">
            <el-option
              v-for="item in tovliOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="form.tohamOptionsValue" placeholder="选择村">
            <el-option
              v-for="item in tohamOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code" />
          </el-select>
        </el-col>
        <!-- </el-row> -->
      </el-form-item>
      <el-form-item label="详细地址" prop="toAddress"
        ><el-input
          v-model="form.toAddress"
          autocomplete="off"
          placeholder="请输入详细地址"
          maxlength="50"
          show-word-limit
      /></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch, onMounted } from 'vue';
import { addBackPerson, getChannel, controlModeList } from '@/api/backPerson';
interface Props {
  dialogVisible: boolean;
}
interface State {
  visible: boolean;
}
export default defineComponent({
  name: 'AddDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const { dialogVisible } = toRefs(props as Props);
    const parent = { ...context };
    const state = reactive<State>({
      visible: dialogVisible.value,
    });
    watch(
      dialogVisible,
      newValue => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    const onClose = () => {
      parent.emit('update:dialogVisible', false);
      // 初始化表单
      if (addForm.value) {
        addForm.value.resetFields();
      }
      form.value = {
        name: '',
        personId: '',
        phone: '',
        control_mode: '',
        returnMethod: '',
        returnTime: '',
        proOptionsValue: '',
        cityOptionsValue: '',
        couOptionsValue: '',
        vliOptionsValue: '',
        hamOptionsValue: '',
        tocityOptionsValue: '',
        tocouOptionsValue: '',
        tovliOptionsValue: '',
        tohamOptionsValue: '',
        fromAddress: '',
        toAddress: '',
      };
    };
    const addForm = ref();
    const form = ref({
      name: '',
      personId: '',
      phone: '',
      control_mode: '',
      returnMethod: '',
      returnTime: '',
      proOptionsValue: '',
      cityOptionsValue: '',
      couOptionsValue: '',
      vliOptionsValue: '',
      hamOptionsValue: '',
      tocityOptionsValue: '',
      tocouOptionsValue: '',
      tovliOptionsValue: '',
      tohamOptionsValue: '',
      fromAddress: '',
      toAddress: '',
    });
    interface AddDialog {
      name: string;
      personId: string;
      phone: string;
      control_mode: string;
      returnMethod: string;
      returnTime: string;
      proOptionsValue: string;
      cityOptionsValue: string;
      couOptionsValue: string;
      vliOptionsValue: string;
      hamOptionsValue: string;
      tocityOptionsValue: string;
      tocouOptionsValue: string;
      tovliOptionsValue: string;
      tohamOptionsValue: string;
      fromAddress: string;
      toAddress: string;
    }
    const onConfirm = () => {
      addForm.value.validate(async (valid: AddDialog) => {
        if (valid) {
          let obj = {
            depart_area_code: form.value.couOptionsValue.toString(),
            depart_city_code: form.value.cityOptionsValue.toString(),
            depart_county_code: form.value.vliOptionsValue.toString(),
            depart_detail_address: form.value.fromAddress,
            depart_org_code: form.value.hamOptionsValue.toString(),
            depart_prov_code: form.value.proOptionsValue.toString(),
            dest_area_code: form.value.tocouOptionsValue.toString(),
            dest_county_code: form.value.tovliOptionsValue.toString(),
            dest_detail_address: form.value.toAddress,
            dest_org_code: form.value.tohamOptionsValue.toString(),
            dest_city_code: form.value.tocityOptionsValue.toString(),
            id_card_num: form.value.personId,
            name: form.value.name,
            phone: form.value.phone,
            record_time: Date.parse(form.value.returnTime) / 1000,
            travel_type: Number(form.value.returnMethod),
            control_mode: parseInt(form.value.control_mode),
          };
          addBackPerson(obj).then(res => {
            parent.emit('on-confirm', '子组件的值');
          });

          // 初始化表单
          if (addForm.value) {
            addForm.value.resetFields();
          }
          form.value = {
            name: '',
            personId: '',
            phone: '',
            control_mode: '',
            returnMethod: '',
            returnTime: '',
            proOptionsValue: '',
            cityOptionsValue: '',
            couOptionsValue: '',
            vliOptionsValue: '',
            hamOptionsValue: '',
            tocityOptionsValue: '',
            tocouOptionsValue: '',
            tovliOptionsValue: '',
            tohamOptionsValue: '',
            fromAddress: '',
            toAddress: '',
          };
        }
      });
    };

    // 管控方式相关
    const control_list = ref([
      {
        lable: '',
        value: '',
      },
    ]);
    // 页面初始化
    onMounted(async () => {
      const res = await controlModeList({ section_type: 3 });
      // console.log(res.data);
      control_list.value = res.data;
    });

    interface optionType {
      name: string; //名字
      code: string; //国编
    }
    //省市级联动

    let proOptions = ref([] as optionType[]);
    let cityOptions = ref([] as optionType[]);
    let couOptions = ref([] as optionType[]);
    let vliOptions = ref([] as optionType[]);
    let hamOptions = ref([] as optionType[]);
    let tocityOptions = ref([] as optionType[]);
    let tocouOptions = ref([] as optionType[]);
    let tovliOptions = ref([] as optionType[]);
    let tohamOptions = ref([] as optionType[]);
    // 打开时的调用
    function onOpen() {
      getChannel({ parent_code: '156000000000' }).then(res => {
        proOptions.value = res.data;
      });
      getChannel({ parent_code: '410000000000' }).then(res => {
        tocityOptions.value = res.data;
      });
    }
    //省级改变的调用
    function proChange() {
      getChannel({
        parent_code: `${form.value.proOptionsValue}`,
      }).then(res => {
        cityOptions.value = res.data;
        form.value.cityOptionsValue = '';
        form.value.couOptionsValue = '';
        form.value.vliOptionsValue = '';
        form.value.hamOptionsValue = '';
        couOptions.value = [];
        vliOptions.value = [];
        hamOptions.value = [];
      });
    }

    //市级改变的调用
    function cityChange() {
      getChannel({
        parent_code: `${form.value.cityOptionsValue}`,
      }).then(res => {
        couOptions.value = res.data;
        form.value.couOptionsValue = '';
        form.value.vliOptionsValue = '';
        form.value.hamOptionsValue = '';
        vliOptions.value = [];
        hamOptions.value = [];
      });
    }

    //县级改变的调用
    function couChange() {
      getChannel({
        parent_code: `${form.value.couOptionsValue}`,
      }).then(res => {
        vliOptions.value = res.data;
        form.value.vliOptionsValue = '';
        form.value.hamOptionsValue = '';
        hamOptions.value = [];
      });
    }

    //乡级改变的调用
    function vliChange() {
      getChannel({
        parent_code: `${form.value.vliOptionsValue}`,
      }).then(res => {
        hamOptions.value = res.data;
        form.value.hamOptionsValue = '';
      });
    }

    function toCityChange() {
      getChannel({
        parent_code: `${form.value.tocityOptionsValue}`,
      }).then(res => {
        tocouOptions.value = res.data;
        form.value.tocouOptionsValue = '';
        form.value.tovliOptionsValue = '';
        form.value.tohamOptionsValue = '';
        tovliOptions.value = [];
        tohamOptions.value = [];
      });
    }

    function toCouChange() {
      getChannel({
        parent_code: `${form.value.tocouOptionsValue}`,
      }).then(res => {
        tovliOptions.value = res.data;
        form.value.tovliOptionsValue = '';
        form.value.tohamOptionsValue = '';
        tohamOptions.value = [];
      });
    }

    function toVliChange() {
      getChannel({
        parent_code: `${form.value.tovliOptionsValue}`,
      }).then(res => {
        tohamOptions.value = res.data;
        form.value.tohamOptionsValue = '';
      });
    }
    //校验规则
    const rules = ref({
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      personId: [
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
      returnTime: [
        { required: true, message: '请填写返乡时间', trigger: 'blur' },
      ],
      returnMethod: [
        { required: true, message: '请填写返回方式', trigger: 'blur' },
      ],
      fromAddress: [
        { required: true, message: '请输入出发地详细地址', trigger: 'blur' },
      ],
      toAddress: [
        { required: true, message: '请输入目的地详细地址', trigger: 'blur' },
      ],
      cityOptionsValue: [
        { required: true, message: '请选择出发地级', trigger: 'blur' },
      ],
      tocityOptionsValue: [
        { required: true, message: '请选择目的地级', trigger: 'blur' },
      ],
    });

    return {
      ...toRefs(state),
      onClose,
      onConfirm,
      form,
      control_list,
      rules,
      addForm,
      proOptions,
      cityOptions,
      couOptions,
      vliOptions,
      hamOptions,
      tocityOptions,
      tocouOptions,
      tovliOptions,
      tohamOptions,
      onOpen,
      proChange,
      cityChange,
      couChange,
      vliChange,
      toCityChange,
      toCouChange,
      toVliChange,
    };
  },
});
</script>
<style lang="scss" scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
