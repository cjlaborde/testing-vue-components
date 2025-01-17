### Mounting components wirh vue test utils
1. `npm install --save-dev @vue/test-utils@1`

2. Update snapshot `yarn jest specs/test.spec.js -u`
3. shallowMounts
   1. Is the same as normal mount method
   2. But child components will get stub automatically

```html
  console.log specs/test.spec.js:21

    <div>
      <ul>
        # Real items printed out
        <li><strong>Iron Man</strong></li>
        <li><strong>Avengers</strong></li>
        <li><strong>Infitinity War</strong></li>
      </ul>
    </div>

  console.log specs/test.spec.js:22
    <div>
      <ul>
        # Stubbed items printed out
        <listitem-stub movie="Iron Man"></listitem-stub>
        <listitem-stub movie="Avengers"></listitem-stub>
        <listitem-stub movie="Infitinity War"></listitem-stub>
      </ul>
    </div>
``` 

4. Use mount as default approach as it helps to detect potential errors regarding child componets early


### The Wrapper Object
1. vm is the access to the vue intance that you can interact with
2. setData
3. Vue Test Utils removed synchronous updating from the library: https://github.com/vuejs/vue-test-utils/issues/1137
4. Hence why Engame was not appearing so you need to add async and await
```js
test("ListComponent", async () => {
  const wrapper = mount(List);
  //   console.log(wrapper);
  // we can pick data using vm which access the vue instance
  const movies = wrapper.vm.marvelMovies;
  // user setData to update the actual dataset

  /* we are passing the key of the data set that we want to overrule */
  // To not lose the current existing movies, we just spread them into the same array, again
  await wrapper.setData({ marvelMovies: [...movies, "Endgame"] });

  console.log(wrapper.html());
  expect(wrapper.html()).toMatchSnapshot();
});
```


5. jest-serializer-vue is the package that was added that makes snapshot easier to read
6. Because of jest.config.js `  snapshotSerializers: ["<rootDir>/node_modules/jest-serializer-vue"],`
7. We can remove .html()
8. `expect(wrapper).toMatchSnapshot();`


### Learn How To Test Computed Properties and Watchers
#### Computed
1. We will test computed & watch from the temparature.vue component
2. to automatically continue to test use `yarn jest specs/temp.spec.js --watch`
3. We do not need to use setData
4. Reason it works is because setData is used for when we care about the template
   Template is the element that gets updated async for performance reasons
   While our computed properties react right away
```js
// wrapper.setData({ degrees: 23 });
    wrapper.vm.degrees = 23;
```
5. We can do some refactoring so that we can make test that only care about functionally even cleaner
```js
describe("computed", () => {
  test("celsius", () => {
    const wrapper = mount(Temprature);
    expect(wrapper.vm.celsius).toBe(0);
    // wrapper.setData({ degrees: 23 });
    wrapper.vm.degrees = 23;
    expect(wrapper.vm.celsius).toBe(23);
  });
});
```
**To**

```js
describe("computed", () => {
  test("celsius", () => {
    const { vm } = mount(Temprature);
    expect(vm.celsius).toBe(0);
    // setData({ degrees: 23 });
    vm.degrees = 23;
    expect(vm.celsius).toBe(23);
  });
});
```
6. Test still pass and is easier to read
7. Test fahrenheit now
8. We need to convert 16C to fahrenheit result is 60.8 <https://www.google.com/search?q=16c+to+f>
#### Watch method
1. Now we going to test Watch method
2. Mount of test Temperature component with some prop data
```js
  const { vm } = mount(Temprature, {
      propsData: {
          temp: 40
      }
  });
```
3. Perform test
```js
describe("watch", () => {
  // Mount of test Temperature component with some prop data
  const { vm } = mount(Temprature, {
    propsData: {
      temp: 40,
    },
  });
  expect(vm.degrees).toBe(40);
  expect(vm.type).toBe("celsius");
});
```
4. instead of separate we can test both celsius and fahrenheit
5. We can use setPros to allow us to change props while the component is mounted already
6. Had same problem and had to add Async with await to make code work   

### Learn How To Test Vue.js Methods
1. Get the component from the component ` const { composeUrl } = GithubCard.methods;`
2. We can run the function as often as we want since is not impacting the vue instance
```js
describe("methods", () => {
  test("composeUrl", () => {
    const { composeUrl } = GithubCard.methods;
    expect(composeUrl(123).toBe("https://api.github.com/users/123"));
    expect(composeUrl("fred").toBe("https://api.github.com/users/fred"));
  });
});
```
3. Now we will test `fetchData`
4. We can get the original code and put it in code to plan what we do piece by piece
5. We can pass methods in mount options
```js
  test("fetchData", () => {
    const wrapper = mount(GithubCard, {
      methods: {
        // this.url = this.composeUrl(this.username)
        // we will always use same url in this rest so just make it static
        composeUrl: () => "url",
      },
    });
```   
6. `const response = await fetch(this.url);` more tricky, so we use mock
7. We can define for now the mock right in the function
```js
   // mockResolvedValue to return a promise that will resolve, an object some data with json as the key
    window.fetch = jest.fn().mockResolvedValue({
      json: "data",
    });
 ```
8. Another resolve `this.data = await response.json();`

9. You need to remove methods since is deprecreated and mock it like this instead 
 `wrapper.vm.composeUrl = jest.fn().mockReturnValue("url");`


