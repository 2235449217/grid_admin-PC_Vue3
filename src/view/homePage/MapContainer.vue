<template>
  <div id="vessel" v-loading="loading">
    <div id="container">
      <button
        v-for="(item, index) in buttonArr"
        :key="index"
        :class="{ active: isActive === index }"
        @click="checkbutton(index)">
        {{ item }}
      </button>
      <button id="all" @click="changeStyle">全屏显示</button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Mapcomtaint',
};
</script>
<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref, onMounted, watch } from 'vue';
import { getMaker, getMapdata } from '@/api/Map/api';
import { Map, LabelMarker, Mak, LabelsLayer } from './Map';
import { MAP_KEY } from '@/constant/map.config';
const loading = ref(true);
let zoom = ref(9);

/************* <Marker点标记>
 ***************/
//地图上显示的点对象
let markers = ref<LabelMarker[]>([]);
//获取点对象的 dept_id 与 名称 与 坐标
let makersArr = ref<Mak[]>([]);
// 获取全部点
let makerAll = ref([]);
const iconIndex = ref(1);
const changeIcon = (index: number) => {
  iconIndex.value = index + 1;
  markers.value.forEach(labelmarker => {
    labelmarker.setIcon({
      type: 'image',
      image:
        'http://221.176.150.183:8082/mapmarker/map' + iconIndex.value + '.png',
      anchor: 'bottom-center',
      size: [30, 30],
    });
  });
};

/************* <高德地图初始化>
 ***************/
const configuration = {
  key: `${MAP_KEY}`, // 申请好的Web端开发者Key，首次调用 load 时必填
  version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins: ['AMap.Map3D', 'AMap.DistrictSearch', 'AMap.LngLat'],
  AMapUI: {
    version: '1.1',
    plugins: [],
  },
  Loca: {
    version: '2.0.0',
  },
};
const clickFlag = ref(false);
/************* <切换码色>
 ***************/
// 判断地图是否加载完毕
let isActive = ref(0);
let buttonArr = ['红黄码', '场所码', '重点场所', '风险人员', '返新人员'];
const state = ref({ name: '红黄码', content: '红黄码的数量为:' });
//对地图进行样式刷新
const changeradio = () => {
  map.setMapStyle('amap://styles/');
};
let checkbutton = (e: number) => {
  switch (e) {
    case 0:
      state.value = { name: '红黄码', content: '红黄码的数量为:' };
      changeradio();
      break;
    case 1:
      state.value = { name: '场所码', content: '场所码的数量为:' };
      changeradio();
      break;
    case 2:
      state.value = { name: '重点场所', content: '重点场所的数量为:' };
      changeradio();
      break;
    case 3:
      state.value = { name: '风险人员', content: '风险人员的数量为:' };
      changeradio();
      break;
    case 4:
      state.value = { name: '返新人员', content: '返新人员的数量为:' };
      changeradio();
      break;
  }
  //刷新地图
  map.closeInforWindow();
  //Marker 样式修改
  changeIcon(e);
  isActive.value = e;
};
/************* <初始化地图对象>
 ***************/
let map: Map;
//地图初始化状态
const mapLoaded = ref(false);
//监听地图加载完毕
watch(mapLoaded, async val => {
  if (val) {
    // makersArr.value = response.data[1].dept_node_list;
  }
});
//获取地图数据 =>渲染地图
const getData = async () => {
  const response = await getMapdata();
  makerAll.value = response.data;
  position.value = response.data[0].dept_node_list[0].location;
  makersArr.value = response.data[1].dept_node_list;
  switch (response.data.length) {
    case 5:
      level.value = 9;
      break;
    case 4:
      level.value = 11;
      break;
    case 3:
      level.value = 13;
      break;
    case 2:
      level.value = 15;
      break;
  }
  // map.text();
  //取消默认样式
  // map.closeInforWindow();
};

