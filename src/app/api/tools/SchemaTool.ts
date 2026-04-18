import { NextResponse } from "next/server";
import { type infer as Infer, type ZodSchema } from "zod";

export function checkValidInput<T extends ZodSchema<any>[]>(
  schemas: [...T],
  inputs: any[],
  defaultCode = 400,
) {
  if (schemas.length !== inputs.length) {
    throw new Error("The number of schemas and inputs must be the same");
  }
  let error: string | null = null;
  let errors: string[] = [];
  const parsedData: { [K in keyof T]: Infer<T[K]> } = [] as {
    [K in keyof T]: Infer<T[K]>;
  };
  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    const result = schema.safeParse(inputs[i]);
    if (!result.success) {
      error = result.error.errors[0].message;
      errors = result.error.errors.map((err) => err.message);
      break;
    }
    parsedData.push(result.data);
  }
  const nextErrorReponse = error
    ? new NextResponse(JSON.stringify({ error: error, errors: errors }), {
        status: defaultCode,
      })
    : null;
  return {
    nextErrorReponse,
    parsedData,
  };
}
