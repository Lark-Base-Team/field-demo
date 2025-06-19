"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(['api.exchangerate-api.com']);
block_basekit_server_api_1.basekit.addField({
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            'zh-CN': {
                'rmb': '人民币金额',
                'usd': '美元金额',
                'rate': '汇率',
            },
            'en-US': {
                'rmb': 'RMB Amount',
                'usd': 'Dollar amount',
                'rate': 'Exchange Rate',
            },
            'ja-JP': {
                'rmb': '人民元の金額',
                'usd': 'ドル金額',
                'rate': '為替レート',
            },
        }
    },
    // 定义捷径的入参
    formItems: [
        {
            key: 'account',
            label: t('rmb'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number],
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
                    key: 'usd',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('usd'),
                    primary: true,
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    }
                },
                {
                    key: 'rate',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('rate'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_4,
                    }
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        const { account = 0 } = formItemParams;
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            // @ts-ignore
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }));
        }
        try {
            const res = await context.fetch('https://api.exchangerate-api.com/v4/latest/CNY', {
                method: 'GET',
            }).then(res => res.json());
            const usdRate = res?.rates?.['USD'];
            // 请避免使用 debugLog(res) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
            debugLog({
                '===1 接口返回结果': res
            });
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: `${Math.random()}`,
                    usd: parseFloat((account * usdRate).toFixed(4)),
                    rate: usdRate,
                }
            };
            /*
              如果错误原因明确，想要向使用者传递信息，要避免直接报错，可将错误信息当作成功结果返回：
      
            return {
              code: FieldCode.Success,
              data: {
                id: `具体错误原因`,
                usd: 0,
                rate: 0,
              }
            }
      
            */
        }
        catch (e) {
            console.log('====error', String(e));
            debugLog({
                '===999 异常错误': String(e)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRXBELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsT0FBTztnQkFDZCxLQUFLLEVBQUUsTUFBTTtnQkFDYixNQUFNLEVBQUUsSUFBSTthQUNiO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxZQUFZO2dCQUNuQixLQUFLLEVBQUUsZUFBZTtnQkFDdEIsTUFBTSxFQUFFLGVBQWU7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsTUFBTSxFQUFFLE9BQU87YUFDaEI7U0FDRjtLQUNGO0lBQ0QsVUFBVTtJQUNWLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLFNBQVM7WUFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNmLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsS0FBSyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxDQUFDLG9DQUFTLENBQUMsTUFBTSxDQUFDO2FBQ2hDO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0lBQ0QsY0FBYztJQUNkLFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxvQ0FBUyxDQUFDLE1BQU07UUFDdEIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSw2RUFB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