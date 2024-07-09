import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;
basekit.addField({
  // authorizations: [
  //   {
  //     id: 'Outlook',
  //     platform: 'Outlook',
  //     type: AuthorizationType.Custom,
  //     label: '',
  //     params: [
  //       {
  //         key: 'a'
  //       }
  //     ]
  //   }
  // ],
  // i18n: {
  //   messages: {
  //     'zh-CN': {
  //       attachmentLabel: '请选择附件字段',
  //       url: '附件地址',
  //       name: '附件名称',
  //       size: '附件尺寸',
  //     },
  //     'en-US': {},
  //     'ja-JP': {},
  //   }
  // },
  formItems: [
    {
      key: 'url',
      label: '这是label',
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
    console.log("🚀 ~ execute: ~ formItemParams, context:", formItemParams, context)
    const { url } = formItemParams;
    // try {
    //   const res = await context.fetch('http://localhost:3000?c=1#d=2', {
    //     headers: {
    //       'Authorization': 'token',
    //     },
    //   });
    //   console.log("🚀 ~ execute: ~ res:", res)
    // } catch (e) {
    //   console.log("🚀 ~ execute: ~ e:", e)
    // }
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
  },
});
export default basekit;