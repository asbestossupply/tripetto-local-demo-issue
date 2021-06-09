/** Package information defined using webpack */
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;

/** Dependencies */
import {
    ConditionBlock,
    Forms,
    Slots,
    affects,
    definition,
    editor,
    insertVariable,
    isVariable,
    lookupVariable,
    makeMarkdownSafe,
    pgettext,
    populateVariables,
    tripetto,
} from "tripetto";
import { Text } from "..";
import { TMode } from "../../runner/mode";

/** Assets */
import ICON from "../../../assets/condition.svg";

@tripetto({
    type: "condition",
    context: PACKAGE_NAME,
    identifier: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    icon: ICON,
    get label() {
        return pgettext("block:text", "Text match");
    },
})
export class TextCondition extends ConditionBlock {
    readonly allowMarkdown = true;

    @definition
    @affects("#name")
    mode: TMode = "exact";

    @definition
    @affects("#name")
    match?: string;

    @definition
    ignoreCase?: boolean;

    private get block(): Text | undefined {
        return (
            (this.node?.block instanceof Text && this.node.block) || undefined
        );
    }

    // Return an empty label, since the node name is in the block name already.
    get label() {
        return "";
    }

    get name() {
        if (this.slot instanceof Slots.Text) {
            const wrap = (s: string) =>
                (s &&
                    (this.mode === "contains" ||
                        this.mode === "not-contains" ||
                        this.mode === "starts" ||
                        this.mode === "ends") &&
                    `_${s}_`) ||
                s;
            const match: string =
                (isVariable(this.match)
                    ? lookupVariable(this, this.match)?.label &&
                      `@${this.match}`
                    : this.match && wrap(makeMarkdownSafe(this.match))) ||
                "\\_\\_";

            switch (this.mode) {
                case "exact":
                case "not-exact":
                    return `@${this.slot.id} ${
                        this.mode === "not-exact" ? "\u2260" : "="
                    } ${match}`;
                case "contains":
                case "not-contains":
                case "starts":
                case "ends":
                    return `@${this.slot.id} ${
                        this.mode === "not-contains"
                            ? pgettext("block:text", "does not contain")
                            : this.mode === "starts"
                            ? pgettext("block:text", "starts with")
                            : this.mode === "ends"
                            ? pgettext("block:text", "ends with")
                            : pgettext("block:text", "contains")
                    } ${match}`;
                case "defined":
                    return `@${this.slot.id} ${pgettext(
                        "block:text",
                        "not empty"
                    )}`;
                case "undefined":
                    return `@${this.slot.id} ${pgettext(
                        "block:text",
                        "empty"
                    )}`;
            }
        }

        return this.type.label;
    }

    get title() {
        return this.node?.label;
    }

    @editor
    defineEditor(): void {
        this.editor.form({
            title: pgettext("block:text", "Compare mode"),
            controls: [
                new Forms.Radiobutton<TMode>(
                    [
                        {
                            label: pgettext("block:text", "Text matches"),
                            value: "exact",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Text does not match"
                            ),
                            value: "not-exact",
                        },
                        {
                            label: pgettext("block:text", "Text contains"),
                            value: "contains",
                        },
                        {
                            label: pgettext(
                                "block:text",
                                "Text does not contain"
                            ),
                            value: "not-contains",
                        },
                        {
                            label: pgettext("block:text", "Text starts with"),
                            value: "starts",
                        },
                        {
                            label: pgettext("block:text", "Text ends with"),
                            value: "ends",
                        },
                        {
                            label: pgettext("block:text", "Text is not empty"),
                            value: "defined",
                        },
                        {
                            label: pgettext("block:text", "Text is empty"),
                            value: "undefined",
                        },
                    ],
                    Forms.Radiobutton.bind(this, "mode", "exact")
                ).on((mode: Forms.Radiobutton<TMode>) => {
                    form.visible(
                        mode.value !== "defined" && mode.value !== "undefined"
                    );

                    switch (mode.value) {
                        case "exact":
                            form.title = pgettext(
                                "block:text",
                                "If text matches"
                            );
                            break;
                        case "not-exact":
                            form.title = pgettext(
                                "block:text",
                                "If text does not match"
                            );
                            break;
                        case "contains":
                            form.title = pgettext(
                                "block:text",
                                "If text contains"
                            );
                            break;
                        case "not-contains":
                            form.title = pgettext(
                                "block:text",
                                "If text does not contain"
                            );
                            break;
                        case "starts":
                            form.title = pgettext(
                                "block:text",
                                "If text starts with"
                            );
                            break;
                        case "ends":
                            form.title = pgettext(
                                "block:text",
                                "If text ends with"
                            );
                            break;
                    }

                    if (textControl.isInteractable) {
                        textControl.focus();
                    }
                }),
            ],
        });

        const isVar = (this.match && isVariable(this.match)) || false;
        const variables = populateVariables(
            this,
            undefined,
            isVar ? this.match : undefined,
            false,
            this.slot?.id
        );
        const textControl = new Forms.Text(
            "singleline",
            !isVar ? this.match : ""
        )
            .label(pgettext("block:text", "Use fixed text"))
            .action("@", insertVariable(this, "exclude"))
            .suggestions(this.block?.suggestions.all)
            .autoFocus()
            .enter(this.editor.close)
            .escape(this.editor.close)
            .on((input) => {
                if (input.isFormVisible && input.isVisible) {
                    this.match = input.value;
                }
            });
        const variableControl = new Forms.Dropdown(
            variables,
            isVar ? this.match : ""
        )
            .label(pgettext("block:text", "Use value of"))
            .width("full")
            .on((variable) => {
                if (variable.isFormVisible && variable.isObservable) {
                    this.match = variable.value || undefined;
                }
            });

        const form = this.editor
            .form({
                title: pgettext("block:text", "If text matches"),
                controls: [
                    new Forms.Radiobutton<"text" | "variable">(
                        [
                            {
                                label: pgettext("block:text", "Text"),
                                value: "text",
                            },
                            {
                                label: pgettext("block:text", "Value"),
                                value: "variable",
                                disabled: variables.length === 0,
                            },
                        ],
                        isVar ? "variable" : "text"
                    ).on((type) => {
                        textControl.visible(type.value === "text");
                        variableControl.visible(type.value === "variable");

                        if (textControl.isInteractable) {
                            textControl.focus();
                        }
                    }),
                    textControl,
                    variableControl,
                    new Forms.Checkbox(
                        pgettext("block:text", "Ignore case"),
                        Forms.Checkbox.bind(this, "ignoreCase", undefined, true)
                    ),
                ],
            })
            .visible(this.mode !== "defined" && this.mode !== "undefined");
    }
}
