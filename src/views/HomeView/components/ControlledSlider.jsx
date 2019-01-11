import React, { Component } from 'react';
import { Slider } from 'antd';

class ControlledSlider extends Component {
  constructor() {
    super();
    this.state = { value: undefined };
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    this.setState({
      value: defaultValue,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue } = this.props;
    if (defaultValue !== nextProps.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  setValue(value) {
    const { onChange } = this.props;
    this.setState({ value });
    onChange(value);
  }

  render() {
    const { value } = this.state;
    return (
      <Slider {...this.props} value={value} onChange={v => this.setValue(v)} />
    );
  }
}

export default ControlledSlider;
