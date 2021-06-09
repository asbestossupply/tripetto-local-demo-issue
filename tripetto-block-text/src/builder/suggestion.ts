import {
    Collection,
    Forms,
    Slots,
    definition,
    editor,
    name,
    pgettext,
    score,
} from "tripetto";
import { Text } from ".";

export class TextSuggestion extends Collection.Item<Text> {
    @definition("string")
    @name
    name = "";

    @definition("number", "optional")
    @score
    score?: number;

    @editor
    defineEditor(): void {
        this.editor.option({
            name: pgettext("block:text", "Suggestion"),
            form: {
                title: pgettext("block:text", "Suggestion"),
                controls: [
                    new Forms.Text(
                        "singleline",
                        Forms.Text.bind(this, "name", "")
                    )
                        .autoFocus()
                        .autoSelect()
                        .enter(this.editor.close)
                        .escape(this.editor.close),
                ],
            },
            locked: true,
        });

        const scoreSlot = this.ref.slots.select<Slots.Numeric>(
            "score",
            "feature"
        );

        this.editor.group(pgettext("block:text", "Options"));
        this.editor.option({
            name: pgettext("block:text", "Score"),
            form: {
                title: pgettext("block:text", "Score"),
                controls: [
                    new Forms.Numeric(
                        Forms.Numeric.bind(this, "score", undefined)
                    )
                        .precision(scoreSlot?.precision || 0)
                        .digits(scoreSlot?.digits || 0)
                        .decimalSign(scoreSlot?.decimal || "")
                        .thousands(
                            scoreSlot?.separator ? true : false,
                            scoreSlot?.separator || ""
                        )
                        .prefix(scoreSlot?.prefix || "")
                        .prefixPlural(scoreSlot?.prefixPlural || undefined)
                        .suffix(scoreSlot?.suffix || "")
                        .suffixPlural(scoreSlot?.suffixPlural || undefined),
                ],
            },
            activated: true,
            locked: scoreSlot ? true : false,
            disabled: scoreSlot ? false : true,
        });
    }
}
