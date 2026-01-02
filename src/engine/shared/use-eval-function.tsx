import { useStoryStore } from "./game-state";
import { ProcessedTextLine } from "./process-text";

export const useEvalFunction = (functionName: string, args: any[]) => {
    const story = useStoryStore((state) => state.story);
    if (!story) {
        return null;
    }
    const { output, error } = story.EvaluateFunction(functionName, args, true);
    if (error) {
        console.error(error);
        return null;
    }
    const lines = (output as string).split("\n").map((line, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: ...
        <ProcessedTextLine key={`line-${index}`} text={line} context="game" />
    ));
    return <div>{lines}</div>;
};
