import {createAntProgram} from "../createAntProgram";

export const circle = createAntProgram({
    ant: {
        count: 50000,
        intensity: 0.05,
        speed: 2,
        steerSpeed: 1,
        sensorSize: 2,
        sensorAngle: 0.2,
        sensorOffset: 10,
        randomBorderBounce: false,
    },
    trails: {
        diffuseSpeed: 2e-1,
        evaporateSpeed: 2e-3,
        color: [0.5, 0.5, 1],
    },
    initialize: () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.3;
        return [0.5 - Math.cos(dir) * dist, 0.5 - Math.sin(dir) * dist, dir];
    },
});
