import UserList from "@/exercise-1";
import { mount } from "@vue/test-utils";
import faker from "@faker-js/faker";

test("component renders the users", () => {
  const wrapper = mount(UserList, {
    propsData: {
      users: [faker.name.findName()],
    },
  });

  const li = wrapper.find("li");
  //   console.log(wrapper.props("users")[0]);
  expect(li.text()).toBe(wrapper.props("users")[0]);
});
