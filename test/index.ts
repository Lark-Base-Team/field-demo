import { testField, createFieldContext } from "@lark-opdev/block-basekit-server-api";

async function run() {
    const context = await createFieldContext();
    testField({
        account: 100,
    }, context);
}

run();
