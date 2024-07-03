"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    i18n: {
        messages: {
            'zh-CN': {
                scene: '场景',
                library: '图书馆',
                popoverDesc: 'popover描述',
                attachmentLabel: '请选择附件字段',
                token: '附件 token',
                name: '附件名称',
                size: '附件尺寸',
                date: '附件时间戳',
                tipsImageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            'en-US': {
                tipsImageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            }
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
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        const { scene, attachments } = formItemParams;
        // try {
        //   await context.fetch('htts://demo.api', {}, 'demo');
        // } catch(e) {
        //   console.log(e);
        // }
        const attachment = attachments?.[0];
        if (attachment) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                // data 类型需与下方 resultType 定义一致
                data: {
                    id: attachment.tmp_url ?? '', //  附件临时 url
                    primaryProperty: attachment.tmp_url ?? '', // 附件临时 url
                    name: attachment.name, // 附件名称
                    size: attachment.size, // 附件尺寸
                },
            };
        }
        return {
            code: block_basekit_server_api_1.FieldCode.Error,
        };
    },
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
                    key: 'primaryProperty',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('token'),
                    primary: true,
                },
                {
                    key: 'name',
                    type: block_basekit_server_api_1.FieldType.Text,
                    title: t('name'),
                },
                {
                    key: 'size',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t('size'),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_1, // 保留两位小数
                    },
                },
            ],
        },
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBNEk7QUFFNUksTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixJQUFJLEVBQUU7UUFDSixRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsV0FBVyxFQUFFLFdBQVc7Z0JBQ3hCLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixLQUFLLEVBQUUsVUFBVTtnQkFDakIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsWUFBWSxFQUFFLDZFQUE2RTthQUM1RjtZQUNELE9BQU8sRUFBRTtnQkFDUCxZQUFZLEVBQUUsNkVBQTZFO2FBQzVGO1NBQ0Y7S0FDRjtJQUNELFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLE9BQU87WUFDWixLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNqQixTQUFTLEVBQUUseUNBQWMsQ0FBQyxZQUFZO1lBQ3RDLEtBQUssRUFBRTtnQkFDTCxPQUFPLEVBQUU7b0JBQ1AsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7aUJBQzFDO2FBQ0Y7U0FDRjtRQUNEO1lBQ0UsR0FBRyxFQUFFLGFBQWE7WUFDbEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztZQUMzQixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLFVBQVUsQ0FBQzthQUNwQztZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtJQUNELDJEQUEyRDtJQUMzRCxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN6QyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxHQUFHLGNBQWMsQ0FBQztRQUM5QyxRQUFRO1FBQ1Isd0RBQXdEO1FBQ3hELGVBQWU7UUFDZixvQkFBb0I7UUFDcEIsSUFBSTtRQUNKLE1BQU0sVUFBVSxHQUFHLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQUksVUFBVSxFQUFFLENBQUM7WUFFZixPQUFPO2dCQUNMLElBQUksRUFBRSxvQ0FBUyxDQUFDLE9BQU8sRUFBRSxXQUFXO2dCQUNwQyw4QkFBOEI7Z0JBQzlCLElBQUksRUFBRTtvQkFDSixFQUFFLEVBQUUsVUFBVSxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsWUFBWTtvQkFDMUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLFdBQVc7b0JBQ3RELElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU87b0JBQzlCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU87aUJBQy9CO2FBQ0YsQ0FBQztRQUNKLENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxFQUFFLG9DQUFTLENBQUMsS0FBSztTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxvQ0FBUyxDQUFDLE1BQU07UUFDdEIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSw2RUFBNkU7YUFDckY7WUFDRCxVQUFVLEVBQUU7Z0JBQ1Y7b0JBQ0UsR0FBRyxFQUFFLElBQUk7b0JBQ1QsSUFBSSxFQUFFLG9DQUFTLENBQUMsSUFBSTtvQkFDcEIsS0FBSyxFQUFFLElBQUk7b0JBQ1gsTUFBTSxFQUFFLElBQUk7aUJBQ2I7Z0JBQ0Q7b0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtvQkFDdEIsSUFBSSxFQUFFLG9DQUFTLENBQUMsSUFBSTtvQkFDcEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7b0JBQ2pCLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2dCQUNEO29CQUNFLEdBQUcsRUFBRSxNQUFNO29CQUNYLElBQUksRUFBRSxvQ0FBUyxDQUFDLElBQUk7b0JBQ3BCLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDO2lCQUNqQjtnQkFDRDtvQkFDRSxHQUFHLEVBQUUsTUFBTTtvQkFDWCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO29CQUN0QixLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDaEIsS0FBSyxFQUFFO3dCQUNMLFNBQVMsRUFBRSwwQ0FBZSxDQUFDLGlCQUFpQixFQUFFLFNBQVM7cUJBQ3hEO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsa0JBQWUsa0NBQU8sQ0FBQyJ9