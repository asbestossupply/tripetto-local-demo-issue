/** Package information retrieved from `package.json` using webpack. */
declare const PACKAGE_NAME: string;
declare const PACKAGE_VERSION: string;

/** Dependencies */
import {
    Collection,
    Forms,
    NodeBlock,
    Slots,
    affects,
    conditions,
    definition,
    each,
    editor,
    isNumber,
    isString,
    npgettext,
    pgettext,
    slots,
    supplies,
    tripetto,
} from "tripetto";
import { TextCondition } from "./conditions/text";
import { TAutoComplete } from "../runner/autocomplete";
import { TMode } from "../runner/mode";
import { TextSuggestion } from "./suggestion";
import { ScoreCondition } from "./conditions/score";
import { TScoreModes } from "../runner/conditions/score";

/** Assets */
import ICON from "../../assets/text.svg";
import ICON_SCORE from "../../assets/score.svg";

@tripetto({
    type: "node",
    identifier: PACKAGE_NAME,
    version: PACKAGE_VERSION,
    icon: ICON,
    get label() {
        return pgettext("block:text", "Text (single line)");
    },
})
export class Text extends NodeBlock {
    textSlot!: Slots.Text;

    @definition
    autoComplete?: TAutoComplete;

    @definition
    @affects("#label")
    useSuggestions?: boolean;

    @definition("items")
    @affects("#label")
    @supplies<Text>("#slot", "value", false, "useSuggestions")
    readonly suggestions = Collection.of<TextSuggestion, Text>(
        TextSuggestion,
        this
    );

    @definition("string", "optional")
    prefill?: string;

    @definition("number", "optional")
    minLength?: number;

    get label() {
        return this.useSuggestions
            ? npgettext(
                  "block:text",
                  "Text (%1 suggestion)",
                  "Text (%1 suggestions)",
                  this.suggestions.count
              )
            : this.type.label;
    }

    @slots
    defineSlot(): void {
        this.textSlot = this.slots.static({
            type: Slots.Text,
            reference: "value",
            label: pgettext("block:text", "Text"),
            exchange: [
                "required",
                "alias",
                "exportable",
                "maxLength",
                "transformation",
            ],
        });
    }

    @editor
    defineEditor(): void {
        this.editor.name();
        this.editor.description();
        this.editor.placeholder();
        this.editor.explanation();

        this.editor.groups.settings();

        const minLength = new Forms.Numeric(
            Forms.Numeric.bind(this, "minLength", undefined)
        )
            .min(1)
            .max(this.textSlot.maxLength)
            .visible(isNumber(this.minLength))
            .indent(32)
            .on(() => {
                maxLength.min(this.minLength || 1);
            });
        const maxLength = new Forms.Numeric(
            Forms.Numeric.bind(this.textSlot, "maxLength", undefined)
        )
            .min(this.minLength || 1)
            .visible(isNumber(this.textSlot.maxLength))
            .indent(32)
            .on(() => {
                minLength.max(this.textSlot.maxLength);
            });

        this.editor.option({
            name: pgettext("block:text", "Limits"),
            form: {
                title: pgettext("block:text", "Limits"),
                controls: [
                    new Forms.Checkbox(
                        pgettext("block:text", "Minimum"),
                        isNumber(this.minLength)
                    ).on((min) => {
                        minLength.visible(min.isChecked);
                    }),
                    minLength,
                    new Forms.Checkbox(
                        pgettext("block:text", "Maximum"),
                        isNumber(this.textSlot.maxLength)
                    ).on((max) => {
                        maxLength.visible(max.isChecked);
                    }),
                    maxLength,
                ],
            },
            activated:
                isNumber(this.textSlot.maxLength) || isNumber(this.minLength),
        });

        this.editor.option({
            name: pgettext("block:text", "Autocomplete"),
            form: {
                title: pgettext("block:text", "Autocomplete"),
                controls: [
                    new Forms.Radiobutton<TAutoComplete>(
                        [
                            {
                                label: pgettext("block:text", "Name"),
                                value: "name",
                                description: pgettext(
                                    "block:text",
                                    "Person's full name."
                                ),
                            },
                            {
                                label: pgettext("block:text", "Organization"),
                                value: "organization",
                                description: pgettext(
                                    "block:text",
                                    "Company or organization name."
                                ),
                            },
                            {
                                label: pgettext(
                                    "block:text",
                                    "Job/organization title"
                                ),
                                value: "organization-title",
                                description: pgettext(
                                    "block:text",
                                    "Job title, or the title a person has within an organization."
                                ),
                            },
                            {
                                label: pgettext("block:text", "Street address"),
                                value: "street-address",
                                description: pgettext(
                                    "block:text",
                                    "Location of the address within a city or town."
                                ),
                            },
                            {
                                label: pgettext("block:text", "Postal code"),
                                value: "postal-code",
                                description: pgettext(
                                    "block:text",
                                    "Postal code (in the United States, this is the ZIP code)."
                                ),
                            },
                            {
                                label: pgettext(
                                    "block:text",
                                    "City (address level 2)"
                                ),
                                value: "address-level2",
                                description: pgettext(
                                    "block:text",
                                    "City, town, village, or other locality in which the address is located."
                                ),
                            },
                            {
                                label: pgettext(
                                    "block:text",
                                    "Province or state (address level 1)"
                                ),
                                value: "address-level1",
                                description: pgettext(
                                    "block:text",
                                    "Typically the province in which the address is located. In the United States, this would be the state. In Switzerland, the canton. In the United Kingdom, the post town."
                                ),
                            },
                            {
                                label: pgettext("block:text", "Country"),
                                value: "country-name",
                                description: pgettext(
                                    "block:text",
                                    "Name of the country."
                                ),
                            },
                            {
                                label: pgettext(
                                    "block:text",
                                    "Telephone number"
                                ),
                                value: "tel",
                                description: pgettext(
                                    "block:text",
                                    "Full telephone number, including the country code."
                                ),
                            },
                            {
                                label: pgettext(
                                    "block:text",
                                    "Gender identity"
                                ),
                                value: "sex",
                                description: pgettext(
                                    "block:text",
                                    "Gender identity as freeform text."
                                ),
                            },
                            {
                                label: pgettext("block:text", "Username"),
                                value: "username",
                                description: pgettext(
                                    "block:text",
                                    "Username or account name for the active domain."
                                ),
                            },
                        ],
                        Forms.Radiobutton.bind(this, "autoComplete", undefined)
                    ).label(
                        pgettext(
                            "block:text",
                            "Use the following autocomplete attribute for autocompletion:"
                        )
                    ),
                ],
            },
            activated: isString(this.autoComplete),
        });

        const suggestions = this.editor
            .option({
                name: pgettext("block:text", "Suggestions"),
                collection: {
                    collection: this.suggestions,
                    title: pgettext("block:text", "Suggestions"),
                    placeholder: pgettext("block:text", "Unnamed suggestion"),
                    autoOpen: true,
                    editable: true,
                    allowImport: true,
                    allowExport: true,
                    allowDedupe: true,
                    showScores: true,
                    sorting: "manual",
                    emptyMessage: pgettext(
                        "block:text",
                        "Click the + button to add an suggestion..."
                    ),
                },
                activated: this.useSuggestions === true,
            })
            .onToggle(() => {
                this.useSuggestions = suggestions.isActivated
                    ? true
                    : undefined;
            });

        this.editor.transformations(this.textSlot);

        this.editor.groups.options();

        this.editor.option({
            name: pgettext("block:text", "Prefill"),
            form: {
                title: pgettext("block:text", "Prefill"),
                controls: [
                    new Forms.Text(
                        "singleline",
                        Forms.Text.bind(this, "prefill", undefined)
                    ).label(
                        pgettext(
                            "block:text",
                            "Prefill with the following text:"
                        )
                    ),
                ],
            },
            activated: isString(this.prefill),
        });

        this.editor.required(this.textSlot);
        this.editor.visibility();

        this.editor.scores({
            target: this,
            collection: suggestions,
            description: pgettext(
                "block:text",
                "Generates a score based on the selected suggestion. Open the settings panel for each suggestion to set the score."
            ),
        });

        this.editor.alias(this.textSlot);
        this.editor.exportable(this.textSlot);
    }

