import GithubCard from "@/github-card";
import { mount } from "@vue/test-utils";

describe("methods", () => {
  test("composeUrl", () => {
    const { composeUrl } = GithubCard.methods;
    expect(composeUrl(123)).toBe("https://api.github.com/users/123");
    expect(composeUrl("fred")).toBe("https://api.github.com/users/fred");
  });

  /* outdated
  test("fetchData", async () => {
    // const response = await fetch(this.url);
    const jsonMock = jest.fn().mockResolvedValue("GITHUB DATA");
    window.fetch = jest.fn().mockResolvedValue({
      // mockResolvedValue to return a promise that will resolve, an object some data with json as the key
      json: jsonMock,
    });
    // this.data = await response.json();
    // define jsonMock and mock a promite wi

    const wrapper = mount(GithubCard, {
      methods: {
        // this.url = this.composeUrl(this.username)
        composeUrl: () => "url",
      },
    });

    await wrapper.vm.fetchData();

    expect(window.fetch).toHaveBeenCalledWith("url");
    expect(jsonMock).toHaveBeenCalledWith();
    expect(wrapper.vm.data).toBe("GITHUB DATA");
  });
  */

  test("fetchData", async () => {
    // const response = await fetch(this.url);
    const jsonMock = jest.fn().mockResolvedValue("GITHUB DATA");
    window.fetch = jest.fn().mockResolvedValue({
      // mockResolvedValue to return a promise that will resolve, an object some data with json as the key
      json: jsonMock,
    });
    // this.data = await response.json();
    // define jsonMock and mock a promite wi

    const wrapper = mount(GithubCard);

    wrapper.vm.composeUrl = jest.fn().mockReturnValue("url");

    await wrapper.vm.fetchData();

    expect(window.fetch).toHaveBeenCalledWith("url");
    expect(jsonMock).toHaveBeenCalledWith();
    expect(wrapper.vm.data).toBe("GITHUB DATA");
  });
});
