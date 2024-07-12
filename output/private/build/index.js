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
            id: 'Autodocs',
            platform: 'autodocs',
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
                    }, 'Autodocs')
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
                const dateStr = data?.InvoiceDate ?? '';
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
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
        return {
            code: block_basekit_server_api_1.FieldCode.ConfigError,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFTOEM7QUFDOUMsOERBQXNDO0FBRXRDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLDJCQUEyQjtBQUMzQixrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFFeEMsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixjQUFjLEVBQUU7UUFDZDtZQUNFLEVBQUUsRUFBRSxVQUFVO1lBQ2QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsNENBQWlCLENBQUMsb0JBQW9CO1lBQzVDLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxHQUFHLEVBQUUsV0FBVztvQkFDaEIsV0FBVyxFQUFFLGVBQWU7aUJBQzdCO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxlQUFlO29CQUNwQixXQUFXLEVBQUUsbUJBQW1CO2lCQUNqQzthQUNGO1lBQ0QsZUFBZSxFQUFFLGlEQUFpRDtTQUNuRTtLQUNGO0lBQ0QsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxrQkFBa0IsRUFBRSxVQUFVO2dCQUM5QixlQUFlLEVBQUUsTUFBTTtnQkFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtnQkFDeEIsY0FBYyxFQUFFLE1BQU07Z0JBQ3RCLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLGFBQWEsRUFBRSxNQUFNO2dCQUNyQixnQkFBZ0IsRUFBRSxLQUFLO2FBQ3hCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQixFQUFFLG9CQUFvQjtnQkFDeEMsZUFBZSxFQUFFLGVBQWU7Z0JBQ2hDLGdCQUFnQixFQUFFLGdCQUFnQjtnQkFDbEMsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLGdCQUFn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