let labelsLayer: LabelsLayer;
const initialized = async () => {
  await AMapLoader.load(configuration)
    .then(AMap => {
      //遮罩层
      new AMap.DistrictSearch({
        extensions: 'all',
        subdistrict: 0,
        level: 'city',
      }).search('新乡市', (status: any, result: any) => {
        let outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true),
        ];
        let bounds = result.districtList[0].boundaries;
        let pathArray = [outer];
        pathArray.push.apply(pathArray, bounds);
        let polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: '#f60',
          strokeOpacity: 0.4,
          strokeWeight: 2,
          fillColor: '#ffffff',
          fillOpacity: 0.85,
        });
        polygon.setPath(pathArray);
        map.add(polygon);
      });
      //创建地图对象
      map = new AMap.Map('container', {
        zoom: 9,
        resizeEnable: true,
        viewMode: '3D',
        // 是否显示地图标注
        isHotspot: false,
        center: position.value,
      });

      // // 标点图层
      let infoWindow = new AMap.InfoWindow({
        //
        anchor: 'bottom-left',
        // isCustom: true, //使用自定义窗体
        offset: new AMap.Pixel(4, -26),
      });
      //清除点位信息窗体事件
      map.closeInforWindow = () => {
        infoWindow.close();
      };

      //海量标注图层
      labelsLayer = new AMap.LabelsLayer({
        // zooms: [3, 20],
        allowCollision: false,
        // 是否避让
        collision: false,
        zIndex: 999,
      });
      map.add(labelsLayer);

      map.text = () => {
        let icon = {
          type: 'image',
          image:
            'http://221.176.150.183:8082/mapmarker/map' +
            iconIndex.value +
            '.png',
          anchor: 'bottom-center',
          size: [30, 30],
        };
        markers.value = [];
        // 将图层添加到地图
        for (let i = 0; i < makersArr.value.length; i++) {
          const labelMarker = new AMap.LabelMarker({
            zIndex: 999,
            position: [
              makersArr.value[i].location[0],
              makersArr.value[i].location[1],
            ],
            icon,
            dep_id: makersArr.value[i].dep_id,
          });
          labelMarker.on('mouseover', markerClick);
          labelMarker.on('mouseout', markerOut);
          // labelMarker.emit('mouseover', { target: labelMarker });
          markers.value.push(labelMarker);
        }
        labelsLayer.add(markers.value);
      };
      /**
       * 移出
       */
      async function markerOut(e: LabelMarker) {
        if (clickFlag.value) {
          infoWindow.close();
        }
      }
      /**
       * 获取一个LabelMarker信息
       */
      async function markerClick(e: LabelMarker) {
        if (clickFlag.value) {
          let info = [];
          const response = await getMaker({
            dept_id: e.target._originOpts.dep_id,
            data_type: state.value.name,
          });
          info.push(`<div class='input-tittle'>${state.value.name}信息</div>`);
          info.push(`<div class='input-item'> <span>数量:</span><span>${response.data.count}</span> </div>
          `);
          info.push(`<div class='input-item'> <span>地址:</span><span>${response.data.address}</span> </div>
          `);
          infoWindow.setContent(info.join(''));

          infoWindow.open(map, e.target.getPosition());
        }
      }
      map.on('zoomchange', logMapinfo);
      loading.value = false;
      mapLoaded.value = true;
    })
    .catch(e => {
      console.log(e);
    });
};

const init = async () => {
  await Promise.all([getData(), initialized()]);
  addmakers();
  clickFlag.value = true;
  map.setZoom(level.value);
};
init();

//监听zoom变化
let logMapinfo = function () {
  zoom.value = map.getZoom() - level.value;
  if (map.getZoom() <= 16 && zoom.value < 2 && zoom.value > 0) {
    type.value = 0;
  } else if (map.getZoom() <= 16 && zoom.value < 4 && zoom.value > 2) {
    type.value = 1;
  } else if (map.getZoom() <= 16 && zoom.value < 6 && zoom.value > 4) {
    type.value = 2;
  } else if (map.getZoom() <= 16 && zoom.value < 8 && zoom.value > 6) {
    type.value = 3;
  }
};
const type = ref(0);
watch(type, async val => {
  labelsLayer.remove(markers.value);
  switch (val) {
    case 0:
      {
        labelsLayer.remove(markers.value);
        makersArr.value = makerAll.value[1]['dept_node_list'];
        clickFlag.value = false;
      }
      break;
    case 1:
      {
        labelsLayer.remove(markers.value);
        makersArr.value = makerAll.value[2]['dept_node_list'];
        clickFlag.value = false;
      }
      break;
    case 2:
      {
        labelsLayer.remove(markers.value);
        makersArr.value = makerAll.value[3]['dept_node_list'];
        clickFlag.value = false;
      }
      break;
    case 3:
      {
        labelsLayer.remove(markers.value);
        makersArr.value = makerAll.value[4]['dept_node_list'];
        clickFlag.value = false;
      }
      break;
  }
  await map.text();
  clickFlag.value = true;
  map.closeInforWindow();
});
//添加点位
let addmakers = async () => {
  await map.text();
};
//缩放问题 ，记录宽高
const width = ref('calc(100% - 238px)');
/************* <地图全屏展示>
 ***************/
