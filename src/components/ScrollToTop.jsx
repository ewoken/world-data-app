import { Component } from 'react';
import { equals } from 'ramda';

class ScrollToTop extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps) {
    if (!equals(this.props, prevProps)) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default ScrollToTop;
