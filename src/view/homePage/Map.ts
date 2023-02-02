export interface Mak {
  dep_id: number;
  location: string[];
}
//象素坐标
export interface Pixel {
  /**构造一个像素坐标对象。**/
  x: number;
  y: number;
  /**获得X方向像素坐标**/
  getX(): number;

  /**获得Y方向像素坐标**/
  getY(): number;

  /**当前像素坐标与传入像素坐标是否相等**/
  equals(point: Pixel): boolean;

  /**以字符串形式返回像素坐标对象**/
  toString(): string;
}
export interface LngLat {
  /**构造一个像素坐标对象。**/
  lng: number;
  lat: number;
  offset(w: number, s: number): LngLat;
  /**获得X方向像素坐标**/
  getX(): number;
}
export interface Bounds {
  /**构造一个像素坐标对象。**/
  southWest: LngLat;
  northEast: LngLat;
  /**获得X方向像素坐标**/
  getCenter(): LngLat;
  /**获取西南角坐标。**/
  getSouthWest(): LngLat;

  /**获取东北角坐标**/
  getNorthEast(): LngLat;

  /**以字符串形式返回地物对象的矩形范围**/
  toString(): string;
}
export interface LabelsLayer {
  visible: boolean;
  remove(content: LabelMarker | LabelMarker[]): void;
  clear(): void;
  add(content: LabelMarker[]): void;

  // add()
}
/** 地图对象类, 封装了地图的属性设置、图层变更、事件交互等接口的类。相关示例 **/
export interface Map {
  //清除点位信息窗体
  closeInforWindow(): void;
  text(): void;
  /**构造一个地图对象, 参数container中传入地图容器DIV的ID值或者DIV对象, opts地图初始化参数对象, 参数详情参看MapOptions列表。**/
  container: string | HTMLDivElement;
  opts: MapOptions;
  /**唤起高德地图客户端marker页其中Object里面包含有{ id: "B000A7BD6C", POIIDname: String, 必要参数location: LngLat|position属性 必须参数}**/
  poiOnAMAP(obj: any): void;

  /**唤起高德地图客户端marker详情页其中Object里面包含有{ id: "B000A7BD6C", POIIDname: String, 必要参数location: LngLat|position属性 必须参数}**/
  detailOnAMAP(obj: any): void;

  /**获取当前地图缩放级别, 在PC上, 默认取值范围为[3, 18]；在移动设备上, 默认取值范围为[3-19]3D地图会返回浮点数, 2D视图为整数。(3D地图自V1.4.0开始支持)**/
  getZoom(): number;

  /**获取地图图层数组, 数组为一个或多个图层(自v1.3 新增)**/
  getLayers(): Array<any>;

  /**获取地图中心点经纬度坐标值。**/
  getCenter(): LngLat;

  /**返回地图对象的容器**/
  getContainer(): HTMLDivElement;

  /**获取地图中心点所在区域, 回调函数返回对象属性分别对应为{省, 市, 区/县}**/
  getCity(
    callback: (
      province: string,
      city: string,
      citycode: string,
      district: string
    ) => void
  ): void;

  /**获取当前地图视图范围, 获取当前可视区域。3D地图下返回类型为ArrayBounds, 2D地图下仍返回Bounds 。(3D自V1.4.0开始支持)**/
  getBounds(): Bounds;

  /**获取当前地图标注的显示顺序**/
  getLabelzIndex(): number;

  /**获取Map的限制区域**/
  getLimitBounds(): Bounds;

  /**获取底图语言类型(自v1.3 新增)**/
  getLang(): string;

  /**获取地图容器像素大小**/
  getSize(): string | number;

  /**获取地图顺时针旋转角度(自v1.3 新增)**/
  getRotation(): number;

  /**获取当前地图状态信息, 包括是否可鼠标拖拽移动地图、地图是否可缩放、地图是否可旋转(rotateEnable)、是否可双击放大地图、是否可以通过键盘控制地图旋转(keyboardEnable)等**/
  getStatus(): any;

  /**获取地图默认鼠标指针样式**/
  getDefaultCursor(): string;

  /**获取指定位置的地图分辨率, 单位: 米/像素。 参数point有指定值时, 返回指定点地图分辨率, point缺省时, 默认返回当前地图中心点位置的分辨率**/
  getResolution(point: LngLat): number;

