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
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      // @ts-ignore
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }
    try {
      const resText: any = await context.fetch('https://api.exchangerate-api.com/v4/latest/CNY', { // 已经在addDomainList中添加为白名单的请求
        method: 'GET',
      }).then(res => res.text()); // 不要直接res.json()，这非常容易报错，且难以排查

      // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
      debugLog({
        '===1 接口返回结果': resText
      });

      const res = JSON.parse(resText);
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