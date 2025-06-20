function twoSum(nums, target) {
  const map = new Map(); // number -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }

  return [-1, -1];
}

// Read from stdin
const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim().split(/\s+/);

// First value is array size
const n = parseInt(input[0]);
const nums = input.slice(1, 1 + n).map(Number);
const target = parseInt(input[1 + n]);

const result = twoSum(nums, target);
console.log(JSON.stringify(result));
