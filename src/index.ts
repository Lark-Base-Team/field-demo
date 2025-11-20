import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

const { t } = field;

const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
basekit.addDomainList([...feishuDm, 'api.example.com']);

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
          label: 'id',
          hidden: true,
        },
        {
          key: 'title',
          type: FieldType.Text,
          label: t('res_title_label'),
        },
        {
          key: 'number',
          type: FieldType.Number,
          label: t('res_number_label'),
          primary: true,
          extra: {
            formatter: NumberFormatter.INTEGER,
          }
        },
        {
          key: 'date',
          type: FieldType.DateTime,
          label: t('res_date_label'),
          extra: {
            dateFormat: DateFormatter.DATE_TIME_WITH_HYPHEN
          }
        },
        {
          key: 'amount',
          type: FieldType.Number,
          label: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'tax',
          type: FieldType.Number,
          label: t('res_amount_label'),
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          }
        },
        {
          key: 'person',
          type: FieldType.Text,
          label: t('res_person_label'),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    // 获取入参 - 开发者可以根据自己的字段配置获取相应参数
    const { attachments } = formItemParams;

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

    // 入口第一行日志，展示formItemParams和context，方便调试
    // 每次修改版本时，都需要修改日志版本号，方便定位问题
    debugLog('=====start=====v1', true);

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
      code: number;
      data: {
        title?: string;
        number?: string | number;
        date?: string | number;
        amount?: number;
        tax?: number;
        person?: string;
      };
      error?: any;
    }

    try {
      // 1. 调用业务接口 - 开发者请修改为自己的实际接口地址和参数
      // 此处是 mock 的接口，你可以向你的业务OCR接口请求
      const res = await fetch<IResponse>('https://api.example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 建议添加正确的Content-Type
        },
        body: JSON.stringify({
          url: attachments?.[0]?.tmp_url || '', // 传递附件的临时URL给OCR服务
        })
      });

      // 2. 处理API响应
      if (res.code !== 0) {
        // API返回错误时的处理逻辑
        const errorMsg = res.error?.message || res.error || 'OCR服务调用失败';
        debugLog({ '===API错误': errorMsg });

        /*
        如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
        这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
        */
        return {
          code: FieldCode.Success,
          data: {
            id: Date.now().toString(), // 生成一个唯一ID
            title: `OCR处理失败: ${String(errorMsg)}\nlogid:${context.logID}`, // 清晰地显示错误原因
            number: 0,
            date: Date.now(),
            amount: 0,
            tax: 0,
            person: '-',
          },
        };
      }

      // 3. 处理成功响应 - 开发者需要根据自己的API返回结构提取数据
      const ocrData = (res as IResponse).data || {};

      /*
      提取并格式化OCR识别结果
      注意添加适当的默认值处理，确保即使某些字段未识别也能返回有效数据
      */
      return {
        code: FieldCode.Success,
        data: {
          id: Date.now().toString(), // 生成唯一ID
          title: ocrData.title || '未识别到发票抬头',
          number: ocrData.number || 0,
          date: ocrData.date || Date.now(),
          amount: typeof ocrData.amount === 'number' ? ocrData.amount : 0,
          tax: typeof ocrData.tax === 'number' ? ocrData.tax : 0,
          person: ocrData.person || '-',
        },
      };
    } catch (e) {
      // 4. 捕获未知错误 - 系统异常时的处理
      debugLog({
        '===999 未知错误': String(e)
      });

      /** 
       * 返回非 Success 的错误码，将会在单元格上显示报错
       * 请勿返回msg、message之类的字段，它们并不会起作用
       * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因
       */
      return {
        code: FieldCode.Error,
      };
    }
  },
});
export default basekit;