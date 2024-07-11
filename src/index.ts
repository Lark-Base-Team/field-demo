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
    if (Array.isArray(url)) {
      return {
        code: FieldCode.Success, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: (url.map(({ link }, index) => {
          if (!link) {
            return undefined
          }
          const name = link.split('/').slice(-1)[0];
          return {
            name: '随机名字' + index + name,
            content: link,
            contentType: "attachment/url"
          }
        })).filter((v) => v)
      };
    }
    return {
      code: FieldCode.Error,
    };
  },
  resultType: {
    type: FieldType.Attachment,
  },
});
export default basekit;