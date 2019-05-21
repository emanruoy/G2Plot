/**
 * G2-Plot配置项
 * 注意事项：
 * 1. 命名采用驼峰
 * 2. 如果是枚举值，不使用enum，全部列出
 * 3. 减少嵌套，尽量平铺配置
 */
import { Option } from '@antv/g2';
import { AttributeCfg, LabelOptions } from '@antv/g2/lib/element/base';
import { AdjustCfg } from '@antv/g2/lib/interface';

export default interface Config {
  /** 数据，对象数组 */
  data: object[];
  width?: number;
  height?: number;
  /** 字段描述信息，G2用于设置Tooltip、Scale等配置 */
  meta?: { [fieldId: string]: Meta };
  /** 图表标题 */
  title?: ITitle;
  /** 图表描述 */
  description?: IDescription;
  /** padding */
  padding?: number | number[] | string;
  /** x、y轴字段 */
  xField?: string;
  yField?: string;
  /** 颜色映射 */
  color?: string | string[] | {};
  /** 大小映射 */
  size?: number | number[] | {};
  /** 形状映射 */
  shape?: string | string[] | {};
  /** 轴 */
  xAxis?: Axis;
  yAxis?: Axis;
  /** 数据标签 */
  label?: Label | Boolean;
  /** Tooltip */
  tooltip?: Tooltip | false;
  /** 图例 */
  legend?: Legend | boolean;
  /** 动画 */
  animation?: any | boolean;
  /** 标注 */
  annotation?: any[];
  /** 样式 */
  theme?: Theme;
  /** 交互，待定 */
  interactions?: any[];
  /** 是否响应式 */
  responsive?: boolean;
  /** 图表层级的事件 */
  events: {
    [ k: string ]: Function | boolean;
  };
}

type Formatter = (value: any, index?: number, ...args: any[]) => string;

interface Meta {
  /** 字段id，此处仅为了完整性 */
  field?: string;
  /** 字段展示名 */
  name?: string;
  /** 字段值格式化 */
  formatter?: Formatter;
}

interface ITitle {
  text: string;
  style?: {};
}

interface IDescription {
  text: string;
  style?: {};
}

interface IEvents {
  [k:string] : string;
}

interface IAxisStyle {
  line?: {};
  grid?: {};
  label?: {};
  title?: { offset:number,
    textStyle: {},
  };
  tickLine: {};
}

interface IBaseAxis {
  /** 轴是否需要显示，默认true */
  visible: boolean,
  /** 轴类型，对应scale类型 */
  type: 'value' | 'time' | 'category';
  /** 轴标题 */
  title?: string | boolean;
  /** 轴位置，默认下和左 */
  position?: 'default' | 'opposite';
  /** label内容formatter */
  formatter?: Function;
  /** gridLine */
  style?: IAxisStyle;
  events?: IEvents;
}
/** Linear型 */
export interface IValueAxis extends IBaseAxis {
  type: 'value';
  /** tick相关配置 */
  min?: number;
  max?: number;
  tickCount?: number;
  tickInterval?: number;
}
/** 时间型 */
export interface ITimeAxis extends IBaseAxis {
  type: 'time';
  /** tick相关配置 */
  tickInterval?: string;
  tickCount?: number;
  groupBy?: string;
}
/** 离散类目型 */
export interface ICatAxis extends IBaseAxis {
  type: 'category';
  /** tick相关配置 */
  tickInterval?: number;
  tickCount?: number;
  groupBy: string;
  /** 目前DI开放的配置，如果内部自动化更好 */
  label?: Partial<{
    rotate: number;
  }>;
}
type Axis = ICatAxis | IValueAxis | ITimeAxis;

export interface Label {
  type?: string;
  formatter?: Formatter;
  style?: {};
  offset?: number;
  offsetX?: number;
  offsetY?: number;
  events?: IEvents;
  /** 展示优化策略 */
}

export interface Legend {
  /** 位置 */
  position?: string;
  /** 翻页 */
  flipPage?: boolean;
  events?: IEvents;
}

export interface Tooltip {
  /** html */
  html?: HTMLDivElement;
  /** 辅助线 */
  crosshair?: 'x' | 'y' | 'cross' | boolean;
}

interface Animation {
  /** 动画模式，延伸or缩放 */
  type?: string;
  duration?: number;
  easing?: string;
}

interface Theme {}

export interface ElementOption {
  type: string;
  position: {
    fields: string[],
  };
  color?: AttributeCfg;
  size?: AttributeCfg;
  shape?:AttributeCfg;
  style?:{};
  label?: LabelOptions;
  animate?: {};
  adjust?: AdjustCfg[];
}

export interface G2Config {
  scales: Option.ScalesOption;
  legends: Option.LegendOption | Option.LegendsOption | boolean;
  tooltip: Option.TooltipOption | boolean;
  axes: Option.AxesOption | boolean;
  coord: Option.CoordinateOption;
  element?: ElementOption;
  elements: ElementOption[];
  annotations: any[];
  interactions: {};
  theme: any;
}

export interface IColorConfig {
  fields?: string[];
  values?: string[];
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;
export const timeIntervals = {
  second: { value: SECOND, format: 'HH:mm:ss' },
  miniute: { value: MINUTE, format: 'HH:mm' },
  hour: { value: HOUR, format: 'HH' },
  day: { value: DAY, format: 'YYYY-MM-DD' },
  week: { value: WEEK, format: 'YYYY-MM-DD' },
  month: { value: MONTH, format: 'YYYY-MM' },
  year: { value: YEAR, format: 'YYYY' },
};