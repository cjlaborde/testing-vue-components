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
5. 





