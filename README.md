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
8. `  expect(wrapper).toMatchSnapshot();`