let amplifier = ref(false);
const changeStyle = () => {
  // amplifier.value = !amplifier.value;
  let node: HTMLElement = document.getElementById('container') as HTMLElement;
  if (!amplifier.value) {
    node.style.position = 'fixed';
    node.style.width = parseInt(width.value) - 18 + 'px';
    node.style.height = 'calc(100% - 105px)';
    node.style.marginTop = '102px';
    amplifier.value = !amplifier.value;
  } else {
    node.style.position = 'static';
    node.style.width = '100%';
    node.style.height = '100%';
    node.style.marginTop = '0px';
    amplifier.value = !amplifier.value;
  }
};
//初始化级别  9 县 11镇 13村 15 网格
const level = ref(9);
//初始化坐标值
const position = ref([113.92679, 35.303589]);
//固定zoom值，作为基准数
onMounted(async () => {
  let mapwindow: HTMLElement = document.querySelector(
    '#container'
  ) as HTMLElement;
  const resizeObserver = new ResizeObserver(entries => {
    let leftNode: HTMLElement = document.querySelector(
      '.el-main'
    ) as HTMLElement;
    width.value = leftNode.clientWidth + 'px';
    if (amplifier.value) {
      mapwindow.style.width = parseInt(width.value) - 18 + 'px';
    }
  });
  resizeObserver.observe(document.querySelector('.el-main') as HTMLElement);
});
</script>

<style scoped lang="scss">
#container {
  z-index: 1;
  top: 0;
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  font-family: 思源黑体;

  button {
    width: 60px;
    height: 25px;
    line-height: 23px;
    border: none;
    border-radius: 2px;
    font-weight: bold;
    cursor: pointer;
    padding: 2;
    color: #ffffff;
    z-index: 99;
    font-size: 12px;
    margin-right: 3px;
    position: relative;
    background: #dae8ff;
    &:hover {
      background-color: #5288f5;
    }
  }

  #all {
    float: right;
  }
}

.active {
  background-color: #5288f5 !important ;
}
::v-deep(.amap-marker img) {
  display: block;
  width: 20px;
}

// 修改基础样式

#vessel {
  width: 100%;
  height: 100%;
}

.input-card {
  position: absolute;
  z-index: 99;
  bottom: 0;
  right: 0;
}
::v-deep(.custom-content-marker img) {
  display: block;
  width: 15px;
  height: 15px;
  background-color: red;
}
::v-deep(.amap-logo) {
  display: none !important; //去掉高德地图logo
}
::v-deep(.amap-copyright) {
  opacity: 0; //去掉高德的版本号
}
.content-window-card {
  position: relative;
  width: 23rem;
  padding: 0.75rem 0 0 1.25rem;
  box-shadow: none;
  bottom: 0;
  left: 0;
}

.content-window-card p {
  height: 2rem;
}

::v-deep(.amap-info-content) {
  font-size: 12px !important;
  padding: 0px 18px 10px 10px;
}
::v-deep(.amap-info-close) {
  display: none;
}
::v-deep(.input-tittle) {
  padding: 6px 24px 5px 23px;
  font-size: 17px;
  color: #8f97a4;
  text-align: center;
}
::v-deep(.input-item) span {
  &:nth-child(1) {
    margin: 4px 5px 4px 5px;
    color: #8f97a4;
    font-size: 14px !important;
  }
  &:nth-child(2) {
    margin: 4px 5px 4px 5px;
    color: #000000;
    font-size: 16px !important;
  }
}
</style>
