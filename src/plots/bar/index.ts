import _ from 'lodash';
import BasePlot from '../../base/plot';
import BaseConfig, { ElementOption, IValueAxis, ITimeAxis, ICatAxis, Label } from '../../interface/config';
import { extractScale } from '../../util/scale';
import { extractAxis } from '../../util/axis';
import * as StyleParser from '../../util/styleParser';

interface BarStyle {
  opacity?: number;
  lineDash?: number[];
}

export interface BarConfig extends BaseConfig {
  // 图形
  type: 'rect' | 'triangle' | 'round';
  // 百分比, 数值, 最小最大宽度
  width: number;
  maxthWidth: number;
  minWidth: number;
  barStyle: BarStyle | Function;
  xAxis: ICatAxis | ITimeAxis;
  yAxis: IValueAxis;
}

export default class BaseBar<T extends BarConfig = BarConfig> extends BasePlot<T>{

  protected _setDefaultG2Config() {}

  protected _scale() {
    const props = this._initialProps;
    const scales = {};
    /** 配置x-scale */
    scales[props.yField] = {
      type: 'cat',
    };
    _.has(props, 'xAxis') && extractScale(scales[props.yField], props.xAxis);
      /** 配置y-scale */
    scales[props.xField] = {};
    _.has(props, 'yAxis') && extractScale(scales[props.xField], props.yAxis);
    this._setConfig('scales', scales);
  }

  protected _coord() {
    const coordConfig = {
      actions: [
        [ 'transpose' ],
      ],
    };
    this._setConfig('coord', coordConfig);
  }

  protected _axis() {
    const props = this._initialProps;
    const axesConfig = { fields:{} };
    axesConfig.fields[props.xField] = {};
    axesConfig.fields[props.yField] = {};

    /** 配置x轴 */
    extractAxis(axesConfig.fields[props.xField], props.xField, props.xAxis, this._config.theme);
    /** 配置y轴 */
    extractAxis(axesConfig.fields[props.yField], props.yField, props.yAxis, this._config.theme);
    /** 存储坐标轴配置项到config */
    this._setConfig('axes', axesConfig);
  }

  protected _adjustBar(bar: ElementOption) {
    return;
  }

  protected _addElements() {
    const props = this._initialProps;
    const bar: ElementOption = {
      type: 'interval',
      position: {
        fields: [ props.yField, props.xField ],
      },
    };
    if (props.barStyle) bar.style = this._columnStyle();
    if (props.label) {
      bar.label = this._extractLabel();
    }
    this._adjustBar(bar);
    this._setConfig('element', bar);
  }

  protected _interactions() {
  }

  protected _annotation() {}

  protected _animation() {
  }

  private _columnStyle() {
    const props = this._initialProps;
    const barStyleProps = props.barStyle;
    const config = {
      fields: null,
      callback: null,
      cfg: null,
    };
    config.cfg = barStyleProps;
    return config;
  }

  private _extractLabel() {
    const props = this._initialProps;
    const label = props.label as Label;
    const labelConfig = {
      fields: [ props.yField ],
      callback: null,
    };

    /** formater */
    if (label.formatter) {
      const formater = label.formatter;
      labelConfig.callback = (val) => {
        return {
          content: formater(val),
          offsetX: label.offsetX ? label.offsetX : 0,
          offsetY: label.offsetY ? label.offsetY : 0,
        };
      };
    }
    /** label样式 */
    if (label.style) {
      const theme = this._config.theme;
      StyleParser.LabelStyleParser(theme, label.style);
    }

    return labelConfig;
  }
}
