import { fn } from "@storybook/test";

const layoutGetServerSession = fn(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 100);
  });
})
  .mockName("layoutGetServerSession")
  .mockResolvedValue(null);

layoutGetServerSession.mockImplementation(async () => {
  console.log("in mock implementation");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 100);
  });
});

export { layoutGetServerSession };
