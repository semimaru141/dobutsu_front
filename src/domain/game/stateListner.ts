import { CapturedIndex, SquareIndex } from "@/const";
import { CapturedViewModel } from "@/viewModel/capturedViewModel";
import { SquareViewModel } from "@/viewModel/squareViewModel";
import { SystemViewModel } from "@/viewModel/systemViewModel";
import EventEmitter from "events";

const SQUARE_VIEW_MODEL = 'SQUARE_VIEW_MODEL';
const CAPTURED_VIEW_MODEL = 'CAPTURED_VIEW_MODEL';
const SYSTEM_VIEW_MODEL = 'SYSTEM_VIEW_MODEL';

export class StateListener extends EventEmitter {
    squareCache: Map<SquareIndex, SquareViewModel> = new Map();
    capturedCache: Map<CapturedIndex, CapturedViewModel> = new Map();
    systemCache: SystemViewModel | undefined = undefined;
    
    // SquareViewModel
    public emitSquareViewModel(squareIndex: SquareIndex, squareViewModel: SquareViewModel) {
        const model = this.squareCache.get(squareIndex);
        
        if (JSON.stringify(model) === JSON.stringify(squareViewModel)) return;
        this.squareCache.set(squareIndex, squareViewModel);

        this.emit(this.makeSquareViewModelEventName(squareIndex), squareViewModel);
    }

    public onSquareViewModel(squareIndex: SquareIndex, callback: (squareViewModel: SquareViewModel) => void) {
        this.on(this.makeSquareViewModelEventName(squareIndex), callback);
    }

    public removeSquareViewModelListener(squareIndex: SquareIndex, listener: (squareViewModel: SquareViewModel) => void) {
        this.removeListener(this.makeSquareViewModelEventName(squareIndex), listener);
    }

    // CapturedViewModel
    public emitCapturedViewModel(capturedIndex: CapturedIndex, capturedViewModel: CapturedViewModel) {
        const model = this.capturedCache.get(capturedIndex);

        if (JSON.stringify(model) === JSON.stringify(capturedViewModel)) return;
        this.capturedCache.set(capturedIndex, capturedViewModel);

        this.emit(this.makeCapturedViewModelEventName(capturedIndex), capturedViewModel);
    }

    public onCapturedViewModel(capturedIndex: CapturedIndex, callback: (capturedViewModel: CapturedViewModel) => void) {
        this.on(this.makeCapturedViewModelEventName(capturedIndex), callback);
    }

    public removeCapturedViewModelListener(capturedIndex: CapturedIndex, listener: (capturedViewModel: CapturedViewModel) => void) {
        this.removeListener(this.makeCapturedViewModelEventName(capturedIndex), listener);
    }

    // SystemViewModel
    public emitSystemViewModel(systemViewModel: SystemViewModel) {
        if (JSON.stringify(this.systemCache) === JSON.stringify(systemViewModel)) return;
        this.systemCache = systemViewModel;

        this.emit(this.makeSystemViewModelEventName(), systemViewModel);
    }

    public onSystemViewModel(callback: (systemViewModel: SystemViewModel) => void) {
        this.on(this.makeSystemViewModelEventName(), callback);
    }

    public removeSystemViewModelListener(listener: (systemViewModel: SystemViewModel) => void) {
        this.removeListener(this.makeSystemViewModelEventName(), listener);
    }

    // ========================================

    private makeSquareViewModelEventName(squareIndex: SquareIndex) {
        return SQUARE_VIEW_MODEL + squareIndex.toString();
    }

    private makeCapturedViewModelEventName(capturedIndex: CapturedIndex) {
        return CAPTURED_VIEW_MODEL + capturedIndex.toString();
    }

    private makeSystemViewModelEventName() {
        return SYSTEM_VIEW_MODEL;
    }
}
