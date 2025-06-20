#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Function to check if x is a majority element
bool isMajorityElement(const vector<int>& arr, int x) {
    int n = arr.size();
    // Use lower_bound to find first occurrence
    auto it = lower_bound(arr.begin(), arr.end(), x);
    if (it == arr.end() || *it != x) return false;

    int firstIndex = it - arr.begin();
    int lastIndex = upper_bound(arr.begin(), arr.end(), x) - arr.begin() - 1;
    int count = lastIndex - firstIndex + 1;

    return count > (n / 2);
}

int main() {
    int N;
    cin >> N;

    vector<int> arr(N);
    for (int i = 0; i < N; ++i) {
        cin >> arr[i];
    }

    int x;
    cin >> x;

    bool result = isMajorityElement(arr, x);
    cout << (result ? "True" : "False") << endl;

    return 0;
}
