import { DEFAULT_REVERSE_TEMPERATURE, PlayStrategy, ReverseTemperature } from "@/const";
import { ModelName } from "@/const/model";
import { err, ok, Result } from "neverthrow";

export class PlayType {
    constructor(
        private playStrategy: PlayStrategy,
        private modelName: ModelName | undefined = undefined,
        private reverseTemperature: ReverseTemperature = DEFAULT_REVERSE_TEMPERATURE,
    ) {}

    static create({
        playStrategy,
        modelName,
        reverseTemperature,
    }: {
        playStrategy: PlayStrategy,
        modelName?: ModelName,
        reverseTemperature?: ReverseTemperature,
    }): Result<PlayType, Error> {
        if (playStrategy === 'CLICK') return ok(new PlayType(playStrategy));
        
        // モデルの場合のバリデーション
        if (modelName === undefined || reverseTemperature === undefined) return err(new Error());
        return ok(new PlayType(playStrategy, modelName, reverseTemperature));
    }

    static createClick(): PlayType {
        const result = PlayType.create({ playStrategy: 'CLICK' });
        if (result.isErr()) throw result.error;
        return result.value;
    }

    public getPlayStrategy(): PlayStrategy {
        return this.playStrategy;
    }

    public getModelName(): Result<ModelName, Error> {
        return this.modelName !== undefined ? ok(this.modelName) : err(new Error());
    }

    public getReverseTemperature(): Result<ReverseTemperature, Error> {
        return this.reverseTemperature !== undefined ? ok(this.reverseTemperature) : err(new Error());
    }
}
