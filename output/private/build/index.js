"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const querystring_1 = __importDefault(require("querystring"));
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'baidubce.com']);
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
        /**
         * 为方便查看日志，使用此方法替代console.log
         * 开发者可以直接使用这个工具函数进行日志记录
         */
        function debugLog(arg, showContext = false) {
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
        const fetch = async (url, init, authId) => {
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
            }
            catch (e) {
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
        ;
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
                const resAccessToken = await fetch('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }, 'baidu' // 修改../config.json中的authorizations为你自己的client_id和client_secret即可调试authorizations。捷径调试阶段无法看到授权的ui组件。上线之后才能正常显示。
                );
                if (resAccessToken.code === -1 || !resAccessToken.access_token) {
                    /*
                    如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
                    这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
                    */
                    const errorMsg = resAccessToken.error_msg || resAccessToken.error || JSON.stringify(resAccessToken);
                    return {
                        code: block_basekit_server_api_1.FieldCode.Success,
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
                const ocrResponse = await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice?access_token=${accessToken}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                    },
                    body: querystring_1.default.stringify({
                        url: imageUrl,
                        seal_tag: 'false',
                    }),
                });
                // 检查API调用是否成功
                if (ocrResponse.code === -1 || ocrResponse.error_msg) {
                    const errorMsg = ocrResponse.error_msg || ocrResponse.error || 'OCR识别失败';
                    /*
                    如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
                    这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
                    */
                    return {
                        code: block_basekit_server_api_1.FieldCode.Success,
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
                    code: block_basekit_server_api_1.FieldCode.Success,
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
        }
        catch (e) {
            // 错误处理 - 开发者可以根据需要添加更详细的错误处理逻辑
            debugLog({
                '====999 未知错误': String(e)
            });
            /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
             * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
             * 开发者注意：如需展示自定义错误信息，请在catch块中处理并将错误信息作为成功结果返回
             */
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
        debugLog('===99 未识别到附件');
        /*
          如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
          这样用户界面会显示结果而不是报错，但可以通过结果内容知道发生了什么问题
          */
        return {
            code: block_basekit_server_api_1.FieldCode.Success,
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
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            properties: [
                {
                    key: 'id',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: 'id',
                    hidden: true,
                },
                {
                    key: 'title',
                    type: block_basekit_server_api_1.FieldType.Text,
                    isGroupByKey: true,
                    label: t('res_title_label'),
                },
                {
                    key: 'number',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_number_label'),
                    primary: true,
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.INTEGER,
                    },
                },
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    label: t('res_date_label'),
                    extra: {
                        dateFormat: block_basekit_server_api_1.DateFormatter.DATE_TIME_WITH_HYPHEN,
                    },
                },
                {
                    key: 'amount',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                },
                {
                    key: 'tax',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_tax_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                },
                {
                    key: 'person',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('res_person_label'),
                },
            ],
        },
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtRkFTOEM7QUFDOUMsOERBQXNDO0FBRXRDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxnQ0FBSyxDQUFDO0FBRXBCLE1BQU0sUUFBUSxHQUFHLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNyRixxREFBcUQ7QUFDckQsa0NBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBRXJELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsY0FBYyxFQUFFO1FBQ2Q7WUFDRSxFQUFFLEVBQUUsT0FBTztZQUNYLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLDRDQUFpQixDQUFDLG9CQUFvQjtZQUM1QyxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsR0FBRyxFQUFFLFdBQVc7b0JBQ2hCLFdBQVcsRUFBRSxlQUFlO2lCQUM3QjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsZUFBZTtvQkFDcEIsV0FBVyxFQUFFLG1CQUFtQjtpQkFDakM7YUFDRjtZQUNELGVBQWUsRUFBRSxpREFBaUQ7WUFDbEUsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSw2RUFBNkU7Z0JBQ3BGLElBQUksRUFBRSw2RUFBNkU7YUFDcEY7U0FDRjtLQUNGO0lBQ0QsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxrQkFBa0IsRUFBRSxVQUFVO2dCQUM5QixlQUFlLEVBQUUsTUFBTTtnQkFDdkIsZ0JBQWdCLEVBQUUsTUFBTTtnQkFDeEIsY0FBYyxFQUFFLE1BQU07Z0JBQ3RCLGdCQUFnQixFQUFFLE1BQU07Z0JBQ3hCLGFBQWEsRUFBRSxN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