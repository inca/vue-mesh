import { Mesh } from 'mesh-ioc';
import { App as VueApp, Component, createApp, reactive } from 'vue';

import { serviceDescriptors } from './service';

export class App {

    vue: VueApp;
    mesh: Mesh;
    services: Record<string, any> = {};
    initialized = false;

    constructor(rootComponent: Component = {}, rootProps?: Record<string, unknown>) {
        this.vue = createApp(rootComponent, rootProps);
        this.mesh = new Mesh('App');
        this.mesh.use(_ => reactive(_));
        this.bindServices();
    }

    async init() {
        this.provideServices();
        await this.initServices();
        this.initialized = true;
    }

    bindServices() {
        for (const [key, desc] of serviceDescriptors) {
            this.mesh.service(desc.ctor);
            this.mesh.alias(key, desc.ctor);
        }
    }

    async initServices() {
        const sorted = [...serviceDescriptors.values()].sort((a, b) => a.initPriority < b.initPriority ? 1 : -1);
        for (const desc of sorted) {
            const instance = this.services[desc.key];
            if (typeof instance.init === 'function') {
                try {
                    await instance.init();
                } catch (err) {
                    console.error(`Could not initialize service "${desc.key}""`, err);
                }
            }
        }
    }

    provideServices() {
        for (const key of serviceDescriptors.keys()) {
            const instance = this.mesh.resolve(key);
            this.services[key] = instance;
            this.vue.provide(key, instance);
        }
    }

}
