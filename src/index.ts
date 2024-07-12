import {
  basekit,
  FieldType,
  field,
  FieldComponent,
  FieldCode,
  NumberFormatter,
  DateFormatter,
  AuthorizationType,
} from '@lark-opdev/block-basekit-server-api';
import querystring from 'querystring';
import dayjs from 'dayjs';

const { t } = field;

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['baidubce.com']);

basekit.addField({
  authorizations: [
    {
      id: 'Autodocs',
      platform: 'autodocs',
      label: 'OCR',
      type: AuthorizationType.MultiQueryParamToken,
      params: [
        {
          key: 'client_id',
          placeholder: '请输入 client_id',
        },
        {
          key: 'client_secret',
          placeholder: '请输入 client_secret'
        }
      ],
      instructionsUrl: 'https://ai.baidu.com/ai-doc/REFERENCE/Ck3dwjhhu',
    }
  ],
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        param_source_label: 'OCR 发票来源',
        res_title_label: '发票抬头',
        res_number_label: '发票票号',
        res_date_label: '开票日期',
        res_amount_label: '合计金额',
        res_tax_label: '合计税额',
        res_person_label: '收款人',
      },
      'en-US': {
        param_source_label: 'OCR Invoice Source',
        res_title_label: 'Invoice Title',
        res_number_label: 'Invoice Number',
        res_date_label: 'Invoice Date',
        res_amount_label: 'Total Amount',
        res_tax_label: 'Total Tax',
        res_person_label: 'Payee',
      },
      'ja-JP': {
        param_source_label: 'OCR 請求書のソース',
        res_title_label: '請求書のタイトル',
        res_number_label: '請求書番号',
        res_date_label: '請求日',
        res_amount_label: '合計金額',
        res_tax_label: '合計税金',
        res_person_label: '受取人',
      },
    },
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'flag',
      label: '附件来源',
      component: FieldComponent.Radio,
      props: {
        options: [
          {
            value: 'false',
            label: '使用固定url'
          },
          {
            value: 'true',
            label: '使用附件',
          },
        ],
      },
      validator: {
        required: true,
      },
      defaultValue: 'false',
    },
    {
      key: 'attachments',
      label: t('param_source_label'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { flag: {value: string}, attachments: { tmp_url: string }[]}, context) => {
    const { flag, attachments } = formItemParams;

    try {
      if (attachments?.[0]) {
        // 目前 boe 的附件地址外部无法取到，所以先写死固定的url
        // const imageUrl = attachments?.[0]?.tmp_url;
        const imageUrl = flag?.value === 'true' && attachments?.[0]?.tmp_url
          ? attachments?.[0]?.tmp_url
          : 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/发票.jpg';
        const getAccessToken = async () => {
          const res = await context
            .fetch(
              'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials',
              {
                method: 'POST',
              },
              'Autodocs'
            )
            .then(res => res.json());
          return res.access_token;
        };
        const accessToken = await getAccessToken();
        const res = await context
          .fetch(
            `https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice?access_token=${accessToken}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
              },
              body: querystring.stringify({
                url: imageUrl,
                seal_tag: 'false',
              }),
            }
          )
          .then(res => res.json());
        const data = res?.words_result;
        const dateStr = data?.InvoiceDate ?? '';
        const formattedStr = dateStr
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '');
        const timestamp = dayjs(formattedStr).unix();

        return {
          code: FieldCode.Success,
          data: {
            id: data?.InvoiceNum ?? '',
            title: data?.PurchaserName ?? '',
            number: Number.parseInt(data?.InvoiceNum, 10),
            date: timestamp,
            amount: Number.parseFloat(data?.TotalAmount),
            tax: Number.parseFloat(data?.TotalTax.slice(1)),
            person: data?.Payee ?? '',
          },
        };
      }
    } catch (e) {
      return {
        code: FieldCode.Error,
      };
    }
    return {
      code: FieldCode.ConfigError,
    };
  },
  // 定义捷径的返回结果类型
  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light:
          'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        {
          key: 'id',
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
          },
        },
        {
          key: 'date',
          type: FieldType.DateTime,
          title: t('res_date_label'),
          extra: {
            dateFormat: DateFormatter.DATE_TIME_WITH_HYPHEN,
          },
        },
        {
          key: 'amount',
          type: FieldType.Number,
          title: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },
        },
        {
          key: 'tax',
          type: FieldType.Number,
          title: t('res_tax_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },
        },
        {
          key: 'person',
          type: FieldType.Text,
          title: t('res_person_label'),
        },
      ],
    },
  },
});
export default basekit;
