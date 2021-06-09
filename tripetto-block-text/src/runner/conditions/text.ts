/** Package information retrieved from `package.json` using webpack. */
declare const PACKAGE_NAME: string;

/** Dependencies */
import {
    ConditionBlock,
    Str,
    condition,
    isVariable,
    tripetto,
} from "tripetto-runner-foundation";
import { TMode } from "../mode";

@tripetto({
    type: "condition",
    identifier: PACKAGE_NAME,
})
export class TextCondition extends ConditionBlock<{
    readonly mode: TMode;
    readonly match?: string;
    readonly ignoreCase?: boolean;
}> {
    private getMatchString() {
        if (isVariable(this.props.match)) {
            const variable = this.variableFor(this.props.match);

            return variable && variable.hasValue ? variable.string : "";
        }

        return this.parseVariables(this.props.match || "");
    }

    @condition
    isEqual(): boolean {
        const textSlot = this.valueOf<string>();

        if (textSlot) {
            const match = this.props.ignoreCase
                ? Str.lowercase(this.getMatchString())
                : this.getMatchString();
            const value = this.props.ignoreCase
                ? Str.lowercase(textSlot.string)
                : textSlot.string;

            switch (this.props.mode) {
                case "exact":
                    return value === match;
                case "not-exact":
                    return value !== match;
                case "contains":
                    return (match && value.indexOf(match) !== -1) || false;
                case "not-contains":
                    return (match && value.indexOf(match) === -1) || false;
                case "starts":
                    return (match && value.indexOf(match) === 0) || false;
                case "ends":
                    return (
                        (match &&
                            value.lastIndexOf(match) ===
                                value.length - match.length) ||
                        false
                    );
                case "defined":
                    return value !== "";
                case "undefined":
                    return value === "";
            }
        }

        return false;
    }
}
