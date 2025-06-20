#include <bits/stdc++.h>
using namespace std;

int LongestSubsequence(int a[], int n)
{
    int ans = 0;
  
      // Traverse every element to check if any 
    // increasing subsequence starts from this index
    for(int i=0; i<n; i++)
    {
          // Initialize cnt variable as 1, which defines 
        // the current length of the increasing subsequence
        int cnt = 1;
        for(int j=i+1; j<n; j++)
            if(a[j] == (a[i]+cnt)) cnt++;
        
      // Update the answer if the current length is 
      // greater than already found length
        ans = max(ans, cnt);
    }
    
    return ans;
}

int main()
{
    int a[] = {6,4,5,6,1,2,3};
    int n = sizeof(a) / sizeof(a[0]);
    cout << LongestSubsequence(a, n);

    return 0;
}