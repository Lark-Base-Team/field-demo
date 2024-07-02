"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    authorizations: [
        {
            id: 'nolibox',
            type: block_basekit_server_api_1.AuthorizationType.Basic,
            params: {
                usernamePlaceholder: '请输入用户名',
                passwordPlaceholder: '请输入密码',
            }
        }
    ],
    i18n: {
        messages: {
            'zh': {
                scene: '场景',
                library: '图书馆',
                popoverDesc: 'popover描述',
                attachmentLabel: '请选择附件字段',
                token: '附件 token',
                name: '附件名称',
                size: '附件尺寸',
                date: '附件时间戳',
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
        console.log("🚀 ~ execute: ~ formItemParams, context:", formItemParams, context);
        const { scene, attachments } = formItemParams;
        try {
            await context.fetch('htts://demo.api', {}, 'nolibox');
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
            icon: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            tips: {
                imageUrl: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
                desc: t('popoverDesc'),
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
                        formatter: '0.00', // 保留两位小数
                    },
                },
                {
                    key: 'date',
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    title: t('date'),
                    extra: {
                        dateFormat: 'yyyy/MM/dd',
                    }
                },
            ],
        },
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBK0g7QUFFL0gsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixjQUFjLEVBQUU7UUFDZDtZQUNFLEVBQUUsRUFBRSxTQUFTO1lBQ2IsSUFBSSxFQUFFLDRDQUFpQixDQUFDLEtBQUs7WUFDN0IsTUFBTSxFQUFFO2dCQUNOLG1CQUFtQixFQUFFLFFBQVE7Z0JBQzdCLG1CQUFtQixFQUFFLE9BQU87YUFDN0I7U0FDRjtLQUNGO0lBQ0QsSUFBSSxFQUFFO1FBQ0osUUFBUSxFQUFFO1lBQ1IsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxJQUFJO2dCQUNYLE9BQU8sRUFBRSxLQUFLO2dCQUNkLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixlQUFlLEVBQUUsU0FBUztnQkFDMUIsS0FBSyxFQUFFLFVBQVU7Z0JBQ2pCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxPQUFPO2FBQ2Q7U0FDRjtLQUNGO0lBQ0QsU0FBUyxFQUFFO1FBQ1Q7WUFDRSxHQUFHLEVBQUUsT0FBTztZQUNaLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pCLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFlBQVk7WUFDdEMsS0FBSyxFQUFFO2dCQUNMLE9BQU8sRUFBRTtvQkFDUCxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtpQkFDMUM7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxHQUFHLEVBQUUsYUFBYTtZQUNsQixLQUFLLEVBQUUsQ0FBQyxDQUFDLGlCQUFpQixDQUFDO1lBQzNCLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsS0FBSyxF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