  /**获取当前地图比例尺。其值为当前地图中心点处比例尺值的倒数**/
  getScale(dpi: number): number;

  /**设置地图显示的缩放级别, 在PC上, 参数zoom可设范围: [3, 18]；在移动端: 参数zoom可设范围: [3, 19]3D地图下, 可将zoom设置为浮点数。(3D自V1.4.0开始支持)**/
  setZoom(level: number): void;

  /**设置地图标注显示的顺序**/
  setlabelzIndex(index: number): void;

  /**设置地图图层数组, 数组为一个或多个图层。当叠加多个图层时, 普通二维地图需通过实例化一个TileLayer类实现(自v1.3 新增)**/
  setLayers(layers: Array<any>): void;

  /**添加地图覆盖物数组, 数组为一个或多个覆盖物。**/
  add(overlayers: Array<any> | LabelsLayer): void;

  /**删除地图覆盖物数组, 数组为一个或多个覆盖物。**/
  remove(overlayers: Array<any>): void;

  /**返回添加的覆盖物对象, 可选类型包括marker、circle、polyline、polygon； Type可缺省, 缺省时返回所有覆盖物(marker、circle、polyline、polygon)。 返回结果不包含官方覆盖物等, 比如定位marker, 周边搜索圆等**/
  getAllOverlays(type: any): any;

  /**设置地图显示的中心点**/
  setCenter(position: LngLat | number[]): void;

  /**地图缩放至指定级别并以指定点为地图显示中心点**/
  setZoomAndCenter(zoomLevel: number, center: LngLat | number[]): void;

  /**按照行政区名称或adcode来设置地图显示的中心点。行政区名称支持中国、省、市、区/县名称, 如遇重名的情况, 会按城市编码表顺序返回第一个。adcode请在城市编码表中查询。建议不要同时使用center/setCenter()和setCity(), 如一起使用程序将以setCity()作为最后结果。 相关示例**/
  setCity(city: string, callback: Function): void;

  /**指定当前地图显示范围, 参数bounds为指定的范围**/
  setBounds(bound: Bounds): void;

  /**设置Map的限制区域, 设定区域限制后, 传入参数为限制的Bounds。地图仅在区域内可拖拽 相关示例**/
  setLimitBounds(bound: Bounds): void;

  /**清除限制区域**/
  clearLimitBounds(): void;

  /**设置地图语言类型, 设置后底图重新加载(自v1.3 新增)**/
  setLang(lang: string): string;

  /**设置地图顺时针旋转角度, 旋转原点为地图容器中心点, 取值范围 [0-360](自v1.3 新增)**/
  setRotation(rotation: number): number;

  /**设置当前地图显示状态, 包括是否可鼠标拖拽移动地图、地图是否可缩放、地图是否可旋转(rotateEnable)、是否可双击放大地图、是否可以通过键盘控制地图旋转(keyboardEnable)等 相关示例**/
  setStatus(status: any): void;

  /**设置鼠标指针默认样式, 参数cursor应符合CSS的cursor属性规范。可为CSS标注中的光标样式, 如: setCursor(“pointer”)等；或者自定义的光标样式, 如: setCursor("url('http: //http://lbs.amap.com/webapi/static/Images//0.png'), pointer")**/
  setDefaultCursor(cursor: string): void;

  /**地图放大一级显示**/
  zoomIn(): void;

  /**地图缩小一级显示**/
  zoomOut(): void;

  /**地图中心点平移至指定点位置**/
  panTo(positon: LngLat): void;

  /**以像素为单位, 沿x方向和y方向移动地图, x向右为正, y向下为正**/
  panBy(x: number, y: number): void;

  /**根据地图上添加的覆盖物分布情况, 自动缩放地图到合适的视野级别, 参数overlayList默认为当前地图上添加的所有覆盖物图层**/
  setFitView(overlayList: Array<any>): void;

  /**删除地图上所有的覆盖物**/
  clearMap(): void;

  /**注销地图对象, 并清空地图容器**/
  destroy(): void;

  /**插件加载方法。参数name中指定需要加载的插件类型, 同时加载多个插件时, 以字符串数组的形式添加。在Callback回调函数中进行地图插件的创建、插件事件的绑定等操作；插件为地图功能的扩展, 按需加载；插件写作方法, 请参考相关示例。**/
  plugin(name: string | Array<any>, callback: Function): void;

