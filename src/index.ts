import { basekit, FieldType } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'attachments',
      label: '请选择附件字段',
      component: 'FieldSelect',
      props: {
        supportType: [17],
      },
    },
  ],
  // params 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段、授权信息）
  execute: async (params, context) => {
    const { attachments } = params;
    const { fetch } = context;
    // const res = await fetch('https://demo.api', {
    //   method: 'POSt',
    //   body: JSON.stringify({
    //     imageUrl: attachments.temp_url,
    //   }),
    // })

    return {
      code: 0, // 0 表示请求成功
      // data 类型需与下方 resultType 定义一致
      data: {
        id: 'id',
        primaryProperty: 123,
        title: '发票抬头', // 发票抬头的实际值
        date: 1718678604284, // 发票日期
        amount: 100, // 发票金额
      },
    };
  },
  resultType: {
    icon: 'https://xxx.svg',
    propertyType: FieldType.Object,
    properties: [
      {
        key: 'id',
        propertyType: FieldType.Text,
        title: 'id',
      },
      {
        key: 'primaryProperty',
        propertyType: FieldType.Number,
        title: '发票号码',
      },
      {
        key: 'title',
        propertyType: FieldType.Text,
        title: '发票抬头',
      },
      {
        key: 'date',
        propertyType: FieldType.DateTime,
        title: '开票日期',
        extra: {
          dateFormat: 'yyyy/MM/dd',
        }
      },
      {
        key: 'amount',
        propertyType: FieldType.Number,
        title: '发票金额',
        extra: {
          formatter: '0.00', // 保留两位小数
        },
      },
    ],
  },
});

export default basekit;
