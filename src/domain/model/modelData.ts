import { keyValidation } from "@/util/keyValidation";
import { Tensor, tensor, tensor2d } from "@tensorflow/tfjs";
import { Result } from "neverthrow";

// Modelへ渡すためのデータ
export class ModelData {
    constructor(
        private readonly key: string,
        private readonly data: Tensor,
    ) {}

    static createData(key: string): Result<ModelData, Error> {
        const boardKey = key.slice(0, 12);
        const captured = key.slice(12);
        const boardVec = boardKey
            .split('')
            .map((key) => key !== 'a' ? Number(key) : 10)
            .map((key) => ModelData.createOnehot(key, 11))
            .flat();
        const capturedVec = captured
            .split('')
            .map((key) => Number(key))
            .map((key) => ModelData.createOnehot(key, 3))
            .flat();
        
        const ten = tensor([...boardVec, ...capturedVec], [1, 150], 'float32');
        console.log(ten);

        return keyValidation(key).map(() => new ModelData(key, ten));
    }

    static createOnehot(num: number, all: 11 | 3): number[] {
        const onehot = new Array(all).fill(0);
        onehot[num] = 1;
        return onehot;
    }

    public getData() {
        return this.data;
    }

    public getKey() {
        return this.key;
    }
}
