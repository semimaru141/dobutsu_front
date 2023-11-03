import { KEY_VALIDATOR } from "@/const";
import { Result, ok, err } from "neverthrow";

export const keyValidation = (key: string): Result<unknown, Error> => {
    return KEY_VALIDATOR.test(key) ? ok(undefined) : err(new Error());
}
