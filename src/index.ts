import { basekit, FieldType, field, FieldComponent } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

basekit.addField({
  i18n: {
    messages: {
      'zh': {
        scene: '场景',
        library: '图书馆',
        popoverDesc: 'popover描述',
        attachmentLabel: '请选择附件字段',
        invoiceNumber: '发票号码',
        invoiceTitle: '发票抬头',
        invoiceDate: '开票日期',
        invoiceValue: '发票金额',
      },
    }
  },
  formItems: [
    {
      key: 'scene',
      label: t('scene'),
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: t('library'), value: 'library' },
        ]
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'attachments',
      label: t('attachmentLabel'),
      component: FieldComponent.FieldSelect,
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
    const { apikey, attachments } = formItemParams;

    // 您可以通过 context.fetch 向外请求数据
    // const res = await context.fetch('https://demo.api', {
    //   method: 'POSt',
    //   body: JSON.stringify({
    //     imageUrl: attachments.temp_url,
    //   }),
    // })

    return {
      code: 0, // 0 表示请求成功
      // data 类型需与下方 resultType 定义一致
      data: {
        id: 1011002000211,
        primaryProperty: 1011002000211,
        number: 1011002000211,
        title: attachments?.[0]?.name, // 发票抬头的实际值
        date: 1717678604284, // 发票日期
        amount: 2081121, // 发票金额
      },
    };
  },
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      tips: {
        imageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
        desc: '我是描述',
      },
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
          primary: true,
          extra: {
            formatter: '0'
          },
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
  },
});

export default basekit;
