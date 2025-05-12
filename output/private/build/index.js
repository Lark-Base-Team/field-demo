"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const querystring_1 = __importDefault(require("querystring"));
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['baidubce.com']);
block_basekit_server_api_1.basekit.addField({
    authorizations: [
        {
            id: 'baidu',
            platform: 'baidu',
            label: 'OCR',
            type: block_basekit_server_api_1.AuthorizationType.MultiQueryParamToken,
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
            component: block_basekit_server_api_1.FieldComponent.Radio,
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
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            },
        },
    ],
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        const { flag, attachments } = formItemParams;
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }));
        }
        try {
            if (attachments?.[0]) {
                // 目前 boe 的附件地址外部无法取到，所以先写死固定的url
                // const imageUrl = attachments?.[0]?.tmp_url;
                const imageUrl = flag?.value === 'true' && attachments?.[0]?.tmp_url
                    ? attachments?.[0]?.tmp_url
                    : 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/发票.jpg';
                const getAccessToken = async () => {
                    const res = await context
                        .fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials', {
                        method: 'POST',
                    }, 'baidu')
                        .then(res => res.json());
                    return res.access_token;
                };
                const accessToken = await getAccessToken();
                const res = await context
                    .fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice?access_token=${accessToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                    body: querystring_1.default.stringify({
                        url: imageUrl,
                        seal_tag: 'false',
                    }),
                })
                    .then(res => res.json());
                const data = res?.words_result;
                if (res.error_msg) {
                    throw res.error_msg;
                }
                const dateStr = data?.InvoiceDate ?? '';
                // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
                debugLog({
                    '===1 res': res
                });
                const formattedStr = dateStr
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '');
                const timestamp = +(new Date(formattedStr));
                return {
                    code: block_basekit_server_api_1.FieldCode.Success,
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
        }
        catch (e) {
            debugLog({
                '====999 未知错误': String(e)
            });
            /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
             * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
             */
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
        debugLog('===99 未识别到附件');
        /*
          如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
          */
        return {
            code: block_basekit_server_api_1.FieldCode.Success,
            data: {
                id: '-',
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
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            properties: [
                {
                    key: 'id',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: 'id',
                    hidden: true,
                },
                {
                    key: 'title',
                    type: block_basekit_server_api_1.FieldType.Text,
                    isGroupByKey: true,
                    title: t('res_title_label'),
                },
                {
                    key: 'number',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('res_number_label'),
                    primary: true,
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.INTEGER,
                    },
                },
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    title: t('res_date_label'),
                    extra: {
                        dateFormat: block_basekit_server_api_1.DateFormatter.DATE_TIME_WITH_HYPHEN,
                    },
                },
                {
                    key: 'amount',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                },
                {
                    key: 'tax',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('res_tax_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                },
                {
                    key: 'person',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('res_person_label'),
                },
            ],
        },
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFTOEM7QUFDOUMsOERBQXNDO0FBRXRDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLDJCQUEyQjtBQUMzQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFFeEMsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixjQUFjLEVBQUU7UUFDZDtZQUNFLEVBQUUsRUFBRSxPQUFPO1lBQ1gsUUFBUSxFQUFFLE9BQU87WUFDakIsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsNENBQWlCLENBQUMsb0JBQW9CO1lBQzVDLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxHQUFHLEVBQUUsV0FBVztvQkFDaEIsV0FBVyxFQUFFLGVBQWU7aUJBQzdCO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxlQUFlO29CQUNwQixXQUFXLEVBQUUsbUJBQW1CO2lCQUNqQzthQUNGO1lBQ0QsZUFBZSxFQUFFLGlEQUFpRDtZQUNsRSxJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLDZFQUE2RTtnQkFDcEYsSUFBSSxFQUFFLDZFQUE2RTthQUNwRjtTQUNGO0tBQ0Y7SUFDRCxnQkFBZ0I7SUFDaEIsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQixFQUFFLFVBQVU7Z0JBQzlCLGVBQWUsRUFBRSxNQUFNO2dCQUN2QixnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixjQUFjLEVBQUUsTUFBTTtnQkFDdEIsZ0JBQWdCLEVBQUUsTUFBTTtnQkFDeEIsYUFBYSxFQUFFLE1BQU07Z0JBQ3JCLGdCQUFnQixFQUFFLEtBQUs7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1Asa0JBQWtCLEVBQUUsb0JBQW9CO2dCQUN4QyxlQUFlLEVB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