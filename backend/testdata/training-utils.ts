import { diffWordsWithSpace } from "diff";
import {Recipe} from "./Recipe";

export function normalizeText(text: string): string {
    return text.trim().toLowerCase();
}


export function logDifferences(expected: Recipe, actual: Recipe): void {
    console.log("Differences found:");
    
    if (normalizeText(expected.name) !== normalizeText(actual.name)) {
        console.log("- Name mismatch:");
        console.log(formatDiff(expected.name, actual.name));
    }
    if (normalizeText(expected.description) !== normalizeText(actual.description)) {
        console.log("- Description mismatch:");
        console.log(formatDiff(expected.description, actual.description));
    }
    if (expected.portions !== actual.portions) {
        console.log(`- Portions mismatch: Expected '${expected.portions}', got '${actual.portions}'`);
    }
    
    expected.ingredients.forEach((exp, i) => {
        if (!actual.ingredients[i] || normalizeText(exp.name) !== normalizeText(actual.ingredients[i].name) || normalizeText(exp.unit) !== normalizeText(actual.ingredients[i].unit) || exp.quantity !== actual.ingredients[i].quantity) {
            console.log(`- Ingredient mismatch at index ${i}:`);
            console.log(formatDiff(JSON.stringify(exp), JSON.stringify(actual.ingredients[i] || "missing")));
        }
    });
    
    expected.steps.forEach((exp, i) => {
        if (!actual.steps[i]) {
            console.log(`- Step missing at index ${i}:`);
            console.log(formatDiff(JSON.stringify(exp), "missing"));
        } else if (exp.order !== actual.steps[i].order || normalizeText(exp.instruction) !== normalizeText(actual.steps[i].instruction) || exp.minutes !== actual.steps[i].minutes) {
            console.log(`- Step mismatch at index ${i}:`);
            console.log(formatDiff(JSON.stringify(exp), JSON.stringify(actual.steps[i])));
        }
    });
    
    const expectedCategories = expected.categories || [];
    const actualCategories = actual.categories || [];

    expectedCategories.forEach((exp) => {
        if (!actualCategories.map(normalizeText).includes(normalizeText(exp))) {
            console.log(`- Missing category: '${exp}'`);
        }
    });
    actualCategories.forEach((act) => {
        if (!expectedCategories.map(normalizeText).includes(normalizeText(act))) {
            console.log(`- Unexpected category: '${act}'`);
        }
    });
}

export function formatDiff(expected: string, actual: string): string {
    const diffResult = diffWordsWithSpace(actual, expected);
    let diffString = "";
    let diffMarkers = "";

    diffResult.forEach(part => {
        const coloredText = part.added ? `\x1b[32m${part.value}\x1b[0m` : part.removed ? `\x1b[31m${part.value}\x1b[0m` : part.value;
        diffString += coloredText;
        diffMarkers += (part.added || part.removed) ? "^".repeat(part.value.length) : " ".repeat(part.value.length);
    });

    return `\n${diffString}\n${diffMarkers}`;
}