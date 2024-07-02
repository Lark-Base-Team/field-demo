import { basekit, FieldType, field, FieldComponent, AuthorizationType, FieldCode } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

basekit.addField({
  authorizations: [
    {
      id: 'nolibox',
      type: AuthorizationType.Basic,
      params: {
        usernamePlaceholder: '请输入用户名',
        passwordPlaceholder: '请输入密码',
      }
    }
  ],
  i18n: {
    messages: {
      'zh': {
        scene: '场景',
        library: '图书馆',
        popoverDesc: 'popover描述',
        attachmentLabel: '请选择附件字段',
        token: '附件 token',
        name: '附件名称',
        size: '附件尺寸',
        date: '附件时间戳',
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
    console.log("🚀 ~ execute: ~ formItemParams, context:", formItemParams, context)
    const { scene, attachments } = formItemParams;
    try {
      await context.fetch('htts://demo.api', {}, 'nolibox');
    } catch(e) {
      console.log(e);
    }
    const attachment = attachments?.[0];
    if (attachment) {
      return {
        code: FieldCode.Success, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: {
          id: attachment.token, // 附件 token
          primaryProperty: attachment.token,
          name: attachment.name, // 附件名称
          size: attachment.size, // 附件尺寸
          date: attachment.timeStamp, // 附件时间戳
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
      icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      tips: {
        imageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
        desc: t('popoverDesc'),
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
          type: FieldType.Text,
          title: t('token'),
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
            formatter: '0.00', // 保留两位小数
          },
        },
        {
          key: 'date',
          type: FieldType.DateTime,
          title: t('date'),
          extra: {
            dateFormat: 'yyyy/MM/dd',
          }
        },
      ],
    },
  },
});

export default basekit;
