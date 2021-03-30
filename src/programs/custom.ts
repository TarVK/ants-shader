import * as dat from "dat.gui";
import {createAntProgram} from "../createAntProgram";

export const custom = (size: number) => {
    // Track the updater to track when props change
    let updateConfig: ((reset?: boolean) => void) | undefined;
    const update = () => updateConfig?.();
    const updateReset = () => updateConfig?.(true);

    // The initial config
    const config = {
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
            color: [0.5, 0.5, 1] as [number, number, number],
        },
        initialize: (): [number, number, number] => {
            const dir = Math.random() * Math.PI * 2;
            const dist = Math.random() * 0.3;
            return [0.5 - Math.cos(dir) * dist, 0.5 - Math.sin(dir) * dist, dir];
        },
        restart: updateReset,
    };

    // Create the GUI
    const gui = new dat.GUI({name: "shader props"});
    gui.add(config, "restart");

    // Add ant properties
    const ant = gui.addFolder("ants");
    ant.add(config.ant, "count", 1, 1e5, 1).onChange(updateReset);
    ant.add(config.ant, "intensity", 0, 1);
    ant.add(config.ant, "speed", 0.01, 5).onChange(update);
    ant.add(config.ant, "steerSpeed", 1e-3, 2).onChange(update);
    ant.add(config.ant, "sensorSize", 1, 10, 1).onChange(update);
    ant.add(config.ant, "sensorAngle", 0.05, 2).onChange(update);
    ant.add(config.ant, "sensorOffset", 1, 10).onChange(update);
    ant.add(config.ant, "randomBorderBounce").onChange(update);

    // Add trails properties
    const trails = gui.addFolder("trails");
    trails.add(config.trails, "diffuseSpeed", 1e-2, 0.999).onChange(update);
    trails.add(config.trails, "evaporateSpeed", 2e-3, 0.1).onChange(update);
    const intColor = {color: [128, 128, 255]};
    trails.addColor(intColor, "color").onChange(() => {
        const c = intColor.color;
        config.trails.color = [c[0] / 255, c[1] / 255, c[2] / 255];
        update();
    });

    // Initialize options
    const init = gui.addFolder("init");
    const initConfig = {initialize: "circle" as keyof typeof initOptions, size: 0.3};
    const updateInit = () => {
        config.initialize = initOptions[initConfig.initialize](initConfig.size);
        updateReset();
    };
    init.add(initConfig, "initialize", Object.keys(initOptions)).onChange(updateInit);
    init.add(initConfig, "size", 0, 1).onChange(updateInit);

    // Wrap the original program and add the controls
    const {canvas, start, stop} = createAntProgram(config, u => {
        updateConfig = u;
    })(size);
    const div = document.createElement("div");
    div.appendChild(canvas);
    div.appendChild(gui.domElement);
    return {
        canvas: div,
        start,
        stop,
    };
};

// The initialization options
const initOptions: Record<string, (size: number) => () => [number, number, number]> = {
    circle: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = ((Math.random() * 2 - 1) * size) / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleIn: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = (-Math.random() * size) / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleOut: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = (Math.random() * size) / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleRing: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = (Math.random() * size) / 2;
        return [
            0.5 + Math.cos(dir) * dist,
            0.5 + Math.sin(dir) * dist,
            dir + Math.PI / 2,
        ];
    },
    circleRingDual: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = (Math.random() * size) / 2;
        const side = Math.random() > 0.5 ? 1 : -1;
        return [
            0.5 + Math.cos(dir) * dist,
            0.5 + Math.sin(dir) * dist,
            dir + (side * Math.PI) / 2,
        ];
    },
    circleOutline: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = ((Math.round(Math.random()) * 2 - 1) * size) / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleOutlineIn: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = -size / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleOutlineOut: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = size / 2;
        return [0.5 + Math.cos(dir) * dist, 0.5 + Math.sin(dir) * dist, dir];
    },
    circleOutlineRing: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = size / 2;
        return [
            0.5 + Math.cos(dir) * dist,
            0.5 + Math.sin(dir) * dist,
            dir + Math.PI / 2,
        ];
    },
    circleOutlineRingDual: size => () => {
        const dir = Math.random() * Math.PI * 2;
        const dist = size / 2;
        const side = Math.random() > 0.5 ? 1 : -1;
        return [
            0.5 + Math.cos(dir) * dist,
            0.5 + Math.sin(dir) * dist,
            dir + (side * Math.PI) / 2,
        ];
    },
    full: size => () => [Math.random(), Math.random(), Math.random() * Math.PI * 2],
};
