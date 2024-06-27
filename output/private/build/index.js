"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'attachments',
            label: '请选择附件字段',
            component: 'FieldSelect',
            props: {
                supportType: [17],
            },
        },
    ],
    // params 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段、授权信息）
    execute: async (params, context) => {
        const { attachments } = params;
        const { fetch } = context;
        // const res = await fetch('https://demo.api', {
        //   method: 'POSt',
        //   body: JSON.stringify({
        //     imageUrl: attachments.temp_url,
        //   }),
        // })
        return {
            code: 0, // 0 表示请求成功
            // data 类型需与下方 resultType 定义一致
            data: {
                id: 'id',
                primaryProperty: 123,
                title: '发票抬头', // 发票抬头的实际值
                date: 1718678604284, // 发票日期
                amount: 100, // 发票金额
            },
        };
    },
    resultType: {
        icon: 'https://xxx.svg',
        propertyType: block_basekit_server_api_1.FieldType.Object,
        properties: [
            {
                key: 'id',
                propertyType: block_basekit_server_api_1.FieldType.Text,
                title: 'id',
            },
            {
                key: 'primaryProperty',
                propertyType: block_basekit_server_api_1.FieldType.Number,
                title: '发票号码',
            },
            {
                key: 'title',
                propertyType: block_basekit_server_api_1.FieldType.Text,
                title: '发票抬头',
            },
            {
                key: 'date',
                propertyType: block_basekit_server_api_1.FieldType.DateTime,
                title: '开票日期',
                extra: {
                    dateFormat: 'yyyy/MM/dd',
                }
            },
            {
                key: 'amount',
                propertyType: block_basekit_server_api_1.FieldType.Number,
                title: '发票金额',
                extra: {
                    formatter: '0.00', // 保留两位小数
                },
            },
        ],
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBMEU7QUFFMUUsa0NBQU8sQ0FBQyxRQUFRLENBQUM7SUFDZixTQUFTLEVBQUU7UUFDVDtZQUNFLEdBQUcsRUFBRSxhQUFhO1lBQ2xCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUM7YUFDbEI7U0FDRjtLQUNGO0lBQ0Qsd0RBQXdEO0lBQ3hELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2pDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDL0IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUMxQixnREFBZ0Q7UUFDaEQsb0JBQW9CO1FBQ3BCLDJCQUEyQjtRQUMzQixzQ0FBc0M7UUFDdEMsUUFBUTtRQUNSLEtBQUs7UUFFTCxPQUFPO1lBQ0wsSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFXO1lBQ3BCLDhCQUE4QjtZQUM5QixJQUFJLEVBQUU7Z0JBQ0osRUFBRSxFQUFFLElBQUk7Z0JBQ1IsZUFBZSxFQUFFLEdBQUc7Z0JBQ3BCLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVztnQkFDMUIsSUFBSSxFQUFFLGFBQWEsRUFBRSxPQUFPO2dCQUM1QixNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU87YUFDckI7U0FDRixDQUFDO0lBQ0osQ0FBQztJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsWUFBWSxFQUFFLG9DQUFTLENBQUMsTUFBTTtRQUM5QixVQUFVLEVBQUU7WUFDVjtnQkFDRSxHQUFHLEVBQUUsSUFBSTtnQkFDVCxZQUFZLEVBQUUsb0NBQVMsQ0FBQyxJQUFJO2dCQUM1QixLQUFLLEVBQUUsSUFBSTthQUNaO1lBQ0Q7Z0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtnQkFDdEIsWUFBWSxFQUFFLG9DQUFTLENBQUMsTUFBTTtnQkFDOUIsS0FBSyxFQUFFLE1BQU07YUFDZDtZQUNEO2dCQUNFLEdBQUcsRUFBRSxPQUFPO2dCQUNaLFlBQVksRUFBRSxvQ0FBUyxDQUFDLElBQUk7Z0JBQzVCLEtBQUssRUFBRSxNQUFNO2FBQ2Q7WUFDRDtnQkFDRSxHQUFHLEVBQUUsTUFBTTtnQkFDWCxZQUFZLEVBQUUsb0NBQVMsQ0FBQyxRQUFRO2dCQUNoQyxLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUU7b0JBQ0wsVUFBVSxFQUFFLFlBQVk7aUJBQ3pCO2FBQ0Y7WUFDRDtnQkFDRSxHQUFHLEVBQUUsUUFBUTtnQkFDYixZQUFZLEVBQUUsb0NBQVMsQ0FBQyxNQUFNO2dCQUM5QixLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUU7b0JBQ0wsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTO2lCQUM3QjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILGtCQUFlLGtDQUFPLENBQUMifQ==