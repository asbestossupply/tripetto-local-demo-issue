/** Package information retrieved from `package.json` using webpack. */
declare const PACKAGE_NAME: string;

/** Dependencies */
import {
    ConditionBlock,
    Num,
    Slots,
    condition,
    isNumberFinite,
    isString,
    tripetto,
} from "tripetto-runner-foundation";

export type TScoreModes =
    | "equal"
    | "not-equal"
    | "below"
    | "above"
    | "between"
    | "not-between"
    | "defined"
    | "undefined";

@tripetto({
    type: "condition",
    identifier: `${PACKAGE_NAME}:score`,
})
export class ScoreCondition extends ConditionBlock<{
    readonly mode: TScoreModes;
    readonly value?: number | string;
    readonly to?: number | string;
}> {
    private getValue(slot: Slots.Slot, value: number | string | undefined) {
        if (isString(value) && slot instanceof Slots.Numeric) {
            const variable = this.variableFor(value);

            return variable && variable.hasValue
                ? slot.toValue(variable.value)
                : undefined;
        }

        return isNumberFinite(value) ? value : undefined;
    }

    @condition
    verify(): boolean {
        const scoreSlot = this.valueOf<number>();

        if (scoreSlot) {
            const value = this.getValue(scoreSlot.slot, this.props.value);

            switch (this.props.mode) {
                case "equal":
                    return (
                        (scoreSlot.hasValue ? scoreSlot.value : undefined) ===
                        value
                    );
                case "not-equal":
                    return (
                        (scoreSlot.hasValue ? scoreSlot.value : undefined) !==
                        value
                    );
                case "below":
                    return (
                        isNumberFinite(value) &&
                        scoreSlot.hasValue &&
                        scoreSlot.value < value
                    );
                case "above":
                    return (
                        isNumberFinite(value) &&
                        scoreSlot.hasValue &&
                        scoreSlot.value > value
                    );
                case "between":
                case "not-between":
                    const to = this.getValue(scoreSlot.slot, this.props.to);

                    return (
                        isNumberFinite(value) &&
                        isNumberFinite(to) &&
                        (scoreSlot.hasValue &&
                            scoreSlot.value >= Num.min(value, to) &&
                            scoreSlot.value <= Num.max(value, to)) ===
                            (this.props.mode === "between")
                    );
                case "defined":
                    return scoreSlot.hasValue;
                case "undefined":
                    return !scoreSlot.hasValue;
            }
        }

        return false;
    }
}
