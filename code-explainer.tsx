"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, BookOpen } from "lucide-react"

interface CodeExplainerProps {
  code: string
}

export default function CodeExplainer({ code }: CodeExplainerProps) {
  const [explanation, setExplanation] = useState("")
  const [complexity, setComplexity] = useState("")
  const [optimizations, setOptimizations] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("explanation")

  const generateExplanation = () => {
    if (!code.trim()) return

    setIsLoading(true)

    // Simulate AI explanation generation
    setTimeout(() => {
      // For bubble sort example
      setExplanation(
        `
This code implements the Bubble Sort algorithm, which is a simple sorting algorithm.

Here's how it works:
1. The function takes an array 'arr' as input.
2. It gets the length of the array and stores it in variable 'n'.
3. It uses two nested loops to compare adjacent elements.
4. If an element is greater than the next one, they are swapped.
5. This process continues until the array is sorted.
6. Finally, it returns the sorted array.

Bubble sort gets its name because smaller elements "bubble" to the top of the array with each iteration.
      `.trim(),
      )

      setComplexity(
        `
Time Complexity: O(n²)
- Worst case: O(n²) - When the array is in reverse order
- Average case: O(n²)
- Best case: O(n) - When the array is already sorted (with optimization)

Space Complexity: O(1)
- The algorithm sorts in-place, using only a constant amount of extra space.
      `.trim(),
      )

      setOptimizations(
        `
Possible optimizations:
1. Early termination: Add a flag to check if any swaps were made in an iteration. If no swaps were made, the array is already sorted.

2. Optimized implementation:
\`\`\`javascript
function optimizedBubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  for (let i = 0; i < n; i++) {
    swapped = false;
    
    // Last i elements are already sorted
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swapping occurred in this pass, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}
\`\`\`

3. Consider using more efficient sorting algorithms for large datasets:
   - Quick Sort: O(n log n) average time complexity
   - Merge Sort: O(n log n) worst-case time complexity
   - Heap Sort: O(n log n) worst-case time complexity
      `.trim(),
      )

      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    if (code) {
      generateExplanation()
    }
  }, [code])

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Code Explainer</h2>
        <Button onClick={generateExplanation} disabled={isLoading} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Explain Code
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-4 overflow-auto">
          <pre className="code-editor text-sm">{code}</pre>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Analysis</CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="explanation">Explanation</TabsTrigger>
                <TabsTrigger value="complexity">Complexity</TabsTrigger>
                <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
              </TabsList>

              <TabsContent value="explanation" className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : explanation ? (
                  <div className="whitespace-pre-line">{explanation}</div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    No explanation available. Click "Explain Code" to analyze.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="complexity" className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : complexity ? (
                  <div className="whitespace-pre-line">{complexity}</div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    No complexity analysis available. Click "Explain Code" to analyze.
                  </div>
                )}
              </TabsContent>

              <TabsContent value="optimizations" className="mt-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : optimizations ? (
                  <div className="whitespace-pre-line">{optimizations}</div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    No optimization suggestions available. Click "Explain Code" to analyze.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

