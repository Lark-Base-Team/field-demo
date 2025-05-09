import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

basekit.addField({
  formItems: [
    {
      key: 'url',
      label: '请输入需要转附件的URL',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text]
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.Attachment,
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }
    try {
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

      // 请避免使用 debugLog(url) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
      debugLog({
        '===1 url为空': url
      });
      return {
        code: FieldCode.Error,
      };
    } catch (error) {
      debugLog({
        '===999 未知错误': String(error)
      });
      return {
        code: FieldCode.Error,
      };
    }

  },
});
export default basekit;