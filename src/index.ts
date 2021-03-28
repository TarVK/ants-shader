import {random} from "./programs/random";
import {randomTight} from "./programs/randomTight";
import {circle} from "./programs/circle";
import {diagonal} from "./programs/diagonal";
import {nerves} from "./programs/nerves";
import {blobs} from "./programs/blobs";
import {cells} from "./programs/cells";
import {ants} from "./programs/ants";
import {rings} from "./programs/rings";
import {square} from "./programs/square";

const programs = {
    random,
    randomTight,
    diagonal,
    circle,
    nerves,
    blobs,
    cells,
    ants,
    rings,
    square,
};

// Create a function to change programs
let stopPrev: () => void | undefined;
function select(programName: keyof typeof programs): void {
    const program = programs[programName];
    if (!program) return;

    stopPrev?.();

    const {canvas, stop} = program(900);
    document.getElementsByTagName("body")[0].appendChild(canvas);
    stopPrev = () => {
        canvas.remove();
        stop();
    };
}

// Create a dropdown to select program
const selectControl = document.createElement("select");
Object.keys(programs).forEach(name => {
    var option = document.createElement("option"),
        text = document.createTextNode(name);
    option.appendChild(text);
    selectControl.appendChild(option);
});
document.body.appendChild(selectControl);
selectControl.addEventListener("change", () => {
    select(selectControl.value as keyof typeof programs);
});
const newline = document.createElement("br");
document.body.appendChild(newline);

// Initialize the first program
const keys = Object.keys(programs);
select(keys[0] as any);
