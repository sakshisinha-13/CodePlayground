// Write your code here.
#include <iostream>
#include <unordered_set>
#include <queue>
#include <string>
#include <vector>

using namespace std;

int wordLadderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());

    if (wordSet.find(endWord) == wordSet.end())
        return 0;

    queue<pair<string, int>> q;
    q.push({beginWord, 1});

    while (!q.empty()) {
        auto [word, steps] = q.front();
        q.pop();

        if (word == endWord) return steps;

        for (int i = 0; i < word.length(); ++i) {
            string temp = word;
            for (char c = 'a'; c <= 'z'; ++c) {
                temp[i] = c;
                if (wordSet.find(temp) != wordSet.end()) {
                    q.push({temp, steps + 1});
                    wordSet.erase(temp); // remove to prevent revisiting
                }
            }
        }
    }

    return 0;
}

int main() {
    string beginWord, endWord;
    int n;
    cin >> beginWord >> endWord >> n;
    
    vector<string> wordList(n);
    for (int i = 0; i < n; ++i) {
        cin >> wordList[i];
    }

    cout << wordLadderLength(beginWord, endWord, wordList) << endl;
    return 0;
}
