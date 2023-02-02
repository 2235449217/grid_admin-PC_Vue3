<template>
  <el-form :rules="rules">
    <el-descriptions title="核查信息" border>
      <!-- 基础核查信息 -->
      <template
        v-for="(item, index) in [...baseList, ...moreList]"
        :key="index">
        <template v-if="item.display">
          <el-descriptions-item :span="item.span || 1">
            <template #label>
              <span :class="['form-label', { required: item.required }]">
                {{ item.label }}
              </span>
            </template>
            <!-- input -->
            <template v-if="item.content.type === 'input'">
              <el-form-item :prop="item.prop">
                <el-input
                  v-model="item.content.value"
                  :type="item.content.isTextarea ? 'textarea' : 'text'"
                  validate-event
                  show-word-limit
                  :maxlength="item.content.maxlength"
                  :placeholder="item.content.placeholder"
                  @change="change" />
              </el-form-item>
            </template>
            <!-- radio -->
            <template v-if="item.content.type === 'radio'">
              <el-radio-group v-model="item.content.value" @change="change">
                <el-radio
                  v-for="(opt, i) in item.content.options"
                  :key="i"
                  :label="opt.value">
                  {{ opt.label }}</el-radio
                >
              </el-radio-group>
            </template>
            <!-- select -->
            <template v-if="item.content.type === 'select'">
              <el-select
                v-model="item.content.value"
                :placeholder="item.content.placeholder"
                :style="{
                  width: '100%',
                }">
                <el-option
                  v-for="(opt, i) in item.content.options"
                  :key="i"
                  :label="opt.label"
                  :value="opt.value" />
              </el-select>
            </template>
            <!-- cascade -->
            <template v-if="item.content.type === 'cascade'">
              <div
                class="from-cascade"
                :style="{
                  gridTemplateColumns: `repeat(${item.content.length}, auto)`,
                }">
                <el-input
                  v-for="i in item.content.length"
                  :key="i"
                  v-model="item.content.value[i - 1]"
                  type="text"
                  show-word-limit
                  maxlength="10"
                  :placeholder="item.content.placeholder[i - 1]"
                  @change="change" />
              </div>
            </template>
            <!-- dept-cascade -->
            <template v-if="item.content.type === 'dept-cascade'">
              <el-cascader
                ref="cascader"
                v-model="item.content.value"
                :style="{
                  width: '100%',
                }"
                :placeholder="item.content.placeholder"
                :props="deptCascaderProps" />
            </template>
            <!-- date-range -->
            <template v-if="item.content.type === 'date-range'">
              <el-date-picker
                v-model="item.content.value"
                type="daterange"
                :default-value="item.content.default"
                :range-separator="item.content.rangeSeparator"
                :start-placeholder="
                  item.content.placeholder && item.content.placeholder[0]
                "
                :end-placeholder="
                  item.content.placeholder && item.content.placeholder[1]
                "
                @change="change" />
            </template>
          </el-descriptions-item>
        </template>
      </template>
    </el-descriptions>
  </el-form>
</template>
<script lang="ts">
export default {
  name: 'CheckFromPanel',
};
</script>
<script setup lang="ts">
import { getDepartment } from '@/api/healthCode';
import { VerificationDetailsType } from '@/api/regionCheck/types';
import TABLE_CODE_MAP from '@/constant/tableCodeMap';
import { ElMessage, FormInstance, FormItemRule, Resolve } from 'element-plus';
import Node from 'element-plus/es/components/cascader-panel/src/node';
import { computed, ref, watch, inject } from 'vue';

const props = defineProps<{
  data: VerificationDetailsType | null;
}>();

//管控方式列表
let controldata = inject('getdata');
/************************************************
 * 表单信息
 ************************************************/

