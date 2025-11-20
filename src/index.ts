import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'api.exchangerate-api.com',]);

basekit.addField({
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'rmb': '人民币金额',
        'usd': '美元金额',
        'rate': '汇率',
      },
      'en-US': {
        'rmb': 'RMB Amount',
        'usd': 'Dollar amount',
        'rate': 'Exchange Rate',
      },
      'ja-JP': {
        'rmb': '人民元の金額',
        'usd': 'ドル金額',
        'rate': '為替レート',
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'account',
      label: t('rmb'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'id',
          isGroupByKey: true,
          type: FieldType.Text,
          label: 'id',
          hidden: true,
        },
        {
          key: 'usd',
          type: FieldType.Number,
          label: t('usd'),
          primary: true,
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'rate',
          type: FieldType.Number,
          label: t('rate'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_4,
          }
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { account: number }, context) => {
    const { account = 0 } = formItemParams;
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

      interface ExchangeRateResponse {
        rates: {
          [currency: string]: number
        }
      }

      const res = await fetch<ExchangeRateResponse>('https://api.exchangerate-api.com/v4/latest/CNY2', { // 已经在addDomainList中添加为白名单的请求
        method: 'GET',
      });

      const usdRate = res?.rates?.['USD'];


      return {
        code: FieldCode.Success,
        data: {
          id: `${Math.random()}`,
          usd: parseFloat((account * usdRate).toFixed(4)),
          rate: usdRate,
        }
      }

      /*
        如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：

      return {
        code: FieldCode.Success,
        data: {
          id: `具体错误原因`,
          usd: 0,
          rate: 0,
        }
      }

      */
    } catch (e) {
      console.log('====error', String(e));
      debugLog({
        '===999 异常错误': String(e)
      });
      /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
       * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
       */
      return {
        code: FieldCode.Error,
      }
    }
  },
});
export default basekit;