import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.example.com']);

basekit.addField({
  // 可选的授权。声明捷径需要 HeaderBearerToken APIKey 授权
  // authorizations: [
  //   {
  //     id: 'Outlook',
  //     platform: 'Outlook',
  //     label: 'Outlook',
  //     required:false,
  //     type: AuthorizationType.HeaderBearerToken,
  //     // 通过 instructionsUrl 向用户显示获取 APIKey 的地址
  //     instructionsUrl: 'https://www.feishu.cn/',
  //   }
  // ],
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        "param_source_label": "OCR 发票来源",
        "res_title_label": "发票抬头",
        "res_number_label": "发票票号",
        "res_date_label": "开票日期",
        "res_amount_label": "合计金额",
        "res_tax_label": "合计税额",
        "res_person_label": "收款人",
      },
      'en-US': {
      },
      'ja-JP': {
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'attachments',
      label: t('param_source_label'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
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
          key: 'title',
          type: FieldType.Text,
          title: t('res_title_label'),
        },
        {
          key: 'number',
          type: FieldType.Number,
          title: t('res_number_label'),
          primary: true,
          extra: {
            formatter: NumberFormatter.INTEGER,
          }
        },
        {
          key: 'date',
          type: FieldType.DateTime,
          title: t('res_date_label'),
          extra: {
            dateFormat: DateFormatter.DATE_TIME_WITH_HYPHEN
          }
        },
        {
          key: 'amount',
          type: FieldType.Number,
          title: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'tax',
          type: FieldType.Number,
          title: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'person',
          type: FieldType.Text,
          title: t('res_person_label'),
        },
      ],
    },
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
    const { attachments } = formItemParams;
    try {
      // 此处是 mock 的接口，你可以向你的业务接口请求
      await context.fetch('https://api.example.com', {
        method: 'POST',
        body: JSON.stringify({
          url: attachments?.[0]?.tmp_url,
        })
      }).then(res => res.json());
    } catch (e) {
      debugLog({
        '===未知错误': String(e)
      });

      /*
      由于无法返回向使用者透传错误信息，请勿返回msg、message之类的字段，它们并不会起作用，如果要避免直接报错，可将错误信息当作成功结果返回：
      */
      return {
        code: FieldCode.Success,
        data: {
          id: '发生未知错误' + String(e) + '\n请联系开发者',
          title: '-',
          number: 0,
          date: Date.now(),
          amount: 199.98,
          tax: 0,
          person: '-'
        }
      }
    }
  },
});
export default basekit;
