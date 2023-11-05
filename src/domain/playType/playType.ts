import { PlayStrategy } from "@/const";
import { ModelName } from "@/const/model";
import { err, ok, Result } from "neverthrow";

export class PlayType {
    constructor(
        private playStrategy: PlayStrategy,
        private modelName: ModelName | undefined = undefined,
    ) {}

    public getPlayStrategy(): PlayStrategy {
        return this.playStrategy;
    }

    public getModelName(): Result<ModelName, Error> {
        return this.modelName !== undefined ? ok(this.modelName) : err(new Error());
    }
}
