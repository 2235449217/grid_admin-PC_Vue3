/* eslint-disable */
export const toUpperCase = (str: string) => {
  if (str[0]) {
    return str.replace(str[0], str[0].toUpperCase());
  } else {
    return '';
  }
};

export const toLowerCase = (str: string) => {
  if (str[0]) {
    return str.replace(str[0], str[0].toLowerCase());
  } else {
    return '';
  }
};

// 驼峰转换下划线
export const toSQLLine = (str: string) => {
  if (str === 'ID') return 'ID';
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

// 下划线转换驼峰
export const toHump = (name: string) => {
  return name.replace(/\_(\w)/g, function (all: any, letter: string) {
    return letter.toUpperCase();
  });
};
