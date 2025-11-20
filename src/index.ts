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

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'baidubce.com']);

basekit.addField({
  authorizations: [
    {
      id: 'baidu',
      platform: 'baidu',
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
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
        dark: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      }
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
  execute: async (formItemParams: { flag: { value: string }, attachments: { tmp_url: string }[] }, context) => {
    const { flag, attachments } = formItemParams;
    /** 
     * 为方便查看日志，使用此方法替代console.log
     * 开发者可以直接使用这个工具函数进行日志记录
     */
    function debugLog(arg: any, showContext = false) {
      // @ts-ignore
      if (!showContext) {
        console.log(JSON.stringify({ arg, logID: context.logID }), '\n');
        return;
      }
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }), '\n');
    }

    /** 
     * 封装好的fetch函数 - 开发者请尽量使用这个封装，而不是直接调用context.fetch
     * 这个封装会自动处理日志记录和错误捕获，简化开发工作
     */
    const fetch: <T = Object>(...arg: Parameters<typeof context.fetch>) => Promise<T | { code: number, error: any, [p: string]: any }> = async (url, init, authId) => {
      try {
        const res = await context.fetch(url, init, authId);
        // 不要直接.json()，因为接口返回的可能不是json格式，会导致解析错误
        const resText = await res.text();

        // 自动记录请求结果日志
        debugLog({
          [`===fetch res： ${url} 接口返回结果`]: {
            url,
            init,
            authId,
            resText: resText.slice(0, 4000), // 截取部分日志避免日志量过大
          }
        });

        return JSON.parse(resText);
      } catch (e) {
        // 自动记录错误日志
        debugLog({
          [`===fetch error： ${url} 接口返回错误`]: {
            url,
            init,
            authId,
            error: e
          }
        });
        return {
          code: -1,
          error: e
        };
      }
    };

    /**
     * 定义接口返回结果的类型
     * 开发者可以根据自己的API返回结构修改此接口定义
     */
    interface IResponse {
      code?: number;
      error_msg?: string;
      error?: any;
      words_result?: {
        InvoiceNum?: string;
        PurchaserName?: string;
        InvoiceDate?: string;
        TotalAmount?: string;
        TotalTax?: string;
        Payee?: string;
      };
    };
    // 入口第一行日志，展示formItemParams和context，方便调试
    // 每次修改版本时，都需要修改日志版本号，方便定位问题
    debugLog('=====start=====v1', true);

    try {
      if (attachments?.[0]) {
        // 目前 boe 的附件地址外部无法取到，所以先写死固定的url
        // const imageUrl = attachments?.[0]?.tmp_url;
        const imageUrl = flag?.value === 'true' && attachments?.[0]?.tmp_url
          ? attachments[0].tmp_url
          : 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/发票.jpg';

        // 获取百度AI的access_token
        const resAccessToken: any = await fetch(
          'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          },
          'baidu'// 修改../config.json中的authorizations为你自己的client_id和client_secret即可调试authorizations。捷径调试阶段无法看到授权的ui组件。上线之后才能正常显示。
        );

        if (resAccessToken.code === -1 || !resAccessToken.access_token) {
          /*
          如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
          这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
          */
          const errorMsg = resAccessToken.error_msg || resAccessToken.error || JSON.stringify(resAccessToken);
          return {
            code: FieldCode.Success,
            data: {
              id: Date.now().toString(),
              title: `获取百度AI Token失败: ${errorMsg}\nlogid:${context.logID}`,
              number: 0,
              date: Date.now(),
              amount: 0,
              tax: 0,
              person: '-',
            },
          };
        }

        const accessToken = await resAccessToken.access_token;

        // 调用百度OCR API识别发票 - 开发者可以修改为自己的OCR服务地址
        const ocrResponse = await fetch<IResponse>(
          `https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice?access_token=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json',
            },
            body: querystring.stringify({
              url: imageUrl,
              seal_tag: 'false',
            }),
          }
        );

        // 检查API调用是否成功
        if (ocrResponse.code === -1 || ocrResponse.error_msg) {
          const errorMsg = ocrResponse.error_msg || ocrResponse.error || 'OCR识别失败';

          /*
          如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
          这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
          */
          return {
            code: FieldCode.Success,
            data: {
              id: Date.now().toString(),
              title: `OCR处理失败: ${errorMsg}\nlogid:${context.logID}`,
              number: 0,
              date: Date.now(),
              amount: 0,
              tax: 0,
              person: '-',
            },
          };
        }

        // 处理和格式化识别结果
        const data = ocrResponse?.words_result || {};
        const dateStr = data?.InvoiceDate || '';

        // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
        debugLog({
          '===1 res': ocrResponse
        });

        const formattedStr = dateStr
          .replace('年', '-')
          .replace('月', '-')
          .replace('日', '');
        const timestamp = formattedStr ? +(new Date(formattedStr)) : Date.now();

        /*
        提取并格式化OCR识别结果
        注意添加适当的默认值处理，确保即使某些字段未识别也能返回有效数据
        */
        return {
          code: FieldCode.Success,
          data: {
            id: data?.InvoiceNum || Date.now().toString(),
            title: data?.PurchaserName || '',
            number: Number.parseInt(data?.InvoiceNum || '0', 10),
            date: timestamp,
            amount: Number.parseFloat(data?.TotalAmount || '0'),
            tax: data?.TotalTax ? Number.parseFloat(data?.TotalTax.replace(/[^\d.]/g, '')) : 0,
            person: data?.Payee || '',
          },
        };
      }
    } catch (e) {
      // 错误处理 - 开发者可以根据需要添加更详细的错误处理逻辑
      debugLog({
        '====999 未知错误': String(e)
      });

      /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
       * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
       * 开发者注意：如需展示自定义错误信息，请在catch块中处理并将错误信息作为成功结果返回
       */
      return {
        code: FieldCode.Error,
      };
    }

    debugLog('===99 未识别到附件');

    /*
      如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
      这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
      */
    return {
      code: FieldCode.Success,
      data: {
        id: Date.now().toString(),
        title: '未识别到附件。',
        number: 0,
        date: Date.now(),
        amount: 0,
        tax: 0,
        person: '-',
      },
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
          label: 'id',
          hidden: true,
        },
        {
          key: 'title',
          type: FieldType.Text,
          isGroupByKey: true,
          label: t('res_title_label'),
        },
        {
          key: 'number',
          type: FieldType.Number,
          label: t('res_number_label'),
          primary: true,
          extra: {
            formatter: NumberFormatter.INTEGER,
          },
        },
        {
          key: 'date',
          type: FieldType.DateTime,
          label: t('res_date_label'),
          extra: {
            dateFormat: DateFormatter.DATE_TIME_WITH_HYPHEN,
          },
        },
        {
          key: 'amount',
          type: FieldType.Number,
          label: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },
        },
        {
          key: 'tax',
          type: FieldType.Number,
          label: t('res_tax_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },
        },
        {
          key: 'person',
          type: FieldType.Text,
          label: t('res_person_label'),
        },
      ],
    },
  },
});
export default basekit;