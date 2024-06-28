import { basekit, FieldType, field } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

basekit.addField({
  i18n: {
    messages: {
      'zh-CN': {
        popoverDesc: 'popover描述',
        attachmentLabel: '请选择附件字段',
        invoiceNumber: '发票号码',
        invoiceTitle: '发票抬头',
        invoiceDate: '开票日期',
        invoiceValue: '发票金额',
      },
    }
  },
  popover: {
    imageUrl: {
      light: {
        'zh-CN': 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
    },
    desc: t('popoverDesc'),
  },
  formItems: [
    {
      key: 'attachments',
      label: t('attachmentLabel'),
      component: 'FieldSelect',
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      }
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段、授权信息）
  execute: async (formItemParams, context) => {
    const { attachments } = formItemParams;

    // 您可以通过 context.fetch 向外请求数据
    // const res = await context.fetch('https://demo.api', {
    //   method: 'POSt',
    //   body: JSON.stringify({
    //     imageUrl: attachments.temp_url,
    //   }),
    // })

    const title = attachments?.[0]?.name;
    if (title?.includes('出租车')) {
      return {
        code: 0, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: {
          id: '133011940011',
          primaryProperty: 133011940011,
          title, // 发票抬头的实际值
          date: 1718678604284, // 发票日期
          amount: 100, // 发票金额
        },
      };
    }
    return {
      code: 0, // 0 表示请求成功
      // data 类型需与下方 resultType 定义一致
      data: {
        id: '1011002000211',
        primaryProperty: 1011002000211,
        title, // 发票抬头的实际值
        date: 1717678604284, // 发票日期
        amount: 208, // 发票金额
      },
    };
  },
  resultType: {
    icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
    type: FieldType.Object,
    properties: [
      {
        key: 'id',
        type: FieldType.Text,
        title: 'id',
        hidden: true,
      },
      {
        key: 'primaryProperty',
        type: FieldType.Number,
        title: t('invoiceNumber'),
        extra: {
          formatter: '0'
        }
      },
      {
        key: 'title',
        type: FieldType.Text,
        title: t('invoiceTitle'),
      },
      {
        key: 'date',
        type: FieldType.DateTime,
        title: t('invoiceDate'),
        extra: {
          dateFormat: 'yyyy/MM/dd',
        }
      },
      {
        key: 'amount',
        type: FieldType.Number,
        title: t('invoiceValue'),
        extra: {
          formatter: '0.00', // 保留两位小数
        },
      },
    ],
  },
});

export default basekit;
