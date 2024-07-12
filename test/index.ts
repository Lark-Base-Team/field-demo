import { createFieldContext, testField } from "@lark-opdev/block-basekit-server-api";

async function run() {
    const context = await createFieldContext();
    testField({
        attachments: [
            {
                tmp_url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/发票.jpg'
            }
        ],
    }, context)
}

run();