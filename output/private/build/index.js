"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'url',
            label: '请输入需要转附件的URL',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Text]
            },
            validator: {
                required: true,
            }
        },
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Attachment,
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        console.log('====123123');
        /** 为方便查看日志，使用此方法替代console.log */
        function debugLog(arg) {
            console.log(JSON.stringify({
                formItemParams,
                context,
                arg
            }));
        }
        const { url } = formItemParams;
        debugLog(url);
        if (Array.isArray(url)) {
            return {
                code: block_basekit_server_api_1.FieldCode.Success, // 0 表示请求成功
                // data 类型需与下方 resultType 定义一致
                data: (url.map(({ link }, index) => {
                    if (!link) {
                        return undefined;
                    }
                    const name = link.split('/').slice(-1)[0];
                    return {
                        name: '随机名字' + index + name,
                        content: link,
                        contentType: "attachment/url"
                    };
                })).filter((v) => v)
            };
        }
        debugLog('非数组');
        return {
            code: block_basekit_server_api_1.FieldCode.Error,
        };
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFFcEIsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxLQUFLO1lBQ1YsS0FBSyxFQUFFLGNBQWM7WUFDckIsU0FBUyxFQUFFLHlDQUFjLENBQUMsV0FBVztZQUNyQyxLQUFLLEVBQUU7Z0JBQ0wsV0FBVyxFQUFFLENBQUMsb0NBQVMsQ0FBQyxJQUFJLENBQUM7YUFDOUI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO0tBQ0Y7SUFDRCxVQUFVLEVBQUU7UUFDVixJQUFJLEVBQUUsb0NBQVMsQ0FBQyxVQUFVO0tBQzNCO0lBQ0QsMkRBQTJEO0lBQzNELE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDMUIsaUNBQWlDO1FBQ2pDLFNBQVMsUUFBUSxDQUFDLEdBQVE7WUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUN6QixjQUFjO2dCQUNkLE9BQU87Z0JBQ1AsR0FBRzthQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0wsQ0FBQztRQUNELE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxjQUFjLENBQUM7UUFDL0IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsT0FBTztnQkFDTCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxPQUFPLEVBQUUsV0FBVztnQkFDcEMsOEJBQThCO2dCQUM5QixJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRTtvQkFDakMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNWLE9BQU8sU0FBUyxDQUFBO29CQUNsQixDQUFDO29CQUNELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFDLE9BQU87d0JBQ0wsSUFBSSxFQUFFLE1BQU0sR0FBRyxLQUFLLEdBQUcsSUFBSTt3QkFDM0IsT0FBTyxFQUFFLElBQUk7d0JBQ2IsV0FBVyxFQUFFLGdCQUFnQjtxQkFDOUIsQ0FBQTtnQkFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3JCLENBQUM7UUFDSixDQUFDO1FBQ0QsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hCLE9BQU87WUFDTCxJQUFJLEVBQUUsb0NBQVMsQ0FBQyxLQUFLO1NBQ3RCLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsa0JBQWUsa0NBQU8sQ0FBQyJ9