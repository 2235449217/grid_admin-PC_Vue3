import JSEncrypt from 'jsencrypt/bin/jsencrypt';

// const CryptoJS = require('crypto-js');

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey =
  '-----BEGIN PUBLIC KEY-----\n' +
  'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAp9zXAX/Du15JqlMmdmcA\n' +
  'GrCuAWkD+pTKyIHcHzYUNC+dWmUMCrET+8vcqSV49jtLBNcmMZx0ummgfpumPI8g\n' +
  'ESW2TU4ZrmwyzpQQd7q9O1OPGuVr6CQhLUXUdBwz8INPU0Oy9grEBQrUs696QY44\n' +
  'Z/CbkMOemfvlFdvSMJVKCxurvm5LD+6KGX84/lTJLuSLTpcqZj6qA6+AgA4l3o+C\n' +
  '0jmxc+d6G402jQ/SBXysjS3M5gCP9a6CWZPvsLHcqIlkV1MypW85vGJmY9ayqWDF\n' +
  'na1j4zaJNGL8q54k4d1QGCr/L93Lgi/6hQ5cyfLbfNgVsQVDOnSoScg8XxkT768V\n' +
  'HSW2UL41YO/o+jyLB+sdyR+aEkXUnQTiDf575xjOevQihZNDzOyeqE3o7C4k8UJK\n' +
  'tFIGg532Zxo/4y0hNy58zDBGWbWOud10gNluQrhgb2mK8QEwiHdhWSmPPCe3YP11\n' +
  'Fb4AlQeafUmI4mUoLlbsMhxmEU7KhvbEnLdEbD6Z6wgnZTfR3EXzIuvMak7B5YZU\n' +
  'YlQHX54cDtYou6gAdU9NGOineTcWKgQmPjI8oGgRllJiqCDpem35WgdwQ1W6oB1n\n' +
  'xdW+1UAFwtS02RPr1UV1fZN5oDHZ5kmGFeE6+KgAzoyRrkZzm+IMeYk21pvvheu7\n' +
  'DLZxktFdP0OHsqMfCwqEqM8CAwEAAQ==\n' +
  '-----END PUBLIC KEY-----';
// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt); // 对需要加密的数据进行加密
}
