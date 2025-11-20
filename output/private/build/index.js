"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const { t } = block_basekit_server_api_1.field;
const feishuDm = ['feishu.cn', 'feishucdn.com', 'larksuitecdn.com', 'larksuite.com'];
// 通过addDomainList添加请求接口的域名，不可写多个addDomainList，否则会被覆盖
block_basekit_server_api_1.basekit.addDomainList([...feishuDm]);
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
            const { url } = formItemParams;
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
            // 请避免使用 debugLog(url) 这类方式输出日志，因为所查到的日志是没有顺序的，为方便排查错误，对每个log进行手动标记顺序
            debugLog({
                '===1 url为空': url
            });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
        catch (error) {
            debugLog({
                '===999 未知错误': String(error)
            });
            return {
                code: block_basekit_server_api_1.FieldCode.Error,
            };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFBZ0o7QUFDaEosTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLGdDQUFLLENBQUM7QUFDcEIsTUFBTSxRQUFRLEdBQUcsQ0FBQyxXQUFXLEVBQUUsZUFBZSxFQUFFLGtCQUFrQixFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQ3JGLHFEQUFxRDtBQUNyRCxrQ0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUVwQyxrQ0FBTyxDQUFDLFFBQVEsQ0FBQztJQUNmLFNBQVMsRUFBRTtRQUNUO1lBQ0UsR0FBRyxFQUFFLEtBQUs7WUFDVixLQUFLLEVBQUUsY0FBYztZQUNyQixTQUFTLEVBQUUseUNBQWMsQ0FBQyxXQUFXO1lBQ3JDLEtBQUssRUFBRTtnQkFDTCxXQUFXLEVBQUUsQ0FBQyxvQ0FBUyxDQUFDLElBQUksQ0FBQzthQUM5QjtZQUNELFNBQVMsRUFBRTtnQkFDVCxRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtJQUNELFVBQVUsRUFBRTtRQUNWLElBQUksRUFBRSxvQ0FBUyxDQUFDLFVBQVU7S0FDM0I7SUFDRCwyREFBMkQ7SUFDM0QsT0FBTyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUU7UUFFekM7OztXQUdHO1FBQ0gsU0FBUyxRQUFRLENBQUMsR0FBUSxFQUFFLFdBQVcsR0FBRyxLQUFLO1lBQzdDLGFBQWE7WUFDYixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2pFLE9BQU87WUFDVCxDQUFDO1lBQ0QsT0FB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