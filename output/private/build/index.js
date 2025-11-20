"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm, 'api.example.com']);
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
                    label: 'id',
                    hidden: true,
                },
                {
                    key: 'title',
                    type: block_basekit_server_api_1.FieldType.Text,
                    label: t('res_title_label'),
                },
                {
                    key: 'number',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_number_label'),
                    primary: true,
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.INTEGER,
                    }
                },
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    label: t('res_date_label'),
                    extra: {
                        dateFormat: block_basekit_server_api_1.DateFormatter.DATE_TIME_WITH_HYPHEN
                    }
                },
                {
                    key: 'amount',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'tax',
                    type: block_basekit_server_api_1.FieldType.Number,
                    label: t('res_amount_label'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'person',
                    type: block_basekit_server_api_1.FieldType.Text,
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
        // 入口第一行日志，展示formItemParams和context，方便调试
        // 每次修改版本时，都需要修改日志版本号，方便定位问题
        debugLog('=====start=====v1', true);
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
        try {
            // 1. 调用业务接口 - 开发者请修改为自己的实际接口地址和参数
            // 此处是 mock 的接口，你可以向你的业务OCR接口请求
            const res = await fetch('https://api.example.com', {
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
                    code: block_basekit_server_api_1.FieldCode.Success,
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
            const ocrData = res.data || {};
            /*
            提取并格式化OCR识别结果
            注意添加适当的默认值处理，确保即使某些字段未识别也能返回有效数据
            */
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
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
        }
        catch (e) {
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
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUV4RCxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLDJDQUEyQztJQUMzQyxvQkFBb0I7SUFDcEIsTUFBTTtJQUNOLHFCQUFxQjtJQUNyQiwyQkFBMkI7SUFDM0Isd0JBQXdCO0lBQ3hCLHNCQUFzQjtJQUN0QixpREFBaUQ7SUFDakQsK0NBQStDO0lBQy9DLGlEQUFpRDtJQUNqRCxNQUFNO0lBQ04sS0FBSztJQUNMLGdCQUFnQjtJQUNoQixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CLEVBQUUsVUFBVTtnQkFDaEMsaUJBQWlCLEVBQUUsTUFBTTtnQkFDekIsa0JBQWtCLEVBQUUsTUFBTTtnQkFDMUIsZ0JBQWdCLEVBQUUsTUFBTTtnQkFDeEIsa0JBQWtCLEVBQUUsTUFBTTtnQkFDMUIsZUFBZSxFQUFFLE1BQU07Z0JBQ3ZCLGtCQUFrQixFQUFFLEtBQUs7YUFDMUI7WUFDRCxPQUFPLEVBQUUsRUFDUjtZQUNELE9BQU8sRUFBRSxFQUNSO1NBQ0Y7S0FDRjtJQUNELFVBQVU7SUFDVixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxDQUFDLENBQUMsb0JBQW9CLENBQUM7WUFDOUIsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxLQUFL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