  /**添加控件。参数可以是插件列表中的任何插件对象, 如: ToolBar、OverView、Scale等**/
  addControl(obj: any): void;

  /**移除地图上的指定控件**/
  removeControl(obj: any): void;

  /**清除地图上的信息窗体。**/
  clearInfoWindow(): void;

  /**平面地图像素坐标转换为地图经纬度坐标 相关示例**/
  pixelToLngLat(pixel: Pixel, level: number): LngLat;

  /**地图经纬度坐标转换为平面地图像素坐标**/
  lnglatToPixel(lngLat: LngLat, level: number): Pixel;

  /**地图容器像素坐标转为地图经纬度坐标 相关示例**/
  containerToLngLat(pixel: Pixel): LngLat;

  /**地图经纬度坐标转为地图容器像素坐标**/
  lngLatToContainer(lnglat: LngLat): Pixel;

  /**设置地图的显示样式, 目前支持两种地图样式: 第一种: 自定义地图样式, 如"amap: //styles/d6bf8c1d69cea9f5c696185ad4ac4c86"可前往地图自定义平台定制自己的个性地图样式；第二种: 官方样式模版, 如"amap: //styles/grey"。其他模版样式及自定义地图的使用说明见开发指南**/
  setMapStyle(style: string): void;

  /**获取地图显示样式**/
  getMapStyle(): string;

  /**设置地图上显示的元素种类, 支持bg(地图背景)、point(兴趣点)、road(道路)、building(建筑物)**/
  setFeatures(feature: Array<any>): void;

  /**获取地图显示元素种类**/
  getFeatures(): Array<any>;

  /**修改底图图层(自v1.3 废弃)**/
  // setDefaultLayer (layer: TileLayer): void;

  /**设置俯仰角, 3D视图有效(自V1.4.0开始支持)**/
  setPitch(Number: any): void;

  /**获取俯仰角(自V1.4.0开始支持)**/
  getPitch(): number;

  /**
   * 绑定事件声明
   */
  on(event: string, callback: Function): void;
}
/** labelMarker **/
export interface LabelMarker {
  target: any;
  on(event: string, callback: Function): void;
  emit(event: string, { target: labelMarker }): void;
  opt: LabelMarkerOptions;
  setIcon(content: string | Icon): void;
}
/** MapOptions **/
export interface MapOptions {
  /**地图视口, 用于控制影响地图静态显示的属性, 如: 地图中心点“center”推荐直接使用zoom、center属性为地图指定级别和中心点(自v1.3 新增)**/
  view?: View2D;

  /**地图图层数组, 数组可以是图层 中的一个或多个, 默认为普通二维地图。当叠加多个图层时, 普通二维地图需通过实例化一个TileLayer类实现(自v1.3 新增)**/
  layers?: Array<any>;

  /**地图显示的缩放级别, 若center与level未赋值, 地图初始化默认显示用户所在城市范围 3D地图下, zoom值, 可以设置为浮点数。(在V1.3.0版本level参数调整为zoom, 3D地图修改自V1.4.0开始生效)**/
  zoom?: number;

  /**地图中心点坐标值**/
  center?: LngLat | number[];

  /**3D模式下的地图旋转角度 */
  rotation?: number;

  /**地图标注显示顺序, 大于110即可将底图上的默认标注显示在覆盖物(圆、折线、面)之上。**/
  labelzIndex?: number;

  /**地图显示的缩放级别范围在PC上, 默认为[3, 18], 取值范围[3-18]；在移动设备上, 默认为[3, 19], 取值范围[3-19]**/
  zooms?: Array<any>;

  /**地图语言类型可选值: zh_cn: 中文简体, en: 英文, zh_en: 中英文对照默认为: zh_cn: 中文简体注: 由于图面内容限制, 中文、英文 、中英文地图POI可能存在不一致的情况(自v1.3 新增)**/
  lang?: string;

  /**地图默认鼠标样式。参数defaultCursor应符合CSS的cursor属性规范**/
  defaultCursor?: string;

  /**地图显示的参考坐标系, 取值: 'EPSG3857''EPSG3395''EPSG4326'自V1.3.0移入view对象中**/
  crs?: string;

  /**地图平移过程中是否使用动画(如调用panBy、panTo、setCenter、setZoomAndCenter等函数, 将对地图产生平移操作, 是否使用动画平移的效果), 默认为true, 即使用动画**/
  animateEnable?: boolean;

