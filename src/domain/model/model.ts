import { loadLayersModel, LayersModel } from "@tensorflow/tfjs";
import { err, ok, Result } from "neverthrow";
import path from "path";
import { ModelData } from "./modelData";

export class Model {
    cache: Map<string, number> = new Map();

    constructor (
        private readonly model: LayersModel,
    ) {}

    public static async load(filename: string) {
        const model = await loadLayersModel(path.join('/models', filename, 'model.json'));
        return new Model(model);
    }

    // 後手用
    public getChooseMinStrategy() {
        return (keys: string[]): Result<string, Error> => {
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
        }
    }

    public getChooseMaxStrategy() {
        return (keys: string[]): Result<string, Error> => {
            let maxIndex = 0;
            let max = -Infinity;
            for(let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const result = this.predict(key);
                if (result.isErr()) return err(result.error);
                
                const value = result.value;
                if (value > max) {
                    maxIndex = i;
                    max = value;
                }
            }
            return ok(keys[maxIndex]);
        }
    }

    // ========================================

    private predict(key: string): Result<number, Error> {
        if (this.cache.has(key)) return ok(this.cache.get(key)!);

        const modelDataResult = ModelData.createData(key);
        if (modelDataResult.isErr()) return err(modelDataResult.error);
        const prediction = this.model.predict(modelDataResult.value.getData());

        // @ts-ignore
        return ok(prediction.arraySync()[0]);
    }
}
