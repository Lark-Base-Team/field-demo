import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

basekit.addField({
  i18n: {
    messages: {
      'zh-CN': {
        attachmentLabel: '请选择附件字段',
        url: '附件地址',
        name: '附件名称',
        size: '附件尺寸',
      },
      'en-US': {},
      'ja-JP': {},
    }
  },
  formItems: [
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
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { attachments } = formItemParams;
    const attachment = attachments?.[0];
    if (attachment) {

      return {
        code: FieldCode.Success, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: {
          id: attachment.tmp_url ?? '', //  附件临时 url
          url: attachment.tmp_url ?? '', // 附件临时 url
          name: attachment?.name, // 附件名称
          size: attachment?.size, // 附件尺寸
        },
      };
    }
    return {
      code: FieldCode.Error,
    };
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
          title: 'id',
          hidden: true,
        },
        {
          key: 'url',
          type: FieldType.Text,
          title: t('url'),
          primary: true,
        },
        {
          key: 'name',
          type: FieldType.Text,
          title: t('name'),
        },
        {
          key: 'size',
          type: FieldType.Number,
          title: t('size'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_1, // 保留两位小数
          },
        },
      ],
    },
  },
});

export default basekit;