  /**是否开启地图热点, 默认false 不打开(自v1.3 新增)**/
  isHotspot?: boolean;

  /**当前地图中默认显示的图层。默认图层可以是TileLayer.Satellite等切片地图, 也可以是通过TileLayer自定义的切片图层(自v1.3 废弃)**/
  // defaultLayer?: TileLayer;

  /**地图是否可旋转, 默认false。3D视图默认为true, 2D视图默认false。(V1.3版本新增, 3D视图自V1.4.0开始支持)**/
  rotateEnable?: boolean;

  /**是否监控地图容器尺寸变化, 默认值为false**/
  resizeEnable?: boolean;

  /**是否在有矢量底图的时候自动展示室内地图, PC端默认是true, 移动端默认是false**/
  showIndoorMap?: boolean;

  /**在展示矢量图的时候自动展示室内地图图层, 当地图complete之后可以获取到该对象**/
  // indoorMap?: IndoorMap;

  /**是否支持可以扩展最大缩放级别, 和zooms属性配合使用设置为true的时候, zooms的最大级别在PC上可以扩大到20级, 移动端还是高清19/非高清20**/
  expandZoomRange?: boolean;

  /**地图是否可通过鼠标拖拽平移, 默认为true。此属性可被setStatus/getStatus 方法控制**/
  dragEnable?: boolean;

  /**地图是否可缩放, 默认值为true。此属性可被setStatus/getStatus 方法控制**/
  zoomEnable?: boolean;

  /**地图是否可通过双击鼠标放大地图, 默认为true。此属性可被setStatus/getStatus 方法控制**/
  doubleClickZoom?: boolean;

  /**地图是否可通过键盘控制, 默认为true方向键控制地图平移, "+"和"-"可以控制地图的缩放, Ctrl+“→”顺时针旋转, Ctrl+“←”逆时针旋转。此属性可被setStatus/getStatus 方法控制**/
  keyboardEnable?: boolean;

  /**地图是否使用缓动效果, 默认值为true。此属性可被setStatus/getStatus 方法控制**/
  jogEnable?: boolean;

  /**地图是否可通过鼠标滚轮缩放浏览, 默认为true。此属性可被setStatus/getStatus 方法控制**/
  scrollWheel?: boolean;

  /**地图在移动终端上是否可通过多点触控缩放浏览地图, 默认为true。关闭手势缩放地图, 请设置为false。**/
  touchZoom?: boolean;

  /**可缺省, 当touchZoomCenter=1的时候, 手机端双指缩放的以地图中心为中心, 否则默认以双指中间点为中心**/
  touchZoomCenter?: number;

  /**设置地图的显示样式, 目前支持两种地图样式: 第一种: 自定义地图样式, 如"amap: //styles/d6bf8c1d69cea9f5c696185ad4ac4c86"可前往地图自定义平台定制自己的个性地图样式；第二种: 官方样式模版, 如"amap: //styles/grey"。其他模版样式及自定义地图的使用说明见开发指南**/
  mapStyle?: string;

  /**设置地图上显示的元素种类支持'bg'(地图背景)、'point'(POI点)、'road'(道路)、'building'(建筑物)**/
  features?: Array<any>;

  /**设置地图显示3D楼块效果, 移动端也可使用。推荐使用。**/
  showBuildingBlock?: boolean;

  /**默认为‘2D’, 可选’3D’, 选择‘3D’会显示 3D 地图效果。(自V1.4.0开始支持)**/
  viewMode?: string;

  /**俯仰角度, 默认0, [0, 83], 2D地图下无效 。(自V1.4.0开始支持)**/
  pitch?: number;

  /**是否允许设置俯仰角度, 3D视图下为true, 2D视图下无效。(自V1.4.0开始支持)**/
  pitchEnable?: boolean;

  /**楼块出现和消失的时候是否显示动画过程, 3D视图有效, PC端默认true, 手机端默认false。(自V1.4.0开始支持)**/
  buildingAnimation?: boolean;

  /**调整天空颜色, 配合自定义地图, 3D视图有效, 如‘#ff0000’。(自V1.4.0开始支持)**/
  skyColor?: string;

  /**设置地图的预加载模式, 开启预加载的地图会在适当时刻提前加载周边和上一级的地图数据, 优化使用体验。该参数默认值true。 (自v1.4.4开始支持)**/
  preloadMode?: boolean;
}
