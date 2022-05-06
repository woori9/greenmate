import _ from 'lodash';

const snakeToCamel = obj => {
  const formattedData = _.mapKeys(obj, (value, key) => _.camelCase(key));
  Object.keys(formattedData).forEach(key => {
    if (typeof formattedData[key] === 'object') {
      formattedData[key] = snakeToCamel(formattedData[key]);
    }
  });
  return formattedData;
};

const camelToSnake = obj => {
  const formattedData = _.mapKeys(obj, (value, key) => _.snakeCase(key));
  Object.keys(formattedData).forEach(key => {
    if (typeof formattedData[key] === 'object') {
      formattedData[key] = snakeToCamel(formattedData[key]);
    }
  });
  return formattedData;
};

export { snakeToCamel, camelToSnake };
