#include <iostream>
#include <vector>
using namespace std;

void twoSum(vector<int> &arr, int target, vector<int> &ans) {
    int n = arr.size();

    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (arr[i] + arr[j] == target) {
                ans[0] = i;  // use index
                ans[1] = j;
                return;
            }
        }
    }

    ans[0] = -1;
    ans[1] = -1;
}

int main() {
    vector<int> arr = {3,2,4};  // sample input
    int target = 6;
    vector<int> ans(2);

    twoSum(arr, target, ans);
    cout << "[" << ans[0] << "," << ans[1] << "]" << endl;  // match format

    return 0;
}
