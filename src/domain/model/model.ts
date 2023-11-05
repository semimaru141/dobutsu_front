import { BASE_PATH, MAX_REVERSE_TEMPERATURE, MIN_REVERSE_TEMPERATURE, ReverseTemperature } from "@/const";
import { ModelName } from "@/const/model";
import { loadLayersModel, LayersModel } from "@tensorflow/tfjs";
import { err, ok, Result } from "neverthrow";
import path from "path";
import { ModelData } from "./modelData";

export class Model {
    cache: Map<string, number> = new Map();

    constructor (
        private readonly model: LayersModel,
        private readonly modelName: ModelName,
    ) {}

    public static async load(filename: ModelName) {
        const model = await loadLayersModel(path.join(BASE_PATH, '/models', filename, 'model.json'));
        return new Model(model, filename);
    }

    // 先手用
    public getChooseStrategy(reverseTemperature: ReverseTemperature) {
        return (keys: string[]): Result<string, Error> => {
            // 逆温度が最大の場合は最大値を返す
            if (reverseTemperature === MAX_REVERSE_TEMPERATURE) {
                let minIndex = 0;
                let min = Infinity;
                for(let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const result = this.predict(key);
                    if (result.isErr()) return err(result.error);
                    
                    const value = result.value;
                    if (value < min) {
                        minIndex = i;
                        min = value;
                    }
                }
                return ok(keys[minIndex]);
            } else {
                const scores = keys.map((key) => {
                    const result = this.predict(key);
                    if (result.isErr()) return err(result.error);
                    return ok(result.value);
                });
    
                const result = Result.combine(scores).andThen((scores) => {
                    // 逆温度による補正を加える
                    const exps = scores.map((score) => Math.exp(-1 * score * reverseTemperature));
    
                    const sum = exps.reduce((sum, score) => sum + score, 0);
                    const random = Math.random() * sum;
    
                    let current = 0;
                    for(let i = 0; i < exps.length; i++) {
                        current += exps[i];
                        if (current >= random) return ok(keys[i]);
                    }
                    return ok(keys[0]);
                });
                return result;
            }
        }
    }

    public getModelName() {
        return this.modelName;
    }

    // ========================================

    private predict(key: string): Result<number, Error> {
        if (this.cache.has(key)) return ok(this.cache.get(key)!);

        const modelDataResult = ModelData.createData(key);
        if (modelDataResult.isErr()) return err(modelDataResult.error);
        const prediction = this.model.predict(modelDataResult.value.getData());
        
        // @ts-ignore
        const score: number = prediction.arraySync()[0][0];

        this.cache.set(key, score);
        return ok(score);
    }
}
