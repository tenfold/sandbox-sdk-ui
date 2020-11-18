
import { transform, isEqual, isObject } from 'lodash';

export function objDiff(objToCompare: any, baseObj: any) {
  const changes = (object: any, base: any) => {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  };
  return changes(objToCompare, baseObj);
}
