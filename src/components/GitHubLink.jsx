import React from 'react';
import { Icon } from 'antd';

function GitHubLink() {
  return (
    <a
      href="https://github.com/ewoken/world-data-app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon type="github" theme="outlined" />
      {'GitHub'}
    </a>
  );
}

export default GitHubLink;
