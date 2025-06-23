#include <iostream>
#include <vector>
using namespace std;

int findLongestConsecutiveIncreasingSubsequence(const vector<int>& arr) {
    int maxLen = 1, currLen = 1;

    for (int i = 1; i < arr.size(); i++) {
        if (arr[i] == arr[i - 1] + 1) {
            currLen++;
            maxLen = max(maxLen, currLen);
        } else {
            currLen = 1;
        }
    }

    return maxLen;
}

int main() {
    int N;
    cin >> N;
    vector<int> arr(N);

    for (int i = 0; i < N; i++) {
        cin >> arr[i];
    }

    cout << findLongestConsecutiveIncreasingSubsequence(arr) << endl;
    return 0;
}
