"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['api.example.com']);
block_basekit_server_api_1.basekit.addField({
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
            'en-US': {},
            'ja-JP': {},
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'attachments',
            label: t('param_source_label'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            }
        },
    ],
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
                    isGroupByKey: true,
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
                    }
                },
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    title: t('res_date_label'),
                    extra: {
                        dateFormat: block_basekit_server_api_1.DateFormatter.DATE_TIME_WITH_HYPHEN
                    }
                },
                {
                    key: 'amount',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'tax',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'person',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('res_person_label'),
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            // @ts-ignore
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }));
        }
        const { attachments } = formItemParams;
        try {
            // 此处是 mock 的接口，你可以向你的业务接口请求
            const res = await context.fetch('https://api.example.com', {
                method: 'POST',
                body: JSON.stringify({
                    url: attachments?.[0]?.tmp_url,
                })
            }).then(res => res.json());
            // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
            debugLog({
                '===1 接口返回结果': res
            });
            /*
            如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
            */
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: '-',
                    title: '详细错误原因：这只是一个示例。',
                    number: 0,
                    date: Date.now(),
                    amount: 0,
                    tax: 0,
                    person: '-',
                },
            };
        }
        catch (e) {
            debugLog({
                '===999 未知错误': String(e)
            });
            /** 返回非 Success 的错误码，将会在单元格上显示报错，请勿返回msg、message之类的字段，它们并不会起作用。
             * 对于未知错误，请直接返回 FieldCode.Error，然后通过查日志来排查错误原因。
             */
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBRTNDLGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsMkNBQTJDO0lBQzNDLG9CQUFvQjtJQUNwQixNQUFNO0lBQ04scUJBQXFCO0lBQ3JCLDJCQUEyQjtJQUMzQix3QkFBd0I7SUFDeEIsc0JBQXNCO0lBQ3RCLGlEQUFpRDtJQUNqRCwrQ0FBK0M7SUFDL0MsaURBQWlEO0lBQ2pELE1BQU07SUFDTixLQUFLO0lBQ0wsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxvQkFBb0IsRUFBRSxVQUFVO2dCQUNoQyxpQkFBaUIsRUFBRSxNQUFNO2dCQUN6QixrQkFBa0IsRUFBRSxNQUFNO2dCQUMxQixnQkFBZ0IsRUFBRSxNQUFNO2dCQUN4QixrQkFBa0IsRUFBRSxNQUFNO2dCQUMxQixlQUFlLEVBQUUsTUFBTTtnQkFDdkIsa0JBQWtCLEVBQUUsS0FBSzthQUMxQjtZQUNELE9BQU8sRUFBRSxFQUNSO1lBQ0QsT0FBTyxFQUFFLEVBQ1I7U0FDRjtLQUNGO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLGFBQWE7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztZQUM5QixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLFVBQVUsQ0FBQzthQUNwQztZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUUsSUFB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