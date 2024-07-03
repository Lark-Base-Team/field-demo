"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    authorizations: [
        {
            id: 'demo',
            type: block_basekit_server_api_1.AuthorizationType.Basic,
            params: {
                usernamePlaceholder: '请输入用户名',
                passwordPlaceholder: '请输入密码',
            }
        }
    ],
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
        try {
            await context.fetch('htts://demo.api', {}, 'demo');
        }
        catch (e) {
            console.log(e);
        }
        const attachment = attachments?.[0];
        if (attachment) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                // data 类型需与下方 resultType 定义一致
                data: {
                    id: attachment.token, // 附件 token
                    primaryProperty: attachment.token,
                    name: attachment.name, // 附件名称
                    size: attachment.size, // 附件尺寸
                    date: attachment.timeStamp, // 附件时间戳
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
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    title: t('date'),
                    extra: {
                        dateFormat: block_basekit_server_api_1.DateFormatter.DATE_YMD_WITH_SLASH,
                    }
                },
            ],
        },
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0o7QUFFL0osTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixjQUFjLEVBQUU7UUFDZDtZQUNFLEVBQUUsRUFBRSxNQUFNO1lBQ1YsSUFBSSxFQUFFLDRDQUFpQixDQUFDLEtBQUs7WUFDN0IsTUFBTSxFQUFFO2dCQUNOLG1CQUFtQixFQUFFLFFBQVE7Z0JBQzdCLG1CQUFtQixFQUFFLE9BQU87YUFDN0I7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxJQUFJO2dCQUNYLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixlQUFlLEVBQUUsU0FBUztnQkFDMUIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxPQUFPO2dCQUNiLFlBQVksRUFBRSw2RUFBNkU7YUFDNUY7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWSxFQUFFLDZFQUE2RTthQUM1RjtTQUNGO0tBQ0Y7SUFDRCxTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxPQUFPO1lBQ1osS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDakIsU0FBUyxFQUFFLHlDQUFjLENBQUMsWUFBWTtZQUN0QyxLQUFLLEVBQUU7Z0JBQ0wsT0FBTyxFQUFFO29CQUNQLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO2lCQUMxQzthQUNGO1NBQ0Y7UUFDRDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFB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