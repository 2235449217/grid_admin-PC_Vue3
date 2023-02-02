<template>
  <div class="page">
    <div ref="mychart" class="barChar">柱状图</div>
    <div class="midZone">
      <el-row :gutter="10">
        <el-col :span="15">
          <div class="map">
            <Mapview></Mapview>
          </div>
        </el-col>
        <el-col :span="9">
          <div v-loading="siteLoading" class="siteTotal">
            <div class="headTopic">
              <div class="siteTotalTopic">
                <div class="itemClass">区划名称</div>
                <div class="itemClass">场所码扫码总量</div>
              </div>
              <el-icon class="uploadIcon" @click="uploadOut"
                ><upload
              /></el-icon>
            </div>
            <SeamlessScroll
              :list-data="zoneData"
              more-id="zoneData"></SeamlessScroll>
          </div>
          <div v-loading="handLoading" class="siteHandOut">
            <div class="headTopic">
              <div class="siteHandOutTopic">
                <div class="itemClass">区划名称</div>
                <div class="itemClass">已派发数量</div>
                <div class="itemClass">未派发数量</div>
              </div>
              <el-icon class="uploadIcon"><upload /></el-icon>
            </div>
            <SeamlessScroll
              :list-data="handOutData"
              more-id="handOutData"></SeamlessScroll>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bottomZone">
      <el-row :gutter="10">
        <el-col :span="15">
          <div v-loading="personLoading" class="personManage">
            <div class="headTopic">
              <div class="personManageTopic">
                <div class="itemClass">区划名称</div>
                <div class="itemClass">集中隔离数量</div>
                <div class="itemClass">居家隔离数量</div>
                <div class="itemClass">居家检测数量</div>
                <div class="itemClass">失控人员数量</div>
              </div>
              <el-icon class="uploadIcon"><upload /></el-icon>
            </div>
            <SeamlessScroll
              :list-data="manageData"
              more-id="manageData"></SeamlessScroll>
          </div>
        </el-col>
        <el-col :span="9">
          <div v-loading="returnLoading" class="returnXin">
            <div class="headTopic">
              <div class="returnXinTopic">
                <div class="itemClass">区划名称</div>
                <div class="itemClass">返新人员数量</div>
              </div>
              <el-icon class="uploadIcon"><upload /></el-icon>
            </div>

            <SeamlessScroll
              :list-data="returnXinData"
              more-id="returnXinData"></SeamlessScroll>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'HomePage',
};
</script>
<script setup lang="ts">
import * as echarts from 'echarts';
import { ref } from 'vue';
import { onMounted } from 'vue-demi';
import Mapview from './MapContainer.vue';
import SeamlessScroll from './seamlessScroll.vue';
import {
  barStatistics,
  getBackPersonal,
  getControlMode,
  getScanCodeNumber,
  getSceneCodeDispatch,
} from '@/api/homePage';
const siteLoading = ref(true);
const handLoading = ref(true);
const personLoading = ref(true);
const returnLoading = ref(true);
const zoneData = ref([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);
const handOutData = ref([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);
const manageData = ref([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);
const returnXinData = ref([
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

getBackPersonal().then(res => {
  while (res.data.length < 25) {
    res.data = res.data.concat(res.data);
  }
  returnXinData.value = res.data;
  returnLoading.value = false;
});
getControlMode().then(res => {
  while (res.data.length < 25) {
    res.data = res.data.concat(res.data);
  }
  manageData.value = res.data;
  personLoading.value = false;
});
getScanCodeNumber().then(res => {
  while (res.data.length < 25) {
    res.data = res.data.concat(res.data);
  }
  zoneData.value = res.data;
  handLoading.value = false;
});
getSceneCodeDispatch().then(res => {
  while (res.data.length < 25) {
    res.data = res.data.concat(res.data);
  }
  handOutData.value = res.data;
  siteLoading.value = false;
});

const scene_name = ref(); //x轴的数据
const color_count = ref(); //红黄码数量
const key_place = ref(); //重点场所
const risk_people = ref(); //风险人员
const risk_warning = ref(); //风险预警

const uploadOut = () => {
  console.log('kkkkkkk');
};

onMounted(() => {
  // 获取dom，断言HTMLElement类型，否则会报错
  barStatistics().then(res => {
    scene_name.value = res.data.scene_name;
    color_count.value = res.data.color_count;
    key_place.value = res.data.key_place;
    risk_people.value = res.data.risk_people;
    risk_warning.value = res.data.risk_warning;

    const chartEle: HTMLDivElement = document.getElementsByClassName(
      'barChar'
    )[0] as HTMLDivElement;
    const chart = echarts.init(chartEle);
    window.addEventListener('resize', () => {
      chart.resize();
    });
    chart.setOption({
      title: {
        //echarts标题
        // text: 'demo',
      },
      grid: {
        bottom: '20%',
        right: '5%',
        top: '20%',
        left: '5%',
      },
      tooltip: {
        // 触发类型
        trigger: 'axis', //item图形触发
        //坐标轴指示器
        axisPointer: {
          type: 'cross', //line显示一个实线，shadow阴影效果，cross十字准星
        },
        // showContent: false,
        // 悬浮层的样式
        // borderColor: 'red',
        // borderWidth: 5,
        backgroundColor: 'rgba(105, 192, 255, 0.3)',
        textStyle: {
          color: 'rgb(77, 112, 255)',
        },
      },
      legend: {
        show: true, //设置图例的开启或者是关闭
        // orient: 'vertical', //设置图例垂直
        itemWidth: 20,
        itemHeight: 10,
      },
      xAxis: {
        data: scene_name.value,
      },
      yAxis: {},
      series: [
        {
          data: color_count.value,
          type: 'bar',
          name: '红黄码',
          itemStyle: {
            color: '#FF8058',
          },
        },
        {
          data: key_place.value,
          type: 'bar',
          name: '重点场所',
          itemStyle: {
            color: '#5288F5',
          },
        },
        {
          data: risk_people.value,
          type: 'bar',
          name: '风险人员',
          itemStyle: {
            color: '#FFD43D',
          },
        },
        {
          data: risk_warning.value,
          type: 'bar',
          name: '预警',
          itemStyle: {
            color: '#FF6D62',
          },
        },
      ],
    });
  });
});
</script>
<style lang="scss" scoped>
.page {
  .barChar {
    width: 100%;
    height: 20vh;
    position: relative;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
  }
  .midZone {
    width: 100%;
    .map {
      height: 45vh;
      position: relative;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
    }
    .siteTotal {
      height: 21.9vh;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 0.5px solid rgba(230, 230, 230, 1);
      .headTopic {
        background-color: #ecf5ff;
        font-weight: bold;
        color: #8f97a4;
      }
      .siteTotalTopic {
        display: flex;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
        justify-content: space-around;
        margin: 0 20px;
        .itemClass {
          width: 110px;
          text-align: center;
        }
      }
      .uploadIcon {
        float: right;
        margin-right: 10px;
        margin-top: -25px;
      }
    }
    .siteHandOut {
      height: 21.9vh;
      margin-top: 1vh;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 0.5px solid rgba(230, 230, 230, 1);
      .headTopic {
        background-color: #ecf5ff;
        font-weight: bold;
        color: #8f97a4;
      }
      .siteHandOutTopic {
        display: flex;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
        justify-content: space-around;
        margin: 0 20px;
        .itemClass {
          width: 110px;
          text-align: center;
        }
      }
      .uploadIcon {
        float: right;
        margin-right: 10px;
        margin-top: -25px;
      }
    }
  }
  .bottomZone {
    margin-top: -10px;
    .personManage {
      height: 22vh;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 0.5px solid rgba(230, 230, 230, 1);
      .headTopic {
        background-color: #ecf5ff;
        font-weight: bold;
        color: #8f97a4;
      }
      .personManageTopic {
        display: flex;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
        justify-content: space-around;
        margin: 0 20px;
        .itemClass {
          width: 110px;
          text-align: center;
        }
      }
      .uploadIcon {
        float: right;
        margin-right: 10px;
        margin-top: -25px;
      }
    }
    .returnXin {
      height: 22vh;
      background: rgba(255, 255, 255, 1);
      border-radius: 2px;
      border: 0.5px solid rgba(230, 230, 230, 1);
      .headTopic {
        background-color: #ecf5ff;
        font-weight: bold;
        color: #8f97a4;
      }
      .returnXinTopic {
        display: flex;
        padding-top: 1.5vh;
        padding-bottom: 1.5vh;
        justify-content: space-around;
        margin: 0 20px;
        .itemClass {
          width: 110px;
          text-align: center;
        }
      }
      .uploadIcon {
        float: right;
        margin-right: 10px;
        margin-top: -25px;
      }
    }
  }
}
</style>
