"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': {
                popoverDesc: 'popover描述',
                attachmentLabel: '请选择附件字段',
                invoiceNumber: '发票号码',
                invoiceTitle: '发票抬头',
                invoiceDate: '开票日期',
                invoiceValue: '发票金额',
            },
        }
    },
    popover: {
        imageUrl: {
            light: {
                'zh-CN': 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
        },
        desc: t('popoverDesc'),
    },
    formItems: [
        {
            key: 'attachments',
            label: t('attachmentLabel'),
            component: 'FieldSelect',
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Attachment],
            },
            validator: {
                required: true,
            }
        },
    ],
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段、授权信息）
    execute: async (formItemParams, context) => {
        const { attachments } = formItemParams;
        // 您可以通过 context.fetch 向外请求数据
        // const res = await context.fetch('https://demo.api', {
        //   method: 'POSt',
        //   body: JSON.stringify({
        //     imageUrl: attachments.temp_url,
        //   }),
        // })
        const title = attachments?.[0]?.name;
        if (title.includes('出租车')) {
            return {
                code: 0, // 0 表示请求成功
                // data 类型需与下方 resultType 定义一致
                data: {
                    id: '133011940011',
                    primaryProperty: 133011940011,
                    title, // 发票抬头的实际值
                    date: 1718678604284, // 发票日期
                    amount: 100, // 发票金额
                },
            };
        }
        return {
            code: 0, // 0 表示请求成功
            // data 类型需与下方 resultType 定义一致
            data: {
                id: '1011002000211',
                primaryProperty: 1011002000211,
                title, // 发票抬头的实际值
                date: 1717678604284, // 发票日期
                amount: 208, // 发票金额
            },
        };
    },
    resultType: {
        icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
        type: block_basekit_server_api_1.FieldType.Object,
        properties: [
            {
                key: 'id',
                type: block_basekit_server_api_1.FieldType.Text,
                title: 'id',
                hidden: true,
            },
            {
                key: 'primaryProperty',
                type: block_basekit_server_api_1.FieldType.Number,
                title: t('invoiceNumber'),
                extra: {
                    formatter: '0'
                }
            },
            {
                key: 'title',
                type: block_basekit_server_api_1.FieldType.Text,
                title: t('invoiceTitle'),
            },
            {
                key: 'date',
                type: block_basekit_server_api_1.FieldType.DateTime,
                title: t('invoiceDate'),
                extra: {
                    dateFormat: 'yyyy/MM/dd',
                }
            },
            {
                key: 'amount',
                type: block_basekit_server_api_1.FieldType.Number,
                title: t('invoiceValue'),
                extra: {
                    formatter: '0.00', // 保留两位小数
                },
            },
        ],
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBaUY7QUFFakYsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixhQUFhLEVBQUUsTUFBTTtnQkFDckIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixZQUFZLEVBQUUsTUFBTTthQUNyQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxRQUFRLEVBQUU7WUFDUixLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFLDZFQUE2RTthQUN2RjtTQUNGO1FBQ0QsSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUM7S0FDdkI7SUFDRCxTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUM7WUFDM0IsU0FBUyxFQUFFLGFBQWE7WUFDeEIsS0FBSyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxDQUFDLG9DQUFTLENBQUMsVUFBVSxDQUFDO2FBQ3BDO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0lBQ0QsZ0VBQWdFO0lBQ2hFLE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ3pDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxjQUFjLENBQUM7UUFFdkMsNkJBQTZCO1FBQzdCLHdEQUF3RDtRQUN4RCxvQkFBb0I7UUFDcEIsMkJBQTJCO1FBQzNCLHNDQUFzQztRQUN0QyxRQUFRO1FBQ1IsS0FBSztRQUVMLE1BQU0sS0FBSyxHQUFHLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztRQUNyQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUMxQixPQUFPO2dCQUNMLElBQUksRUFBRSxDQUFDLEVBQUUsV0FBVztnQkFDcEIsOEJBQThCO2dCQUM5QixJQUFJLEVBQUU7b0JBQ0osRUFBRSxFQUFFLGNBQWM7b0JBQ2xCLGVBQWUsRUFBRSxZQUFZO29CQUM3QixLQUFLLEVBQUUsV0FBVztvQkFDbEIsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPO29CQUM1QixNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU87aUJBQ3JCO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFXO1lBQ3BCLDhCQUE4QjtZQUM5QixJQUFJLEVBQUU7Z0JBQ0osRUFBRSxFQUFFLGVBQWU7Z0JBQ25CLGVBQWUsRUFBRSxhQUFhO2dCQUM5QixLQUFLLEVBQUUsV0FBVztnQkFDbEIsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPO2dCQUM1QixNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU87YUFDckI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSw2RUFBNkU7UUFDbkYsSUFBSSxFQUFFLG9DQUFTLENBQUMsTUFBTTtRQUN0QixVQUFVLEVBQUU7WUFDVjtnQkFDRSxHQUFHLEVBQUUsSUFBSTtnQkFDVCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO2dCQUNwQixLQUFLLEVBQUUsSUFBSTtnQkFDWCxNQUFNLEVBQUUsSUFBSTthQUNiO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtnQkFDdEIsSUFBSSxFQUFFLG9DQUFTLENBQUMsTUFBTTtnQkFDdEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUM7Z0JBQ3pCLEtBQUssRUFBRTtvQkFDTCxTQUFTLEVBQUUsR0FBRztpQkFDZjthQUNGO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLE9BQU87Z0JBQ1osSUFBSSxFQUFFLG9DQUFTLENBQUMsSUFBSTtnQkFDcEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUM7YUFDekI7WUFDRDtnQkFDRSxHQUFHLEVBQUUsTUFBTTtnQkFDWCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxRQUFRO2dCQUN4QixLQUFLLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztnQkFDdkIsS0FBSyxFQUFFO29CQUNMLFVBQVUsRUFBRSxZQUFZO2lCQUN6QjthQUNGO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLFFBQVE7Z0JBQ2IsSUFBSSxFQUFFLG9DQUFTLENBQUMsTUFBTTtnQkFDdEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUM7Z0JBQ3hCLEtBQUssRUFBRTtvQkFDTCxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVM7aUJBQzdCO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsa0NBQU8sQ0FBQyJ9