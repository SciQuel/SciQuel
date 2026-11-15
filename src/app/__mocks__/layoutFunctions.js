export async function layoutGetServerSession() {
  console.log("in mock implementation");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 100);
  });
}
