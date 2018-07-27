export default class HelperFunction {
    static getParameterNames(func: Function): string[] {
        const names = func.toString().match(/\(([^\)]{0,})\)/)![1].split(",").map(i => i.trim());
        if (names.length === 1 && names[0] === "") return [];
        return names;
    }
}
