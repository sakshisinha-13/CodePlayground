#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

int longestConsecutiveSubseq(const vector<int>& arr) {
    unordered_set<int> s(arr.begin(), arr.end());
    int maxLen = 0;

    for (int num : s) {
        // Start a new sequence only if num - 1 is not in the set
        if (s.find(num - 1) == s.end()) {
            int currNum = num;
            int currLen = 1;

            while (s.find(currNum + 1) != s.end()) {
                currNum++;
                currLen++;
            }

            maxLen = max(maxLen, currLen);
        }
    }
    return maxLen;
}

int main() {
    int n;
    cin >> n;
    vector<int> arr(n);
    for(int i = 0; i < n; ++i) {
        cin >> arr[i];
    }
    cout << longestConsecutiveSubseq(arr);
    return 0;
}