    @conditions
    defineCondition(): void {
        each(
            [
                {
                    mode: "exact",
                    label: pgettext("block:text", "Text matches"),
                },
                {
                    mode: "not-exact",
                    label: pgettext("block:text", "Text does not match"),
                },
                {
                    mode: "contains",
                    label: pgettext("block:text", "Text contains"),
                },
                {
                    mode: "not-contains",
                    label: pgettext("block:text", "Text does not contain"),
                },
                {
                    mode: "starts",
                    label: pgettext("block:text", "Text starts with"),
                },
                {
                    mode: "ends",
                    label: pgettext("block:text", "Text ends with"),
                },
                {
                    mode: "defined",
                    label: pgettext("block:text", "Text is not empty"),
                },
                {
                    mode: "undefined",
                    label: pgettext("block:text", "Text is empty"),
                },
            ],
            (condition: { mode: TMode; label: string }) => {
                this.conditions.template({
                    condition: TextCondition,
                    label: condition.label,
                    autoOpen:
                        condition.mode !== "defined" &&
                        condition.mode !== "undefined",
                    props: {
                        slot: this.textSlot,
                        mode: condition.mode,
                    },
                });
            }
        );

        const score = this.slots.select("score", "feature");

        if (score && score.label) {
            const group = this.conditions.group(score.label, ICON_SCORE);

            each(
                [
                    {
                        mode: "equal",
                        label: pgettext("block:text", "Score is equal to"),
                    },
                    {
                        mode: "not-equal",
                        label: pgettext("block:text", "Score is not equal to"),
                    },
                    {
                        mode: "below",
                        label: pgettext("block:text", "Score is lower than"),
                    },
                    {
                        mode: "above",
                        label: pgettext("block:text", "Score is higher than"),
                    },
                    {
                        mode: "between",
                        label: pgettext("block:text", "Score is between"),
                    },
                    {
                        mode: "not-between",
                        label: pgettext("block:text", "Score is not between"),
                    },
                    {
                        mode: "defined",
                        label: pgettext("block:text", "Score is calculated"),
                    },
                    {
                        mode: "undefined",
                        label: pgettext(
                            "block:text",
                            "Score is not calculated"
                        ),
                    },
                ],
                (condition: { mode: TScoreModes; label: string }) => {
                    group.template({
                        condition: ScoreCondition,
                        label: condition.label,
                        autoOpen:
                            condition.mode !== "defined" &&
                            condition.mode !== "undefined",
                        props: {
                            slot: score,
                            mode: condition.mode,
                            value: 0,
                            to:
                                condition.mode === "between" ||
                                condition.mode === "not-between"
                                    ? 0
                                    : undefined,
                        },
                    });
                }
            );
        }
    }
}
