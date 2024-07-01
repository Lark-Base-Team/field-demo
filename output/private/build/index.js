"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh': {
                scene: '场景',
                library: '图书馆',
                popoverDesc: 'popover描述',
                attachmentLabel: '请选择附件字段',
                invoiceNumber: '发票号码',
                invoiceTitle: '发票抬头',
                invoiceDate: '开票日期',
                invoiceValue: '发票金额',
            },
        }
    },
    formItems: [
        {
            key: 'scene',
            label: t('scene'),
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            props: {
                options: [
                    { label: t('library'), value: 'library' },
                ]
            },
            validator: {
                required: true,
            }
        },
        {
            key: 'attachments',
            label: t('attachmentLabel'),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
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
        const { apikey, attachments } = formItemParams;
        // 您可以通过 context.fetch 向外请求数据
        // const res = await context.fetch('https://demo.api', {
        //   method: 'POSt',
        //   body: JSON.stringify({
        //     imageUrl: attachments.temp_url,
        //   }),
        // })
        return {
            code: 0, // 0 表示请求成功
            // data 类型需与下方 resultType 定义一致
            data: {
                id: 1011002000211,
                primaryProperty: 1011002000211,
                number: 1011002000211,
                title: attachments?.[0]?.name, // 发票抬头的实际值
                date: 1717678604284, // 发票日期
                amount: 2081121, // 发票金额
            },
        };
    },
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            tips: {
                imageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
                desc: '我是描述',
            },
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
                    primary: true,
                    extra: {
                        formatter: '0'
                    },
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
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBaUc7QUFFakcsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixhQUFhLEVBQUUsTUFBTTtnQkFDckIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFdBQVcsRUFBRSxNQUFNO2dCQUNuQixZQUFZLEVBQUUsTUFBTTthQUNyQjtTQUNGO0tBQ0Y7SUFDRCxTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxPQUFPO1lBQ1osS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDakIsU0FBUyxFQUFFLHlDQUFjLENBQUMsWUFBWTtZQUN0QyxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFO29CQUNQLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2lCQUMxQzthQUNGO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtRQUNEO1lBQ0UsR0FBRyxFQUFFLGFBQWE7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztZQUMzQixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLFVBQVUsQ0FBQzthQUNwQztZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtJQUNELGdFQUFnRTtJQUNoRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN6QyxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLGNBQWMsQ0FBQztRQUUvQyw2QkFBNkI7UUFDN0Isd0RBQXdEO1FBQ3hELG9CQUFvQjtRQUNwQiwyQkFBMkI7UUFDM0Isc0NBQXNDO1FBQ3RDLFFBQVE7UUFDUixLQUFLO1FBRUwsT0FBTztZQUNMLElBQUksRUFBRSxDQUFDLEVBQUUsV0FBVztZQUNwQiw4QkFBOEI7WUFDOUIsSUFBSSxFQUFFO2dCQUNKLEVBQUUsRUFBRSxhQUFhO2dCQUNqQixlQUFlLEVBQUUsYUFBYTtnQkFDOUIsTUFBTSxFQUFFLGFBQWE7Z0JBQ3JCLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVztnQkFDMUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPO2dCQUM1QixNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU87YUFDekI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxvQ0FBUyxDQUFDLE1BQU07UUFDdEIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLDZFQUE2RTtZQUNuRixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLDZFQUE2RTtnQkFDdkYsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNELFVBQVUsRUFBRTtnQkFDVjtvQkFDRSxHQUFHLEVBQUUsSUFBSTtvQkFDVCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO29CQUNwQixLQUFLLEVBQUUsSUFBSTtvQkFDWCxNQUFNLEVBQUUsSUFBSTtpQkFDYjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsaUJBQWlCO29CQUN0QixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO29CQUN0QixLQUFLLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQztvQkFDekIsT0FBTyxFQUFFLElBQUk7b0JBQ2IsS0FBSyxFQUFFO3dCQUNMLFNBQVMsRUFBRSxHQUFHO3FCQUNmO2lCQUNGO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxPQUFPO29CQUNaLElBQUksRUFBRSxvQ0FBUyxDQUFDLElBQUk7b0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDO2lCQUN6QjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxRQUFRO29CQUN4QixLQUFLLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQztvQkFDdkIsS0FBSyxFQUFFO3dCQUNMLFVBQVUsRUFBRSxZQUFZO3FCQUN6QjtpQkFDRjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsUUFBUTtvQkFDYixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO29CQUN0QixLQUFLLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQztvQkFDeEIsS0FBSyxFQUFFO3dCQUNMLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUztxQkFDN0I7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxrQkFBZSxrQ0FBTyxDQUFDIn0=