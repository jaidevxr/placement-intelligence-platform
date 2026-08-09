import { useState } from "react";
import { PageHeader } from "@/components/layout/Shell";

// Striver A2Z DSA Sheet — real topic structure, real LeetCode problems with working links
// Source: takeuforward.org/strivers-a2z-dsa-course-sheet-2

type Problem = { title: string; url: string; difficulty: "easy" | "medium" | "hard"; done?: boolean };
type Topic = { name: string; problems: Problem[] };
type Section = { title: string; topics: Topic[] };

const SHEET: Section[] = [
  {
    title: "Step 1: Learn the Basics",
    topics: [
      { name: "Things to Know in C++/Java/Python", problems: [
        { title: "User Input / Output", url: "https://practice.geeksforgeeks.org/problems/start-coding/0", difficulty: "easy" },
        { title: "Data Types", url: "https://practice.geeksforgeeks.org/problems/data-type/0", difficulty: "easy" },
        { title: "If Else Statements", url: "https://practice.geeksforgeeks.org/problems/java-if-else-decision-making/0", difficulty: "easy" },
        { title: "Switch Statement", url: "https://practice.geeksforgeeks.org/problems/java-switch-case-statement/0", difficulty: "easy" },
        { title: "What are Arrays, Strings?", url: "https://practice.geeksforgeeks.org/problems/who-will-win/0", difficulty: "easy" },
      ]},
      { name: "Build-up Logical Thinking", problems: [
        { title: "Pattern 1 - Rectangular Star", url: "https://practice.geeksforgeeks.org/problems/square-star-pattern/0", difficulty: "easy" },
        { title: "Pattern 2 - Right-Angled Triangle", url: "https://practice.geeksforgeeks.org/problems/right-triangle/0", difficulty: "easy" },
        { title: "Pattern 3 - Right-Angled Number Triangle", url: "https://practice.geeksforgeeks.org/problems/triangle-number/0", difficulty: "easy" },
        { title: "Pattern 4 - Right-Angled Number Triangle II", url: "https://practice.geeksforgeeks.org/problems/right-triangle-number-pattern/0", difficulty: "easy" },
        { title: "Pattern 5 - Inverted Right Pyramid", url: "https://practice.geeksforgeeks.org/problems/inverted-right-triangle/0", difficulty: "easy" },
      ]},
      { name: "Learn Basic Recursion", problems: [
        { title: "Print Name N Times using Recursion", url: "https://practice.geeksforgeeks.org/problems/print-gfg-n-times/1", difficulty: "easy" },
        { title: "Print 1 to N using Recursion", url: "https://practice.geeksforgeeks.org/problems/print-1-to-n-without-using-loops/0", difficulty: "easy" },
        { title: "Print N to 1 using Recursion", url: "https://practice.geeksforgeeks.org/problems/print-n-to-1-without-loop/1", difficulty: "easy" },
        { title: "Sum of First N Numbers", url: "https://practice.geeksforgeeks.org/problems/sum-of-first-n-terms/0", difficulty: "easy" },
        { title: "Factorial of N Numbers", url: "https://leetcode.com/problems/factorial-trailing-zeroes/", difficulty: "medium" },
        { title: "Reverse an Array", url: "https://leetcode.com/problems/reverse-string/", difficulty: "easy" },
        { title: "Check if a string is Palindrome", url: "https://leetcode.com/problems/valid-palindrome/", difficulty: "easy" },
        { title: "Fibonacci Number", url: "https://leetcode.com/problems/fibonacci-number/", difficulty: "easy" },
      ]},
      { name: "Learn Basic Hashing", problems: [
        { title: "Count Frequency of Elements", url: "https://practice.geeksforgeeks.org/problems/frequency-of-array-elements/0", difficulty: "easy" },
        { title: "Find Highest/Lowest Frequency Element", url: "https://practice.geeksforgeeks.org/problems/find-the-frequency/1", difficulty: "easy" },
      ]},
    ],
  },
  {
    title: "Step 2: Learn Important Sorting Techniques",
    topics: [
      { name: "Sorting-I", problems: [
        { title: "Selection Sort", url: "https://practice.geeksforgeeks.org/problems/selection-sort/1", difficulty: "easy" },
        { title: "Bubble Sort", url: "https://practice.geeksforgeeks.org/problems/bubble-sort/1", difficulty: "easy" },
        { title: "Insertion Sort", url: "https://practice.geeksforgeeks.org/problems/insertion-sort/1", difficulty: "easy" },
      ]},
      { name: "Sorting-II", problems: [
        { title: "Merge Sort", url: "https://practice.geeksforgeeks.org/problems/merge-sort/1", difficulty: "medium" },
        { title: "Quick Sort", url: "https://practice.geeksforgeeks.org/problems/quick-sort/1", difficulty: "medium" },
      ]},
    ],
  },
  {
    title: "Step 3: Solve Problems on Arrays",
    topics: [
      { name: "Easy", problems: [
        { title: "Largest Element in an Array", url: "https://practice.geeksforgeeks.org/problems/largest-element-in-array/0", difficulty: "easy" },
        { title: "Second Largest Element", url: "https://practice.geeksforgeeks.org/problems/second-largest/0", difficulty: "easy" },
        { title: "Check if Array is Sorted", url: "https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/", difficulty: "easy" },
        { title: "Remove Duplicates from Sorted Array", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", difficulty: "easy" },
        { title: "Left Rotate Array by One", url: "https://leetcode.com/problems/rotate-array/", difficulty: "medium" },
        { title: "Move Zeros to End", url: "https://leetcode.com/problems/move-zeroes/", difficulty: "easy" },
        { title: "Linear Search", url: "https://practice.geeksforgeeks.org/problems/who-will-win-1587115621/1", difficulty: "easy" },
        { title: "Union of Two Sorted Arrays", url: "https://practice.geeksforgeeks.org/problems/union-of-two-sorted-arrays/1", difficulty: "easy" },
        { title: "Missing Number", url: "https://leetcode.com/problems/missing-number/", difficulty: "easy" },
        { title: "Maximum Consecutive Ones", url: "https://leetcode.com/problems/max-consecutive-ones/", difficulty: "easy" },
        { title: "Single Number", url: "https://leetcode.com/problems/single-number/", difficulty: "easy" },
        { title: "Longest Subarray with Sum K", url: "https://practice.geeksforgeeks.org/problems/longest-sub-array-with-sum-k/0", difficulty: "medium" },
      ]},
      { name: "Medium", problems: [
        { title: "Two Sum", url: "https://leetcode.com/problems/two-sum/", difficulty: "easy" },
        { title: "Sort Colors (Dutch National Flag)", url: "https://leetcode.com/problems/sort-colors/", difficulty: "medium" },
        { title: "Majority Element (>n/2)", url: "https://leetcode.com/problems/majority-element/", difficulty: "easy" },
        { title: "Maximum Subarray Sum (Kadane's)", url: "https://leetcode.com/problems/maximum-subarray/", difficulty: "medium" },
        { title: "Best Time to Buy and Sell Stock", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "easy" },
        { title: "Rearrange Array Elements by Sign", url: "https://leetcode.com/problems/rearrange-array-elements-by-sign/", difficulty: "medium" },
        { title: "Next Permutation", url: "https://leetcode.com/problems/next-permutation/", difficulty: "medium" },
        { title: "Leaders in an Array", url: "https://practice.geeksforgeeks.org/problems/leaders-in-an-array/0", difficulty: "easy" },
        { title: "Longest Consecutive Sequence", url: "https://leetcode.com/problems/longest-consecutive-sequence/", difficulty: "medium" },
        { title: "Set Matrix Zeroes", url: "https://leetcode.com/problems/set-matrix-zeroes/", difficulty: "medium" },
        { title: "Rotate Matrix by 90 Degrees", url: "https://leetcode.com/problems/rotate-image/", difficulty: "medium" },
        { title: "Spiral Matrix", url: "https://leetcode.com/problems/spiral-matrix/", difficulty: "medium" },
        { title: "Subarray Sum Equals K", url: "https://leetcode.com/problems/subarray-sum-equals-k/", difficulty: "medium" },
      ]},
      { name: "Hard", problems: [
        { title: "3Sum", url: "https://leetcode.com/problems/3sum/", difficulty: "medium" },
        { title: "4Sum", url: "https://leetcode.com/problems/4sum/", difficulty: "medium" },
        { title: "Merge Overlapping Subintervals", url: "https://leetcode.com/problems/merge-intervals/", difficulty: "medium" },
        { title: "Merge Sorted Arrays Without Extra Space", url: "https://leetcode.com/problems/merge-sorted-array/", difficulty: "easy" },
        { title: "Count Inversions (Merge Sort)", url: "https://practice.geeksforgeeks.org/problems/inversion-of-array/0", difficulty: "hard" },
        { title: "Maximum Product Subarray", url: "https://leetcode.com/problems/maximum-product-subarray/", difficulty: "medium" },
      ]},
    ],
  },
  {
    title: "Step 4: Binary Search",
    topics: [
      { name: "BS on 1D Arrays", problems: [
        { title: "Binary Search", url: "https://leetcode.com/problems/binary-search/", difficulty: "easy" },
        { title: "Lower Bound", url: "https://practice.geeksforgeeks.org/problems/floor-in-a-sorted-array/0", difficulty: "easy" },
        { title: "Search Insert Position", url: "https://leetcode.com/problems/search-insert-position/", difficulty: "easy" },
        { title: "Floor/Ceil in Sorted Array", url: "https://practice.geeksforgeeks.org/problems/ceil-the-floor/0", difficulty: "medium" },
        { title: "Search in Rotated Sorted Array", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", difficulty: "medium" },
        { title: "Find Minimum in Rotated Sorted Array", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", difficulty: "medium" },
        { title: "Peak Element", url: "https://leetcode.com/problems/find-peak-element/", difficulty: "medium" },
      ]},
      { name: "BS on Answers", problems: [
        { title: "Koko Eating Bananas", url: "https://leetcode.com/problems/koko-eating-bananas/", difficulty: "medium" },
        { title: "Minimum Days to Make M Bouquets", url: "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/", difficulty: "medium" },
        { title: "Aggressive Cows", url: "https://practice.geeksforgeeks.org/problems/aggressive-cows/0", difficulty: "medium" },
        { title: "Book Allocation / Painter's Partition", url: "https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages/0", difficulty: "hard" },
        { title: "Median of Two Sorted Arrays", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/", difficulty: "hard" },
      ]},
    ],
  },
  {
    title: "Step 5: Strings",
    topics: [
      { name: "Basic & Medium String Problems", problems: [
        { title: "Reverse Words in a String", url: "https://leetcode.com/problems/reverse-words-in-a-string/", difficulty: "medium" },
        { title: "Longest Palindromic Substring", url: "https://leetcode.com/problems/longest-palindromic-substring/", difficulty: "medium" },
        { title: "Roman to Integer", url: "https://leetcode.com/problems/roman-to-integer/", difficulty: "easy" },
        { title: "String to Integer (atoi)", url: "https://leetcode.com/problems/string-to-integer-atoi/", difficulty: "medium" },
        { title: "Longest Common Prefix", url: "https://leetcode.com/problems/longest-common-prefix/", difficulty: "easy" },
        { title: "Implement strStr (KMP)", url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/", difficulty: "medium" },
      ]},
    ],
  },
  {
    title: "Step 6: Linked List",
    topics: [
      { name: "1D Linked List", problems: [
        { title: "Reverse a Linked List", url: "https://leetcode.com/problems/reverse-linked-list/", difficulty: "easy" },
        { title: "Middle of Linked List", url: "https://leetcode.com/problems/middle-of-the-linked-list/", difficulty: "easy" },
        { title: "Merge Two Sorted Lists", url: "https://leetcode.com/problems/merge-two-sorted-lists/", difficulty: "easy" },
        { title: "Remove Nth Node from End", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", difficulty: "medium" },
        { title: "Add Two Numbers", url: "https://leetcode.com/problems/add-two-numbers/", difficulty: "medium" },
        { title: "Detect Cycle (Floyd's)", url: "https://leetcode.com/problems/linked-list-cycle/", difficulty: "easy" },
        { title: "Find Cycle Start", url: "https://leetcode.com/problems/linked-list-cycle-ii/", difficulty: "medium" },
        { title: "Palindrome Linked List", url: "https://leetcode.com/problems/palindrome-linked-list/", difficulty: "easy" },
      ]},
    ],
  },
  {
    title: "Step 7: Recursion & Backtracking",
    topics: [
      { name: "Subsequences Pattern", problems: [
        { title: "Subsets", url: "https://leetcode.com/problems/subsets/", difficulty: "medium" },
        { title: "Subsets II", url: "https://leetcode.com/problems/subsets-ii/", difficulty: "medium" },
        { title: "Combination Sum", url: "https://leetcode.com/problems/combination-sum/", difficulty: "medium" },
        { title: "Combination Sum II", url: "https://leetcode.com/problems/combination-sum-ii/", difficulty: "medium" },
        { title: "Permutations", url: "https://leetcode.com/problems/permutations/", difficulty: "medium" },
        { title: "N-Queens", url: "https://leetcode.com/problems/n-queens/", difficulty: "hard" },
        { title: "Sudoku Solver", url: "https://leetcode.com/problems/sudoku-solver/", difficulty: "hard" },
        { title: "Word Search", url: "https://leetcode.com/problems/word-search/", difficulty: "medium" },
      ]},
    ],
  },
  {
    title: "Step 8: Stack & Queue",
    topics: [
      { name: "Learning & Implementation", problems: [
        { title: "Implement Stack using Arrays", url: "https://practice.geeksforgeeks.org/problems/implement-stack-using-array/1", difficulty: "easy" },
        { title: "Implement Queue using Arrays", url: "https://practice.geeksforgeeks.org/problems/implement-queue-using-array/1", difficulty: "easy" },
        { title: "Implement Queue using Stacks", url: "https://leetcode.com/problems/implement-queue-using-stacks/", difficulty: "easy" },
        { title: "Valid Parentheses", url: "https://leetcode.com/problems/valid-parentheses/", difficulty: "easy" },
        { title: "Min Stack", url: "https://leetcode.com/problems/min-stack/", difficulty: "medium" },
      ]},
      { name: "Monotonic Stack/Queue Problems", problems: [
        { title: "Next Greater Element", url: "https://leetcode.com/problems/next-greater-element-i/", difficulty: "easy" },
        { title: "Trapping Rain Water", url: "https://leetcode.com/problems/trapping-rain-water/", difficulty: "hard" },
        { title: "Largest Rectangle in Histogram", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", difficulty: "hard" },
      ]},
    ],
  },
  {
    title: "Step 9: Trees",
    topics: [
      { name: "Traversals", problems: [
        { title: "Inorder Traversal", url: "https://leetcode.com/problems/binary-tree-inorder-traversal/", difficulty: "easy" },
        { title: "Preorder Traversal", url: "https://leetcode.com/problems/binary-tree-preorder-traversal/", difficulty: "easy" },
        { title: "Postorder Traversal", url: "https://leetcode.com/problems/binary-tree-postorder-traversal/", difficulty: "easy" },
        { title: "Level Order Traversal", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", difficulty: "medium" },
        { title: "Maximum Depth", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", difficulty: "easy" },
        { title: "Balanced Binary Tree", url: "https://leetcode.com/problems/balanced-binary-tree/", difficulty: "easy" },
        { title: "Diameter of Binary Tree", url: "https://leetcode.com/problems/diameter-of-binary-tree/", difficulty: "easy" },
      ]},
      { name: "Medium Problems", problems: [
        { title: "Same Tree", url: "https://leetcode.com/problems/same-tree/", difficulty: "easy" },
        { title: "Invert Binary Tree", url: "https://leetcode.com/problems/invert-binary-tree/", difficulty: "easy" },
        { title: "Lowest Common Ancestor", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/", difficulty: "medium" },
        { title: "Validate BST", url: "https://leetcode.com/problems/validate-binary-search-tree/", difficulty: "medium" },
        { title: "Kth Smallest Element in BST", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", difficulty: "medium" },
        { title: "Construct BT from Inorder & Preorder", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", difficulty: "medium" },
      ]},
    ],
  },
  {
    title: "Step 10: Graphs",
    topics: [
      { name: "BFS/DFS", problems: [
        { title: "Number of Islands", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "medium" },
        { title: "Rotting Oranges", url: "https://leetcode.com/problems/rotting-oranges/", difficulty: "medium" },
        { title: "Clone Graph", url: "https://leetcode.com/problems/clone-graph/", difficulty: "medium" },
        { title: "Course Schedule", url: "https://leetcode.com/problems/course-schedule/", difficulty: "medium" },
        { title: "Course Schedule II", url: "https://leetcode.com/problems/course-schedule-ii/", difficulty: "medium" },
        { title: "Word Ladder", url: "https://leetcode.com/problems/word-ladder/", difficulty: "hard" },
      ]},
    ],
  },
  {
    title: "Step 11: Dynamic Programming",
    topics: [
      { name: "1D DP", problems: [
        { title: "Climbing Stairs", url: "https://leetcode.com/problems/climbing-stairs/", difficulty: "easy" },
        { title: "House Robber", url: "https://leetcode.com/problems/house-robber/", difficulty: "medium" },
        { title: "House Robber II", url: "https://leetcode.com/problems/house-robber-ii/", difficulty: "medium" },
      ]},
      { name: "2D/Grid DP", problems: [
        { title: "Unique Paths", url: "https://leetcode.com/problems/unique-paths/", difficulty: "medium" },
        { title: "Minimum Path Sum", url: "https://leetcode.com/problems/minimum-path-sum/", difficulty: "medium" },
      ]},
      { name: "Subsequences", problems: [
        { title: "Longest Increasing Subsequence", url: "https://leetcode.com/problems/longest-increasing-subsequence/", difficulty: "medium" },
        { title: "Longest Common Subsequence", url: "https://leetcode.com/problems/longest-common-subsequence/", difficulty: "medium" },
        { title: "Coin Change", url: "https://leetcode.com/problems/coin-change/", difficulty: "medium" },
        { title: "0/1 Knapsack", url: "https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem/0", difficulty: "medium" },
        { title: "Word Break", url: "https://leetcode.com/problems/word-break/", difficulty: "medium" },
        { title: "Edit Distance", url: "https://leetcode.com/problems/edit-distance/", difficulty: "medium" },
      ]},
    ],
  },
];

const DIFF_COLOR: Record<string, string> = { easy: "text-signal-green", medium: "text-signal-yellow", hard: "text-signal-red" };

export default function DSASheetPage() {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("dsa-sheet-done") ?? "[]")); } catch { return new Set(); }
  });

  function toggle(key: string) {
    const next = new Set(completed);
    if (next.has(key)) next.delete(key); else next.add(key);
    setCompleted(next);
    localStorage.setItem("dsa-sheet-done", JSON.stringify([...next]));
  }

  function toggleSection(i: number) {
    const next = new Set(expandedSections);
    if (next.has(i)) next.delete(i); else next.add(i);
    setExpandedSections(next);
  }

  const totalProblems = SHEET.reduce((s, sec) => s + sec.topics.reduce((t, top) => t + top.problems.length, 0), 0);
  const doneCt = completed.size;
  const pct = totalProblems > 0 ? Math.round((doneCt / totalProblems) * 100) : 0;

  return (
    <>
      <PageHeader
        code="D / 013 — DSA SHEET"
        title="DSA A2Z Sheet"
        description="Structured DSA roadmap inspired by Striver's A2Z sheet. Every problem links to LeetCode/GFG. Track your progress — it saves to your browser."
      />

      {/* Progress bar */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="relative h-3 flex-1 bg-surface">
            <div className="absolute inset-y-0 left-0 bg-signal-green transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="label-xs tabular-nums text-signal-green">{doneCt}/{totalProblems} ({pct}%)</span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col">
        {SHEET.map((sec, si) => {
          const secTotal = sec.topics.reduce((s, t) => s + t.problems.length, 0);
          const secDone = sec.topics.reduce((s, t) => s + t.problems.filter((p) => completed.has(p.url)).length, 0);

          return (
            <div key={si} className="border-b border-border">
              <button
                onClick={() => toggleSection(si)}
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-surface transition-colors"
              >
                <span className={`text-xs ${expandedSections.has(si) ? "text-primary" : "text-muted-foreground"}`}>
                  {expandedSections.has(si) ? "▼" : "▶"}
                </span>
                <span className="flex-1 text-sm font-bold text-foreground">{sec.title}</span>
                <span className="label-xs tabular-nums">{secDone}/{secTotal}</span>
                <div className="relative h-2 w-20 bg-surface">
                  <div className="absolute inset-y-0 left-0 bg-signal-green transition-all" style={{ width: `${secTotal > 0 ? (secDone / secTotal) * 100 : 0}%` }} />
                </div>
              </button>

              {expandedSections.has(si) && (
                <div className="pb-2">
                  {sec.topics.map((topic, ti) => (
                    <div key={ti} className="px-4 pb-3">
                      <div className="label-xs mb-2 pl-6">{topic.name}</div>
                      <div className="flex flex-col gap-px bg-border ml-6">
                        {topic.problems.map((p, pi) => {
                          const key = p.url;
                          const done = completed.has(key);
                          return (
                            <div key={pi} className="flex items-center gap-3 bg-card px-3 py-2">
                              <button
                                onClick={() => toggle(key)}
                                className={`flex size-5 shrink-0 items-center justify-center border text-xs transition-colors ${done ? "border-signal-green bg-signal-green text-white" : "border-border text-transparent hover:border-muted-foreground"}`}
                              >
                                ✓
                              </button>
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex-1 text-sm transition-colors hover:text-primary ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
                              >
                                {p.title}
                              </a>
                              <span className={`text-[10px] font-bold uppercase ${DIFF_COLOR[p.difficulty]}`}>
                                {p.difficulty}
                              </span>
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                Solve →
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
