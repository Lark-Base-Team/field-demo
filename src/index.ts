import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'url',
      label: '请选择多行文本字段',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text]
      },
      validator: {
        required: true,
      }
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { url } = formItemParams;
    if (url) {
      return {
        code: FieldCode.Success, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: {
          files: [
            {
              name: "图片1.jpg",
              content: url[0].link,
              contentType: "URL"
            }
          ]
        },
      };
    }
    return {
      code: FieldCode.Error,
    };
  },
  resultType: {
    type: FieldType.Attachment,
    extra: {
      icon: {
        light: 'https://cdn.pixabay.com/photo/2023/06/11/01/24/flowers-8055013_1280.jpg'
      },
      properties: [{
        key: "id",
        type: FieldType.Text,
        title: 'id',
      }, {
        key: "id2",
        type: FieldType.Text,
        title: '主属性',
        primary: true,
      }]
    }
  },
});
export default basekit;