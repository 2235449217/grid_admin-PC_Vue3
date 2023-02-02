import axios from 'axios';
import { ElMessage } from 'element-plus';

const service = axios.create();

// http request 拦截器
service.interceptors.request.use(
  config => {
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: 'token ' + '48b1efb455c6a56dc9972a6c57815b1adafc6ca6',
      ...config.headers,
    };
    return config;
  },
  error => {
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
    });
    return error;
  }
);

export function Commits(data) {
  return service({
    url: 'https://gosword.cppwnn.top/open-api?Action=DescribeGitCommits',
    method: 'post',
    data,
  });
}

export function Members(data) {
  return service({
    url: 'https://gosword.cppwnn.top/open-api',
    method: 'post',
    data,
  });
}
