import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

basekit.addDomainList(['api.exchangerate-api.com']);

basekit.addField({
  i18n: {
    messages: {
      'zh-CN': {},
      'en-US': {},
      'ja-JP': {},
    }
  },
  formItems: [
    {
      key: 'account',
      label: '人民币金额',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { account: number }, context) => {
    const { account = 0 } = formItemParams;
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }
    try {
      const res = await context.fetch('https://api.exchangerate-api.com/v4/latest/CNY', {
        method: 'GET',
      }).then(res => res.json());
      const rates = res?.rates;
      const usdRate = rates?.['USD'];

      // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
      debugLog({
        '===1 返回结果': res
      })
      return {
        code: FieldCode.Success,
        data: {
          id: usdRate ? 'success' : 'error',
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
      debugLog({
        '===999 未知错误': String(e)
      });

      /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
       * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
       */
      return {
        code: FieldCode.Error,
      }
    }
  },
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'id',
          type: FieldType.Text,
          title: '生成结果',
          isGroupByKey: true,
        },
        {
          key: 'usd',
          type: FieldType.Number,
          title: '美元金额',
          primary: true,
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'rate',
          type: FieldType.Number,
          title: '汇率',
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_4,
          }
        },
      ],
    },
  },
});

export default basekit;
