import BasePlot from '../../base/plot';
import BaseConfig, {
    ElementOption,
    IValueAxis,
    ITimeAxis,
    ICatAxis,
    IColorConfig,
} from '../../interface/config';
import _ from 'lodash';
import { extractScale } from '../../util/scale';
import { CoordinateType } from '@antv/g2/lib/plot/interface';
import * as StyleParser from '../../util/styleParser';

interface LineStyle {
  opacity?: number;
  lineDash?: number[];
}

interface PointStyle {
  shape?: string;
  size?: number;
  color?: string;
  opacity?: string;
}

interface FillStyle {
  shape?: string;
  size?: number;
  color?: string;
  opacity?: string;
}

export interface RadarConfig extends BaseConfig {
    /** 分组字段 */
  seriesField?: string;
    /** 是否平滑 */
  smooth?: boolean;
    /** 折线图形样式 */
  lineStyle?: LineStyle | Function;
    /** 数据点图形样式 */
  pointStyle?: PointStyle;
    /** area图形样式 */
  fillStyle?: FillStyle;
  xAxis: IValueAxis | ICatAxis | ITimeAxis;
  yAxis: IValueAxis;
  radius?: number;
}

export default class Rardar extends BasePlot<RadarConfig>{
  baseElement: any;
  line: any; // 保存line、area、point的配置项，用于后续的label、tooltip
  point: any;
  area: any;

  protected _setDefaultG2Config() { }

  protected _scale() {
    const props = this._initialProps;
    const scales = {};
        /** 配置x-scale */
    scales[props.xField] = {};
    _.has(props, 'xAxis') && extractScale(scales[props.xField], props.xAxis);
        /** 配置y-scale */
    scales[props.yField] = {};
    _.has(props, 'yAxis') && extractScale(scales[props.yField], props.yAxis);
    this._setConfig('scales', scales);
  }

  protected _coord() {
    const props = this._initialProps;
    const coordConfig = {
      type: 'polar' as CoordinateType,
      cfg: {
        radius: 0.8, // default radius值
      },
    };
    if (_.has(props, 'radius')) {
      coordConfig.cfg.radius = props.radius;
    }
    this._setConfig('coord', coordConfig);
  }

  protected _axis() {
    const props = this._initialProps;
    const axesConfig = { fields: {} };
        /** 配置x轴 */
    axesConfig.fields[props.xField] = {
      line: null,
      tickLine: null,
      grid: {
        lineDash: null,
      },
    };
        /** 配置y轴 */
    axesConfig.fields[props.yField] = {
      line: null,
      tickLine: null,
      gridType: 'line',
      grid: {
        lineDash: null,
      },
      gridAlternateColor: 'rgba(0, 0, 0, 0.04)',
    };
        /** 存储坐标轴配置项到config */
    this._setConfig('axes', axesConfig);
  }

  protected _addElements() {
    const props = this._initialProps;
        /** 配置面积 */
    if (props.fillStyle) {
      const area = this._element('area', props.fillStyle);
      if (props.smooth) area.shape = { values: [ 'smooth' ] };
      this._setConfig('element', area);
    }
        /** 配置线 */
    if (props.lineStyle) {
      const line = this._element('line', props.lineStyle);
      if (props.smooth) line.shape = { values: [ 'smooth' ] };
      this._setConfig('element', line);
    }
        /** 配置点 */
    if (props.pointStyle) {
      const point = this._element('point', props.pointStyle);
      this._setConfig('element', point);
    }
  }

  protected _element(type, cfg) {
        /** 雷达图需配置area、line、point三种element，做一下抽象 */
    const props = this._initialProps;
    const element: ElementOption = {
      type,
      position: {
        fields: [ props.xField, props.yField ],
      },
    };
    if (props.seriesField || props.color) element.color = this._color();
    element.style = this._style(cfg);
    return element;
  }

  protected _label() { }

  protected _annotation() { }

  protected _animation() { }

  protected _interactions() { }

  protected _events(eventParser) {
        // super._events(EventParser);
  }

  private _color() {
    const props = this._initialProps;
    const config: IColorConfig = {};
    if (_.has(props, 'seriesField')) {
      config.fields = [ props.seriesField ];
    }
    if (_.has(props, 'color')) {
      const color = props.color;
      if (_.isString(color)) {
        config.values = [ color ];
      } else {
        config.values = color as [];
      }
    }
    return config;
  }

  private _style(cfg) {
    const props = this._initialProps;
    const config = {
      fields: null,
      callback: null,
      cfg: null,
    };
    if (_.isFunction(cfg) && props.seriesField) {
      config.fields = [ props.seriesField ];
      config.callback = cfg;
      return config;
    }
    config.cfg = cfg;
    return config;
  }

  private _extractAxis(desAxis, field: string, axis, theme) {
    if (!axis) return desAxis;
        /** 配置x轴 */
        // style
    if (axis.style) {
      StyleParser.AxisStyleParser(theme, axis.style, 'circle');
    }
        // formatter
    if (axis.formatter) {
      const formatter = axis.formatter;
      desAxis.label = function (text, index, total) {
        return {
          text: formatter(text),
        };
      };
    }
    return desAxis;
  }

}