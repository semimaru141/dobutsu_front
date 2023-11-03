import { Player } from "@/const";

export type SystemViewModel = {
    turnPlayer: Player;
    finishStatus: {
        isFinished: true;
        winner: Player;
    } | {
        isFinished: false;
    };
}
