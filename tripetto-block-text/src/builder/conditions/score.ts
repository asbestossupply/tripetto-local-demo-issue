/** Package information defined using webpack */
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;

/** Dependencies */
import {
    ConditionBlock,
    Forms,
    L10n,
    Slots,
    affects,
    definition,
    editor,
    isNumberFinite,
    isString,
    lookupVariable,
    pgettext,
    populateVariables,
    tripetto,
} from "tripetto";
import { TScoreModes } from "../../runner/conditions/score";

/** Assets */
import ICON from "../../../assets/score.svg";

@tripetto({
    type: "condition",
    context: PACKAGE_NAME,
    identifier: `${PACKAGE_NAME}:score`,
    version: PACKAGE_VERSION,
    icon: ICON,
    get label() {
        return pgettext("block:text", "Verify score");
    },
})
export class ScoreCondition extends ConditionBlock {
    readonly allowMarkdown = true;

    @definition
    @affects("#name")
    mode: TScoreModes = "equal";

    @definition
    @affects("#name")
    value?: number | string;

    @definition
    @affects("#name")
    to?: number | string;

    // Return an empty label, since the node name is in the block name already.
    get label() {
        return "";
    }

    get name() {
        const slot = this.slot;

        if (slot instanceof Slots.Numeric) {
            const value = this.parse(slot, this.value);

            switch (this.mode) {
                case "between":
                    return `${value} ≤ @${slot.id} ≤ ${this.parse(
                        slot,
                        this.to
                    )}`;
                case "not-between":
                    return `@${slot.id} < ${value} ${pgettext(
                        "block:text",
                        "or"
                    )} @${slot.id} > ${this.parse(slot, this.to)}`;
                case "defined":
                    return `@${slot.id} ${pgettext(
                        "block:text",
                        "calculated"
                    )}`;
                case "undefined":
                    return `@${slot.id} ${pgettext(
                        "block:text",
                        "not calculated"
                    )}`;
                case "not-equal":
                    return `@${slot.id} \u2260 ${value}`;
                case "above":
                case "below":
                case "equal":
                    return `@${slot.id} ${
                        this.mode === "above"
                            ? ">"
                            : this.mode === "below"
                            ? "<"
                            : "="
                    } ${value}`;
            }
        }

        return this.type.label;
    }

    get title() {
        return this.slot?.label || this.node?.label;
    }

    private parse(
        slot: Slots.Numeric,
        value: number | string | undefined
    ): string {
        if (isNumberFinite(value)) {
            return slot.toString(value, (n, p) =>
                L10n.locale.number(n, p, false)
            );
        } else if (
            isString(value) &&
            value &&
            lookupVariable(this, value)?.label
        ) {
            return `@${value}`;
        }

        return "\\_\\_";
    }

    @editor
    defineEditor(): void {
        this.editor.form({
            title: pgettext("block:text", "Compare mode"),
            controls: [
                new Forms.Radiobutton<TScoreModes>(
                    [
                        {
                            label: pgettext("block:text", "Score is equal to"),
                            value: "equal",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is not equal to"
                            ),
                            value: "not-equal",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is lower than"
                            ),
                            value: "below",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is higher than"
                            ),
                            value: "above",
                        },
                        {
                            label: pgettext("block:text", "Score is between"),
                            value: "between",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is not between"
                            ),
                            value: "not-between",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is calculated"
                            ),
                            value: "defined",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Score is not calculated"
                            ),
                            value: "undefined",
                        },
                    ],
                    Forms.Radiobutton.bind(this, "mode", "equal")
                ).on((mode: Forms.Radiobutton<TScoreModes>) => {
                    from.visible(
                        mode.value !== "defined" && mode.value !== "undefined"
                    );
                    to.visible(
                        mode.value === "between" || mode.value === "not-between"
                    );

                    switch (mode.value) {
                        case "equal":
                            from.title = pgettext(
                                "block:text",
                                "If score equals"
                            );
                            break;
                        case "not-equal":
                            from.title = pgettext(
                                "block:text",
                                "If score not equals"
                            );
                            break;
                        case "below":
                            from.title = pgettext(
                                "block:text",
                                "If score is lower than"
                            );
                            break;
                        case "above":
                            from.title = pgettext(
                                "block:text",
                                "If score is higher than"
                            );
                            break;
                        case "between":
                            from.title = pgettext(
                                "block:text",
                                "If score is between"
                            );
                            break;
                        case "not-between":
                            from.title = pgettext(
                                "block:text",
                                "If score is not between"
                            );
                            break;
                    }
                }),
            ],
        });

        const addCondition = (
            property: "value" | "to",
            title: string,
            visible: boolean
        ) => {
            const value = this[property];
            const src = this.slot as Slots.Numeric | undefined;
            const numberControl = new Forms.Numeric(
                isNumberFinite(value) ? value : 0
            )
                .label(pgettext("block:text", "Use fixed number"))
                .precision(src?.precision || 0)
                .digits(src?.digits || 0)
                .decimalSign(src?.decimal || "")
                .thousands(src?.separator ? true : false, src?.separator || "")
                .prefix(src?.prefix || "")
                .prefixPlural(src?.prefixPlural || undefined)
                .suffix(src?.suffix || "")
                .suffixPlural(src?.suffixPlural || undefined)
                .autoFocus(property === "value")
                .escape(this.editor.close)
                .enter(
                    () =>
                        ((this.mode !== "between" &&
                            this.mode !== "not-between") ||
                            property === "to") &&
                        this.editor.close()
                )
                .on((input) => {
                    if (input.isFormVisible && input.isObservable) {
                        this[property] = input.value;
                    }
                });

            const variables = populateVariables(
                this,
                (slot) =>
                    slot instanceof Slots.Number ||
                    slot instanceof Slots.Numeric,
                isString(value) ? value : undefined,
                true,
                this.slot?.id
            );
            const variableControl = new Forms.Dropdown(
                variables,
                isString(value) ? value : ""
            )
                .label(pgettext("block:text", "Use value of"))
                .width("full")
                .on((variable) => {
                    if (variable.isFormVisible && variable.isObservable) {
                        this[property] = variable.value || "";
                    }
                });

            return this.editor
                .form({
                    title,
                    controls: [
                        new Forms.Radiobutton<"number" | "variable">(
                            [
                                {
                                    label: pgettext("block:text", "Number"),
                                    value: "number",
                                },
                                {
                                    label: pgettext("block:text", "Value"),
                                    value: "variable",
                                    disabled: variables.length === 0,
                                },
                            ],
                            isString(value) ? "variable" : "number"
                        ).on((type) => {
                            numberControl.visible(type.value === "number");
                            variableControl.visible(type.value === "variable");

                            if (numberControl.isObservable) {
                                numberControl.focus();
                            }
                        }),
                        numberControl,
                        variableControl,
                    ],
                })
                .visible(visible);
        };

        const from = addCondition(
            "value",
            pgettext("block:text", "If score equals"),
            this.mode !== "defined" && this.mode !== "undefined"
        );
        const to = addCondition(
            "to",
            pgettext("block:text", "And"),
            this.mode === "between" || this.mode === "not-between"
        );
    }
}
