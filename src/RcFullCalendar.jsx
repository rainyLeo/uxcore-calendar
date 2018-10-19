import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import CalendarMixin from 'rc-calendar/lib/mixin/CalendarMixin';
import CommonMixin from 'rc-calendar/lib/mixin/CommonMixin';
import FullCalendarHeader from './FullCalendarHeader';

import DateTable from './date/DateTable';
import WeekTable from './week/WeekTable';
import TimeTable from './time-table/TimeTable';
import moment from 'moment';

const FullCalendar = createReactClass({
  propTypes: {
    defaultType: PropTypes.string,
    type: PropTypes.string,
    prefixCls: PropTypes.string,
    locale: PropTypes.object,
    setType: PropTypes.func,
    fullscreen: PropTypes.bool,
    onSelect: PropTypes.func,
    dateCellRender: PropTypes.func,
    weekRender: PropTypes.func,
    showTypeSwitch: PropTypes.bool,
    headerComponents: PropTypes.array,
    headerComponent: PropTypes.object, // The whole header component
    headerRender: PropTypes.func,
    showHeader: PropTypes.bool,
    disabledDate: PropTypes.func,
    showCount: PropTypes.number,
  },
  mixins: [CommonMixin, CalendarMixin],
  getDefaultProps() {
    return {
      defaultType: 'month',
      fullscreen: false,
      showTypeSwitch: true,
      showHeader: true,
      showCount: 1,
      setType() {},
    };
  },

  onHeaderSelect(value, formatValue, momentValue) {
    let resultVal = momentValue ? momentValue : value;
    this.setValue(resultVal);
  },

  componentWillReceiveProps(nextProps) {
    if ('type' in nextProps) {
      this.setState({
        type: nextProps.type,
      });
    }
  },
  setType(type) {
    this.props.setType(type);
  },
  initHeader() {
    const props = this.props;
    const { locale, prefixCls, showHeader, headerComponent, headerRender, type } = props;
    const { value } = this.state;

    let header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(value, type, locale);
      } else {
        const TheHeader = headerComponent || FullCalendarHeader;
        header = (
          <TheHeader
            key="calendar-header"
            {...props}
            prefixCls={`${prefixCls}`}
            type={type}
            value={value}
            onTypeChange={this.setType}
            onValueChange={this.onHeaderSelect}
          />
        );
      }
    }
    return header;
  },
  getDateTableElement() {
    const props = this.props;
    const { locale, prefixCls, disabledDate, ...others } = props;
    const { value } = this.state;

    return (
      <DateTable
        locale={locale}
        prefixCls={prefixCls}
        onSelect={this.onSelect}
        value={value}
        disabledDate={disabledDate}
        {...others}
      />
    );
  },
  getWeekTableElement() {
    const props = this.props;
    const { locale, prefixCls, disabledDate, ...others } = props;
    const { value } = this.state;

    return (
      <WeekTable
        locale={locale}
        onSelect={this.onSelect}
        prefixCls={`${prefixCls}-week-panel`}
        value={value}
        disabledDate={disabledDate}
        {...others}
      />
    );
  },
  getTimeTableElement() {
    const props = this.props;
    const { locale, prefixCls, showCount, ...others } = props;
    const { value } = this.state;

    return (
      <TimeTable
        locale={locale}
        onSelect={this.onSelect}
        prefixCls={`${prefixCls}-time-panel`}
        value={value}
        showCount={showCount}
        {...others}
      />
    );
  },
  getPanel() {
    const { type } = this.state;
    switch (type) {
      case 'month':
        return this.getDateTableElement();
      case 'week':
        return this.getWeekTableElement();
      case 'time':
        return this.getTimeTableElement();
      default:
        return;
    }
  },
  render() {
    const props = this.props;
    const { prefixCls, fullscreen } = props;
    let header = this.initHeader();
    const children = [
      header,
      <div key="calendar-body" className={`${prefixCls}-calendar-body`}>
        {this.getPanel()}
      </div>,
    ];

    const className = [`${prefixCls}-full`];

    if (fullscreen) {
      className.push(`${prefixCls}-fullscreen`);
    }

    return this.renderRoot({
      children,
      className: className.join(' '),
    });
  },
});

export default FullCalendar;