### Learn How to Test Vue.js Lifecycle Methods
1. check that the mounted method ran after mounting the Component `    expect(wrapper.vm.interval).not.toBe(undefined);`
2. Now we need to check if code in interval ran correctly but that is tricky
3. When ever we work with timer functions I recommend to use jest fake timers
```js
    expect(wrapper.vm.counter).toBe(0);
    // 1000 = 1 second
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.counter).toBe(1);
```

4. Then check again to make sure is working properly 
```js
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.counter).toBe(1);
    jest.advanceTimersByTime(1000);
    expect(wrapper.vm.counter).toBe(2);
```
5. Now we need to test if instance gets destroyed
6. Since we going to reuse `jest.useFakeTimers();` Put the line of code outside the tests
7. We going to use Spies lets us watch a function and tell us if it called or not
8. Is important that we set up the spies before vue mounts the instance since vue transform the object into vm object
9. We going to use -1 since this save us if we use another number in the future test would still work
10. Check that when we advance the timer the spy was correctly called
```js
    wrapper.vm.counter = wrapper.vm.timer - 1;
    jest.advanceTimersByTime(1000);
    expect(beforeDestroyedSpy).toHaveBeenCalled();
```

### Traversing The DOM
1. we going to learn how to find elements in DOM element representation of vue and how to fire events like click
2. We can use wrapper.find to find elements `  const button = wrapper.find("button");`
3. We then assign the value to fruit with input and trigger it
```js
  input.element.value = "banana";
  input.trigger("input");
```
4. The we trigger button with a click to remove the fruit from fruits and then check they where moved to the basket
```js
  await button.trigger("click");
  expect(wrapper.vm.fruit).toBe("");
  expect(wrapper.vm.basket).toEqual(expect.arrayContaining(["banana"]));
  expect(wrapper.findAll("li").length).toBe(1);
```

### How to Stub a Vue.js Child Component
1. Stubbing Means we replace the implementation of something existing with one that fits our need  for testing
2. Similar to mocking but often more complex in implementation
3. When you use shallowMount it creates stubs automatically
```js
test("shallowMount", () => {
  const wrapper = shallowMount(ListComponent);
  expect(wrapper).toMatchSnapshot();
});
```
4. We can see the snap generated inside the snapshot
```html
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`shallowMount 1`] = `
<div>
  <ul>
    <listitem-stub movie="Iron Man"></listitem-stub>
    <listitem-stub movie="Avengers"></listitem-stub>
    <listitem-stub movie="Infitinity War"></listitem-stub>
  </ul>
</div>
`;
```

5. To get access to the stubs we can use options and add second argument to define our own stubs
```js
test("shallowMount", () => {
  const wrapper = shallowMount(ListComponent, {
    stubs: {
      ListItem: `<div class="list-item" />`,
    },
  });
  expect(wrapper).toMatchSnapshot();
});

```
6. Now we can compare to the one we added with the one that was automatically generated
```html
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`shallowMount 1`] = `
<div>
  <ul>
    <listitem-stub movie="Iron Man"></listitem-stub>
    <listitem-stub movie="Avengers"></listitem-stub>
    <listitem-stub movie="Infitinity War"></listitem-stub>
  </ul>
</div>
`;

```
7. Now lets define a stub component and we would prepare as it we would prepare any vue option
```js
const ListItemStub = {
  template: `<li>{{ movie }}</li>`,
  props: ["movie"],
};
```
8. Compare again
```html

    - Snapshot
    + Received

      <div>
        <ul>
    -     <listitem-stub movie="Iron Man"></listitem-stub>
    -     <listitem-stub movie="Avengers"></listitem-stub>
    -     <listitem-stub movie="Infitinity War"></listitem-stub>
    +     <li>Iron Man</li>
    +     <li>Avengers</li>
    +     <li>Infitinity War</li>
        </ul>
      </div>

```
9. If you like it you can update the stub by pressing **u**


### How to test that a Vuex Store is injected into a Vue.js component
1. Add vuex to the test and then connect the component to the store
```js
test("store is loaded ", () => {
  const wrapper = mount(SaladBowlComponent, {
    store,
  });
  store.state.salad.push("cucumber");

  expect(wrapper.vm.salad).toEqual(["cucumber"]);
});
```
2. Second test fails because we need to add individual test to each store
3. So I added a beforeEach
4. Problem now is that we are polluting the global vue object
5. To resolve this issue use createLocalVue() to create a local vue instance
6. Then we need to pass it down via mount option
```js
import Vuex from "vuex";
// import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";

import SaladBowlComponent from "@/salad-bowl";
import saladStore from "@/store/salad-store";

const localVue = createLocalVue();

localVue.use(Vuex);

let store;

beforeEach(() => {
  store = new Vuex.Store(saladStore);
});

test("store is loaded ", () => {
  const wrapper = mount(SaladBowlComponent, {
    store,
    localVue,
  });
  store.state.salad.push("cucumber");

  expect(wrapper.vm.salad).toEqual(["cucumber"]);
});

test("store works", () => {
  const wrapper = mount(SaladBowlComponent, {
    store,
    localVue,
  });
  wrapper.vm.addIngredient("tomato");
  expect(wrapper.vm.salad).toEqual(["tomato"]);
});
```
