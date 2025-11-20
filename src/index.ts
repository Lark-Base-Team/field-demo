import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm])

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

    /** 
     * 为方便查看日志，使用此方法替代console.log
     * 开发者可以直接使用这个工具函数进行日志记录
     */
    function debugLog(arg: any, showContext = false) {
      // @ts-ignore
      if (!showContext) {
        console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
        return;
      }
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }), '\n');
    }

    // 入口第一行日志，展示formItemParams和context，方便调试
    // 每次修改版本时，都需要修改日志版本号，方便定位问题
    debugLog('=====start=====v1', true);

    /** 
     * 封装好的fetch函数 - 开发者请尽量使用这个封装，而不是直接调用context.fetch
     * 这个封装会自动处理日志记录和错误捕获，简化开发工作
     */
    const fetch: <T = Object>(...arg: Parameters<typeof context.fetch>) => Promise<T | { code: number, error: any, [p: string]: any }> = async (url, init, authId) => {
      try {
        const res = await context.fetch(url, init, authId);
        // 不要直接.json()，因为接口返回的可能不是json格式，会导致解析错误
        const resText = await res.text();

        // 自动记录请求结果日志
        debugLog({
          [`===fetch res： ${url} 接口返回结果`]: {
            url,
            init,
            authId,
            resText: resText.slice(0, 4000), // 截取部分日志避免日志量过大
          }
        });

        return JSON.parse(resText);
      } catch (e) {
        // 自动记录错误日志
        debugLog({
          [`===fetch error： ${url} 接口返回错误`]: {
            url,
            init,
            authId,
            error: e
          }
        });
        return {
          code: -1,
          error: e
        };
      }
    };

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