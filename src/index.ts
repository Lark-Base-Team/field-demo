import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

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
          title: 'id',
          hidden: true,
        },
        {
          key: 'usd',
          type: FieldType.Number,
          title: t('usd'),
          primary: true,
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'rate',
          type: FieldType.Number,
          title: t('rate'),
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
    try {
      const res = await context.fetch('https://api.exchangerate-api.com/v4/latest/CNY', { // 已经在addDomainList中添加为白名单的请求
        method: 'GET',
      }).then(res => res.json());
      const usdRate = res?.rates?.['USD'];
      return {
        code: FieldCode.Success,
        data: {
          id: `${Math.random()}`,
          usd: parseFloat((account * usdRate).toFixed(4)),
          rate: usdRate,
        }
      }
    } catch (e) {
      return {
        code: FieldCode.Error,
      }
    }
  },
});
export default basekit;