// 基础核查信息
type FromType = {
  label: string;
  prop: string;
  display?: boolean;
  content:
    | {
        type: 'input';
        maxlength: number;
        isTextarea?: boolean;
        value?: string;
        placeholder?: string;
      }
    | {
        type: 'radio';
        value?: string | number | boolean;
        options: {
          label: string;
          value: string | number | boolean;
        }[];
      }
    | {
        type: 'select';
        value?: string | number | boolean;
        options: {
          label: string;
          value: string | number | boolean;
        }[];
        placeholder?: string;
      }
    | {
        type: 'cascade';
        length: number;
        value: string[];
        placeholder: string[];
      }
    | {
        type: 'dept-cascade';
        value: number[] | number | undefined;
        placeholder: string;
      }
    | {
        type: 'date-range';
        value?: [Date, Date] | undefined;
        rangeSeparator?: string;
        placeholder?: [string, string];
        default?: [Date, Date];
      };
  span?: number;
  required?: boolean;
};
const baseList = ref<FromType[]>([
  {
    label: '姓名',
    prop: 'name',
    display: true,
    content: {
      type: 'input',
      maxlength: 10,
      placeholder: '请输入姓名',
    },
    required: true,
  },
  {
    label: '证件号',
    prop: 'id_card_num',
    display: true,
    content: {
      type: 'input',
      maxlength: 18,
      placeholder: '请输入证件号',
    },
    required: true,
  },
  {
    label: '手机号',
    prop: 'phone',
    display: true,
    content: {
      type: 'input',
      maxlength: 11,
      placeholder: '请输入手机号',
    },
    required: true,
  },
  {
    label: '人员出发地',
    prop: 'depart_detail_address',
    display: true,
    content: {
      type: 'input',
      maxlength: 100,
      placeholder: '请输入人员出发地',
    },
    span: 2,
    required: true,
  },
  {
    label: '是否属实本地',
    prop: 'is_local',
    display: true,
    content: {
      type: 'radio',
      value: 1,
      options: [
        TABLE_CODE_MAP.is_local['是'],
        TABLE_CODE_MAP.is_local['否'],
      ].map(v => {
        return {
          label: TABLE_CODE_MAP.is_local[v],
          value: v,
        };
      }),
    },
    required: true,
  },
]);
// 本地核查信息
const localList = ref<FromType[]>([
  {
    label: '是否当地核酸检测',
    prop: 'is_nucleic',
    content: {
      type: 'radio',
      options: new Array(4).fill(null).map((v, i) => {
        return {
          label: TABLE_CODE_MAP.is_nucleic[i + 1],
          value: i + 1,
        };
      }),
    },
    span: 2,
    required: true,
  },
  {
    label: '是否纳入本地管控',
    prop: 'included_local',
    content: {
      type: 'radio',
      options: new Array(2).fill(null).map((v, i) => {
        return {
          label: TABLE_CODE_MAP.included_local[i + 1],
          value: i + 1,
        };
      }),
    },
    required: true,
  },
  {
    label: '本地管控方式',
    prop: 'is_control',
    content: {
      type: 'radio',
      options: controldata(),
    },
    span: 3,
    required: true,
  },
  {
    label: '其他核查过程信息',
    prop: 'other_verification_information',
    content: {
      type: 'input',
      maxlength: 300,
      isTextarea: true,
      placeholder: '请输入其他核查过程信息',
    },
    span: 3,
  },
]);
// 外地核查信息
const otherList = ref<FromType[]>([
  {
    label: '非本地操作',
    prop: 'is_non_local',
    content: {
      type: 'radio',
      options: new Array(2).fill(null).map((v, i) => {
        return {
          label: TABLE_CODE_MAP.is_non_local[i + 1],
          value: i + 1,
        };
      }),
    },
    span: 2,
    required: true,
  },
  {
    label: '转派区划',
    prop: 'gr_city_address',
    content: {
      type: 'dept-cascade',
      value: undefined,
      placeholder: '请选择区划',
    },
    span: 1,
    required: true,
  },
  {
    label: '转派原因',
    prop: 'transfer_reason',
    content: {
      type: 'input',
      maxlength: 100,
      placeholder: '请输入转派原因',
    },
    span: 2,
    required: true,
  },
  {
    label: '选择退回原因',
    prop: 'back_reason',
    content: {
      type: 'select',
      options: new Array(6).fill(null).map((v, i) => {
        return {
          label: TABLE_CODE_MAP.back_reason[i + 1],
          value: i + 1,
        };
      }),
      placeholder: '请选择退回原因',
    },
    span: 1,
    required: true,
  },
  {
    label: '转出外省区划',
    prop: 'gr_prov_address',
    content: {
      type: 'cascade',
      length: 3,
      value: ['', '', ''],
      placeholder: ['填写省', '填写市', '填写区'],
    },
    span: 3,
  },
  {
    label: '退回过程其他信息',
    prop: 'back_other_information',
    content: {
      type: 'input',
      maxlength: 300,
      isTextarea: true,
      placeholder: '请输入退回过程其他信息',
    },
    span: 3,
    required: true,
  },
]);
// 管控方式额外表单
const controlList = ref<FromType[]>([
  {
    label: '隔离点名称',
    prop: 'concentrated_see_address',
    content: {
      type: 'input',
      maxlength: 100,
      placeholder: '请输入隔离点名称',
    },
    span: 3,
    required: true,
  },
  {
    label: '隔离时间段',
    prop: 'live_see_range',
    content: {
      type: 'date-range',
      rangeSeparator: '至',
      placeholder: ['选择开始时间', '选择结束时间'],
    },
    span: 3,
    required: true,
  },
]);

