# Vue 3 + Mesh IoC Microframework

Very opinionated Vue 3 + [Mesh IoC](https://github.com/inca/mesh-ioc) microframework.

## Installation

Both Vue 3 and Mesh IoC are required as peer dependencies.

```
npm i --save vue@3 mesh-ioc @inca/vue-mesh
```

## Usage

Define one or more services — classes with zero-arg constructors that hold _state_ and provide access to it via _methods_:

```ts
@service('counter')
export class Counter {
    // All class fields automatically become reactive
    value = 0;

    incr() {
        this.value += 1;
    }
}
```

Then services can be injected in Vue components:

```vue
<template>
    <div class="Counter">
        Current value is <strong>{{ counter.value }}</strong>
        <button @click="counter.incr()">Increment</button>
    </div>
</template>

<script>
export default {
    inject: ['counter'],
}
</script>
```

Finally, define the application entrypoint:

```
const app = new App(/* can pass options for Vue.createApp here */);
// Register global components, directives, etc.
app.init().then(() => {
    app.vue.mount('#root');
});

```
