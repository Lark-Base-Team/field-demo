import base from './src/index';
console.log("🚀 ~ base:", base)

function renamePropertyType(obj) {
    // 如果是数组，遍历每一项
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            renamePropertyType(item);
        });
    } else if (obj?.propertyType === 'Object' && Array.isArray(obj?.properties)) {
        obj['type'] = obj['propertyType'];
        delete obj['propertyType'];
        renamePropertyType(obj['properties']);
    }
}

// console.log("🚀 ~ base:", base.field)
// @ts-ignore
renamePropertyType(base.field.resultType)
console.log("🚀 ~ res:", base.field.resultType)
