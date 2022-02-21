import TesComponent from "@/test";
import List from "@/list";

import { mount, shallowMount } from "@vue/test-utils";

// Snapshot test //
test("mount a vue component", () => {
  const wrapper = mount(TesComponent, {
    propsData: {
      value: "VueSchool",
    },
  });
  expect(wrapper.html()).toMatchSnapshot();
  //   console.log(wrapper);
});

// shallowMount
test("ListComponent Shallow", () => {
  console.log(mount(List).html());
  console.log(shallowMount(List).html());
});
