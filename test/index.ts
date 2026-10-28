import { testField, createFieldContext } from "@lark-base-open/faas-sdk";

async function run() {
    const context = await createFieldContext();
    testField({
        account: 100,
    }, context);
}

run();
