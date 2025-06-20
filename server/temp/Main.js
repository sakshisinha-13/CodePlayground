// Write your code here.
function isMajorityElement(input) {
  const parts = input.trim().split(" ").map(Number);
  const N = parts[0];
  const arr = parts.slice(1, N + 1); // first N elements after N
  const x = parts[N + 1];

  // Function to find first occurrence of x
  const firstIndex = arr.indexOf(x);
  if (firstIndex === -1) return false;

  const lastIndex = arr.lastIndexOf(x);
  const count = lastIndex - firstIndex + 1;

  return count > Math.floor(N / 2);
}
