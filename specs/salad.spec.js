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
