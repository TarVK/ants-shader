import {createAntProgram} from "../createAntProgram";

export const rings = createAntProgram({
    ant: {
        count: 50000,
        intensity: 0.1,
        speed: 0.5,
        steerSpeed: 0.4,
        sensorSize: 2,
        sensorAngle: 1.2,
        sensorOffset: 10,
        randomBorderBounce: true,
    },
    trails: {
        diffuseSpeed: 1e-1,
        evaporateSpeed: 1e-2,
        color: [1, 1, 1],
    },
    initialize: () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.25;
        return [0.5 - Math.cos(dir) * dist, 0.5 - Math.sin(dir) * dist, dir];
    },
});
