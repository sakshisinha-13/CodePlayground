// Write your code here.#include <iostream>
#include<iostream>
#include <vector>
#include <unordered_map>
using namespace std;

int main() {
    int n;
    cin >> n; // number of elements

    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];

    int target;
    cin >> target;

    unordered_map<int, int> mp;
    for (int i = 0; i < n; i++) {
        int rem = target - nums[i];
        if (mp.find(rem) != mp.end()) {
            cout << "[" << mp[rem] << "," << i << "]";
            return 0;
        }
        mp[nums[i]] = i;
    }

    cout << "[]"; // No valid pair found (should not happen based on constraints)
    return 0;
}
