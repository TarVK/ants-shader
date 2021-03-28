import {createAntProgram} from "../createAntProgram";

export const square = createAntProgram({
    ant: {
        count: 70000,
        intensity: 0.05,
        speed: 2,
        steerSpeed: 0.05,
        sensorSize: 3,
        sensorAngle: 0.6,
        sensorOffset: 20,
        randomBorderBounce: false,
    },
    trails: {
        diffuseSpeed: 0.5 * 1e-1,
        evaporateSpeed: 5 * 1e-3,
        color: [0.5, 0, 1],
    },
    initialize: () => {
        const p = 0.3;
        const axis = Math.random() > 0.5;
        const side = Math.random() > 0.5;
        const pos = Math.random();
        const dir = Math.random() * Math.PI * 2;
        return [
            0.5 + ((axis ? pos : side ? 1 : 0) * 2 - 1) * p,
            0.5 + ((!axis ? pos : side ? 1 : 0) * 2 - 1) * p,
            dir,
        ];
    },
});
