import { ServiceConstructor } from 'mesh-ioc';

export const serviceDescriptors = new Map<string, ServiceDescriptor>();

export interface ServiceDescriptor {
    ctor: ServiceConstructor<any>;
    key: string;
    initPriority: number;
    metadata: Record<string, unknown>;
}

export interface ServiceOptions {
    initPriority?: number;
    metadata?: Record<string, unknown>;
}

export function service(key: string, options: ServiceOptions = {}) {
    return function(ctor: ServiceConstructor<any>) {
        const {
            initPriority = 0,
            metadata = {},
        } = options;
        serviceDescriptors.set(key, {
            ctor,
            key,
            initPriority,
            metadata,
        });
    };
}
