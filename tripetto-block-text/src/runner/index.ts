/** Dependencies */
import {
    NodeBlock,
    Slots,
    assert,
    findFirst,
    isString,
    validator,
} from "tripetto-runner-foundation";
import { TAutoComplete } from "./autocomplete";
import "./conditions/text";
import "./conditions/score";

export abstract class Text extends NodeBlock<{
    readonly autoComplete?: TAutoComplete;
    readonly prefill?: string;
    readonly minLength?: number;
    readonly useSuggestions?: boolean;
    readonly suggestions?: {
        readonly id: string;
        readonly name: string;
        readonly score?: number;
    }[];
}> {
    /** Contains the score slot. */
    readonly scoreSlot = this.valueOf<number, Slots.Numeric>(
        "score",
        "feature"
    );

    /** Contains the text slot with the value. */
    readonly textSlot = assert(
        this.valueOf<string, Slots.Text>("value", "static", {
            prefill:
                (isString(this.props.prefill) && {
                    value: this.props.prefill,
                }) ||
                undefined,
            modifier: (data) => {
                if (this.props.useSuggestions) {
                    return {
                        value: data.value,
                        reference:
                            (data.value &&
                                findFirst(
                                    this.props.suggestions,
                                    (suggestion) =>
                                        suggestion.name === data.value
                                )?.id) ||
                            undefined,
                    };
                }
            },
            onChange: (slot) => {
                if (this.scoreSlot) {
                    const selected =
                        (this.props.useSuggestions &&
                            findFirst(
                                this.props.suggestions,
                                (suggestion) => suggestion.name === slot.value
                            )) ||
                        undefined;

                    this.scoreSlot.set(selected && (selected?.score || 0));
                }
            },
        })
    );

    /** Contains if the block is required. */
    readonly required = this.textSlot.slot.required || false;

    /** Contains the maximum text length. */
    readonly maxLength = this.textSlot.slot.maxLength;

    /** Contains the autocomplete for the input field. */
    readonly autoComplete?: TAutoComplete = this.props.autoComplete;

    /** Retrieves a list of suggestions. */
    get suggestions(): string[] | undefined {
        return (
            (this.props.useSuggestions &&
                this.props.suggestions?.map((suggestion) => suggestion.name)) ||
            undefined
        );
    }

    @validator
    validate(): boolean {
        return (
            !this.props.minLength ||
            this.textSlot.value.length >= this.props.minLength
        );
    }
}
