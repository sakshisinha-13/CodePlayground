#include <iostream>
#include <vector>
#include <string>
#include <map>
#include <climits>
#include <algorithm> 
using namespace std;

// Recursive function to find the shortest transformation chain
int minWordTransform(string start, string target, map<string, int> &mp) {
    // If start word is the same as target, no transformation is needed
    if (start == target) return 1;

    int mini = INT_MAX;

    // Mark current word as visited
    mp[start] = 1;

    // Try changing each character of the word
    for (int i = 0; i < start.size(); i++) {
        char originalChar = start[i];

        // Try all possible lowercase letters at position i
        for (char ch = 'a'; ch <= 'z'; ch++) {
            start[i] = ch;

            // If the new word exists in dictionary and is not visited
            if (mp.find(start) != mp.end() && mp[start] == 0) {
                // Recursive call for next transformation
                mini = min(mini, 1 + minWordTransform(start, target, mp));
            }
        }

        // Restore original character before moving to the next position
        start[i] = originalChar;
    }

    // Mark current word as unvisited (backtracking)
    mp[start] = 0;

    return mini;
}

// Wrapper function to prepare the map and call recursive function
int wordLadder(string start, string target, vector<string>& arr) {
    map<string, int> mp;

    // Initialize all words from the dictionary as unvisited
    for (auto word : arr) {
        mp[word] = 0;
    }

    int result = minWordTransform(start, target, mp);
    if(result==INT_MAX)result = 0;
    return result;
}

// Driver code
int main() {
    vector<string> arr = {"hot","dot","dog","lot","log","cog"};
    string start = "hit";
    string target = "cog";

    cout << wordLadder(start, target, arr) << endl;

    return 0;
}