import TestComponent from "@/test";
import List from "@/list";

import { mount, shallowMount } from "@vue/test-utils";

// Snapshot test //
test("mount a vue component", () => {
  const wrapper = mount(TestComponent, {
    propsData: {
      value: "VueSchool",
    },
  });
  expect(wrapper).toMatchSnapshot();
  //   console.log(wrapper);
});

// shallowMount
// test.skip("ListComponent Shallow", () => {
//   console.log(mount(List).html());
//   console.log(shallowMount(List).html());
// });

test("ListComponent", async () => {
  const wrapper = mount(List);
  //   console.log(wrapper);
  // we can pick data using vm which access the vue instance
  const movies = wrapper.vm.marvelMovies;
  // user setData to update the actual dataset

  /* we are passing the key of the data set that we want to overrule */
  // To not lose the current existing movies, we just spread them into the same array, again
  await wrapper.setData({ marvelMovies: [...movies, "Endgame"] });

  expect(wrapper).toMatchSnapshot();
});
