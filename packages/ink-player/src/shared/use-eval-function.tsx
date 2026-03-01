import { getUseStoryStore } from "./game-state";
import { parseWidget } from "./parse-widget";
import { ProcessedTextLine } from "./process-text";

export const useEvalFunction = (functionName: string, args: any[]) => {
    const useStoryStore = getUseStoryStore();
    const story = useStoryStore((state) => state.story);
    if (!story) {
        return null;
    }
    const { output, error } = story.EvaluateFunction(functionName, args, true);
    if (error) {
        console.error(error);
        return null;
    }
    const lines = (output as string).split("\n").map((line, index) => {
        const result = parseWidget(line);
        return (
            <ProcessedTextLine
                // biome-ignore lint/suspicious/noArrayIndexKey: ...
                key={`line-${index}`}
                text={result}
                context="game"
            />
        );
    });
    return <div>{lines}</div>;
};
