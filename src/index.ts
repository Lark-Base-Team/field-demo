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
      return {
        code: FieldCode.Success,
        data: {
          id: usdRate ? 'success' : 'error',
          usd: parseFloat((account * usdRate).toFixed(4)),
          rate: usdRate,
        }
      }
    } catch (e) {
      debugLog(e);
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
