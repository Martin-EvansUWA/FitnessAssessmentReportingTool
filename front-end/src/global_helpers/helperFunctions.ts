export class HelperFunctions {
    static handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        const isControlA = (event.ctrlKey || event.metaKey) && key === "a";
        // Allow only numbers and control keys
        if (
            !/^\d$/.test(key) &&
            key !== "Backspace" &&
            key !== "Delete" &&
            key !== "ArrowLeft" &&
            key !== "ArrowRight" &&
            key !== "Tab" &&
            !isControlA
        ) {
            event.preventDefault();
        }
    };

    static handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = event.clipboardData.getData("text");
        if (!/^\d+$/.test(pasteData)) {
            event.preventDefault();
        }
    };
}
