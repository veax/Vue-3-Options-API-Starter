import { mount } from "@vue/test-utils"
import HelloWorld from "@/components/HelloWorld.vue"

describe("HelloWorld", () => {
  it("should display header text", () => {
    const msg = "Vite + Vue"
    const wrapper = mount(HelloWorld, { props: { msg } })

    expect(wrapper.find("h1").text()).toEqual(msg)
  })
})