// 表单赋值操作
watch(
  props,
  val => {
    const data = val.data;
    if (data) {
      [
        ...baseList.value,
        ...localList.value,
        ...otherList.value,
        ...controlList.value,
      ].forEach(item => {
        if (item.prop === 'live_see_range') {
          item.content.type === 'date-range' &&
            (item.content.value = [
              new Date(data['live_see_begin']),
              new Date(data['live_see_over']),
            ]);
        } else if (
          item.prop === 'gr_city_address' &&
          item.content.type === 'dept-cascade'
        ) {
          item.content.value =
            Number.parseInt(data['gr_city_address'][0]) || undefined;
          item.content.placeholder = data['gr_city_address'][1];
        } else {
          data[item.prop] && (item.content.value = data[item.prop]);
        }
      });
      change();
    } else {
      [
        ...baseList.value,
        ...localList.value,
        ...otherList.value,
        ...controlList.value,
      ].forEach(item => {
        let defaultValue:
          | string[]
          | string
          | number
          | undefined
          | null
          | [Date, Date];
        switch (item.content.type) {
          case 'input':
            defaultValue = '';
            break;
          case 'radio':
            if (item.prop === 'is_local') {
              defaultValue = 2;
            } else {
              defaultValue = 1;
            }
            break;
          case 'cascade':
            defaultValue = new Array(item.content.length).fill('');
            break;
          case 'date-range':
            defaultValue = undefined;
            break;
          default:
            defaultValue = undefined;
            break;
        }
        item.content.value = defaultValue;
      });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

/************************************************
 * 区划级联
 ************************************************/
const deptCascaderProps = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: Node, resolve: Resolve) {
    getDepartment({
      id: (node && (node.data?.id as number)) || 1,
    }).then(res => {
      const list = res.data.list.map((v: { ID: number; deptName: string }) => {
        return {
          label: v.deptName,
          id: v.ID,
          value: v.ID,
        };
      });
      resolve(list);
    });
  },
};

/************************************************
 * 维护 moreList
 ************************************************/
const moreList = computed(() => {
  return [...localList.value, ...otherList.value, ...controlList.value];
});

// 根据 prop 获取表单项
const getListItem = (list: FromType[], prop: string) => {
  for (const item of list) {
    if (item.prop === prop) return item;
  }
  return null;
};

// 操作列表中的一些项目的显示状态
const setListDisplay = (props?: string[]) => {
  const list = [...localList.value, ...otherList.value, ...controlList.value];
  for (const item of list) {
    if (props && props.includes(item.prop)) {
      item.display = true;
    } else {
      item.display = false;
    }
  }
};

const change = () => {
  //是本地 人员出发地设置为必填项
  baseList.value[3].required = true;
  let displayList = [];
  // 是否属实本地
  const isLocalItem = getListItem(baseList.value, 'is_local');
  if (isLocalItem?.content.value === TABLE_CODE_MAP.is_local['是']) {
    const isControlItem = getListItem(localList.value, 'is_control');
    if (
      isControlItem?.content.value === TABLE_CODE_MAP.is_control['集中隔离']
    ) {
      displayList = [
        'is_nucleic',
        'included_local',
        'is_control',
        'concentrated_see_address',
        'other_verification_information',
      ];
    } else if (
      isControlItem?.content.value === TABLE_CODE_MAP.is_control['居家隔离']
    ) {
      displayList = [
        'is_nucleic',
        'included_local',
        'is_control',
        'live_see_range',
        'other_verification_information',
      ];
    } else {
      displayList = [
        'is_nucleic',
        'included_local',
        'is_control',
        'other_verification_information',
      ];
    }
  } else {
    //不是本地 人员出发地设置为必填项
    baseList.value[3].required = false;
    console.log('选择否选项');
    const isNonNocalItem = getListItem(otherList.value, 'is_non_local');
    if (
      isNonNocalItem?.content.value ===
      TABLE_CODE_MAP.is_non_local['新乡市内转派']
    ) {
      displayList = ['is_non_local', 'gr_city_address', 'transfer_reason'];
    } else {
      displayList = [
        'is_non_local',
        'gr_prov_address',
        'back_reason',
        'back_other_information',
      ];
    }
  }
  setListDisplay(displayList);
  console.log(displayList);
};

/************************************************
 * 表单校验
 ************************************************/

// 表单校验规则
const rules: Record<string, FormItemRule[]> = {
  name: [
    {
      validator: (rule, value, callback) => {
        validators.name(callback);
      },
      trigger: 'change',
    },
  ],
  id_card_num: [
    {
      validator: (rule, value, callback) => {
        validators.id_card_num(callback);
      },
      trigger: 'change',
    },
  ],
  phone: [
    {
      validator: (rule, value, callback) => {
        validators.phone(callback);
      },
      trigger: 'change',
    },
  ],
};

// 校验器
const validators = {
  name: (callback: (err?: Error) => void) => {
    baseList.value.forEach(item => {
      if (item.prop === 'name') {
        const value = item.content.value as string;
        if (value.length === 0) {
          callback(new Error('请输入姓名'));
        } else {
          callback();
        }
      }
    });
  },
  id_card_num: (callback: (err?: Error) => void) => {
    baseList.value.forEach(item => {
      if (item.prop === 'id_card_num') {
        const value = item.content.value as string;
        const Reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!Reg.test(value as string)) {
          callback(new Error('请输入合法的身份证号'));
        } else {
          callback();
        }
      }
    });
  },
  phone: (callback: (err?: Error) => void) => {
    baseList.value.forEach(item => {
      if (item.prop === 'phone') {
        const value = item.content.value as string;
        const Reg =
          /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!Reg.test(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      }
    });
  },
};

/************************************************
 * 生成结果
 ************************************************/

const getReult = async () => {
  // 基础表单校验
  let valid = true;
  Object.keys(validators).map(key => {
    const validator = validators[key];
    validator((err: Error) => {
      if (err) valid = false;
    });
  });
  if (!valid) {
    return null;
  } else {
    // 复杂表单校验
    let errorFlag = false;
    const result: Record<
      string,
      | string[]
      | string
      | number[]
      | number
      | boolean
      | Date[]
      | Date
      | [Date | null, Date | null]
      | undefined
    > = {
      name: '',
      id_card_num: '',
      phone: '',
      is_local: 0,
      type: 0,
    };
    result.type =
      baseList.value.at(-1)?.content.value === 1
        ? 0
        : otherList.value.at(0)?.content.value === 1
        ? 1
        : 2;
    [...baseList.value, ...moreList.value].forEach(item => {
      if (item.display) {
        if (item.required && !item.content.value) errorFlag = true;
        if (item.content.type === 'date-range' && item.content.value) {
          const [startDate, endDate] = item.content.value;
          startDate && (result['live_see_begin'] = startDate);
          endDate && (result['live_see_over'] = endDate);
        } else if (item.content.type === 'dept-cascade' && item.content.value) {
          if (Array.isArray(item.content.value)) {
            result[item.prop] = item.content.value.at(-1);
          } else {
            result[item.prop] = item.content.value;
          }
        } else {
          item.content.value && (result[item.prop] = item.content.value);
        }
      }
    });
    return errorFlag ? null : result;
  }
};
defineExpose({ getReult });
</script>
<style scoped lang="scss">
.el-form-item {
  margin-bottom: 0;
  &.is-error {
    margin-bottom: 18px;
  }
}

.form-label.required {
  &::before {
    content: '*';
    color: var(--el-color-danger);
    margin-right: 4px;
  }
}

.from-cascade {
  display: grid;
  column-gap: 8px;
}
</style>
