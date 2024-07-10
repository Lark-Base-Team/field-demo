"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    // authorizations: [
    //   {
    //     id: 'Outlook',
    //     platform: 'Outlook',
    //     type: AuthorizationType.Custom,
    //     label: '',
    //     params: [
    //       {
    //         key: 'a'
    //       }
    //     ]
    //   }
    // ],
    // i18n: {
    //   messages: {
    //     'zh-CN': {
    //       attachmentLabel: '请选择附件字段',
    //       url: '附件地址',
    //       name: '附件名称',
    //       size: '附件尺寸',
    //     },
    //     'en-US': {},
    //     'ja-JP': {},
    //   }
    // },
    formItems: [
        {
            key: 'url',
            label: '这是label',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text]
            },
            validator: {
                required: true,
            }
        },
    ],
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        console.log("🚀 ~ execute: ~ formItemParams, context:", formItemParams, context);
        const { url } = formItemParams;
        // try {
        //   const res = await context.fetch('http://localhost:3000?c=1#d=2', {
        //     headers: {
        //       'Authorization': 'token',
        //     },
        //   });
        //   console.log("🚀 ~ execute: ~ res:", res)
        // } catch (e) {
        //   console.log("🚀 ~ execute: ~ e:", e)
        // }
        if (Array.isArray(url)) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                // data 类型需与下方 resultType 定义一致
                data: {
                    files: [].concat(url.map(({ link }) => {
                        if (!link) {
                            return undefined;
                        }
                        return {
                            name: "随机" + Math.random() + "图片1.jpg",
                            content: link,
                            contentType: "URL"
                        };
                    })).filter((v) => v?.content)
                },
            };
        }
        return {
            code: block_basekit_server_api_1.FieldCode.Error,
        };
    },
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFDcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixvQkFBb0I7SUFDcEIsTUFBTTtJQUNOLHFCQUFxQjtJQUNyQiwyQkFBMkI7SUFDM0Isc0NBQXNDO0lBQ3RDLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsVUFBVTtJQUNWLG1CQUFtQjtJQUNuQixVQUFVO0lBQ1YsUUFBUTtJQUNSLE1BQU07SUFDTixLQUFLO0lBQ0wsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsb0NBQW9DO0lBQ3BDLHFCQUFxQjtJQUNyQixzQkFBc0I7SUFDdEIsc0JBQXNCO0lBQ3RCLFNBQVM7SUFDVCxtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUyxFQUFFO1FBQ1Q7WUFDRSxHQUFHLEVBQUUsS0FBSztZQUNWLEtBQUssRUFBRSxTQUFTO1lBQ2hCLFNBQVMsRUFBRSx5Q0FBYyxDQUFDLFdBQVc7WUFDckMsS0FBSyxFQUFFO2dCQUNMLFdBQVcsRUFBRSxDQUFDLG9DQUFTLENBQUMsSUFBSSxDQUFDO2FBQzlCO1lBQ0QsU0FBUyxFQUFFO2dCQUNULFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0lBQ0QsMkRBQTJEO0lBQzNELE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ2hGLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUM7UUFDL0IsUUFBUTtRQUNSLHVFQUF1RTtRQUN2RSxpQkFBaUI7UUFDakIsa0NBQWtDO1FBQ2xDLFNBQVM7UUFDVCxRQUFRO1FBQ1IsNkNBQTZDO1FBQzdDLGdCQUFnQjtRQUNoQix5Q0FBeUM7UUFDekMsSUFBSTtRQUNKLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLG9DQUFTLENBQUMsT0FBTyxFQUFFLFdBQVc7Z0JBQ3BDLDhCQUE4QjtnQkFDOUIsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxFQUVOLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUU7d0JBQzVCLElBQUcsQ0FBQyxJQUFJLEVBQUMsQ0FBQzs0QkFDUixPQUFPLFNBQVMsQ0FBQzt3QkFDbkIsQ0FBQzt3QkFDRCxPQUFPOzRCQUNMLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFNBQVM7NEJBQ3RDLE9BQU8sRUFBRSxJQUFJOzRCQUNiLFdBQVcsRUFBRSxLQUFLO3lCQUNuQixDQUFBO29CQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLEVBQUUsQ0FBQSxDQUFDLEVBQUUsT0FBTyxDQUFDO2lCQUM1QjthQUNGLENBQUM7UUFDSixDQUFDO1FBQ0QsT0FBTztZQUNMLElBQUksRUFBRSxvQ0FBUyxDQUFDLEtBQUs7U0FDdEIsQ0FBQztJQUNKLENBQUM7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxVQUFVO0tBQzNCO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsa0NBQU8sQ0FBQyJ9