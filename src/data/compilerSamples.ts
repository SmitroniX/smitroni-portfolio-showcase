export interface CodeSample {
  id: string;
  title: string;
  tag: string;
  description: string;
  code: string;
  defaultStdin: string;
  isInteractive: boolean;
}

export const SAMPLE_CODES: Record<string, CodeSample[]> = {
  java: [
    {
      id: 'java-inheritance',
      title: 'OOP Multi-Level Inheritance (Circle, Area, Volume)',
      tag: 'Interactive Input',
      description: 'Accepts radius via Scanner, calculates Circle Area and Sphere Volume across derived classes.',
      defaultStdin: '5',
      isInteractive: true,
      code: `import java.util.Scanner;

class Circle {
    double r;

    void accept() {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter Radius: ");
        r = sc.nextDouble();
    }
}

class Area extends Circle {
    double area;

    void calculate() {
        area = 3.14 * r * r;
    }

    void display() {
        System.out.println("Area of Circle = " + area);
    }
}

class Volume extends Area {
    double volume;

    void calculateVolume() {
        volume = (4.0 / 3.0) * 3.14 * r * r * r;
    }

    @Override
    void display() {
        System.out.println("Area of Circle = " + area);
        System.out.println("Volume of Sphere = " + volume);
    }
}

public class Main {
    public static void main(String[] args) {
        Volume obj = new Volume();

        obj.accept();
        obj.calculate();
        obj.calculateVolume();
        obj.display();
    }
}
`
    },
    {
      id: 'java-fibonacci',
      title: 'Fibonacci Series with User Input',
      tag: 'Interactive',
      description: 'Prompts for N terms and prints the Fibonacci series.',
      defaultStdin: '8',
      isInteractive: true,
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number of Fibonacci terms: ");
        int n = sc.nextInt();

        int a = 0, b = 1;
        System.out.println("\\nFibonacci Series up to " + n + " terms:");
        for (int i = 1; i <= n; i++) {
            System.out.print(a + " ");
            int next = a + b;
            a = b;
            b = next;
        }
        System.out.println();
    }
}
`
    },
    {
      id: 'java-quicksort',
      title: 'QuickSort Algorithm & Benchmarking',
      tag: 'Algorithms',
      description: 'Divide-and-conquer sorting algorithm implementation in Java.',
      defaultStdin: '',
      isInteractive: false,
      code: `import java.util.Arrays;

public class Main {
    static int partition(int arr[], int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    static void quickSort(int arr[], int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90, 48};
        System.out.println("Original Array: " + Arrays.toString(arr));
        quickSort(arr, 0, arr.length - 1);
        System.out.println("Sorted Array:   " + Arrays.toString(arr));
    }
}
`
    }
  ],

  python: [
    {
      id: 'py-circle-geometry',
      title: 'Circle Area & Sphere Volume Calculator',
      tag: 'Interactive Input',
      description: 'Prompts for radius and computes geometric properties with math module.',
      defaultStdin: '5',
      isInteractive: true,
      code: `# Interactive Geometry Calculator in Python
import math

def calculate(radius):
    area = math.pi * radius * radius
    volume = (4.0 / 3.0) * math.pi * (radius ** 3)
    return area, volume

print("=== Python 3 Interactive Geometry ===")
user_input = input("Enter Radius: ")
r = float(user_input)

area, volume = calculate(r)
print(f"Radius = {r}")
print(f"Area of Circle = {area:.2f}")
print(f"Volume of Sphere = {volume:.2f}")
`
    },
    {
      id: 'py-two-sum',
      title: 'Two Sum Algorithm (Hash Map O(N))',
      tag: 'LeetCode DSA',
      description: 'Finds indices of two numbers that add up to a target.',
      defaultStdin: '9',
      isInteractive: true,
      code: `# Two Sum Algorithm in Python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return None

nums = [2, 7, 11, 15, 3, 6]
print("Array:", nums)
target_input = input("Enter Target Sum (e.g. 9): ")
target = int(target_input)

result = two_sum(nums, target)
if result:
    print(f"Indices: {result} -> Values: {nums[result[0]]} + {nums[result[1]]} = {target}")
else:
    print(f"No two numbers sum to {target}")
`
    },
    {
      id: 'py-cluster-monitor',
      title: 'Cloud Cluster Health & Latency Monitor',
      tag: 'Cloud & DevOps',
      description: 'Simulates microservice health checks and latency benchmarks.',
      defaultStdin: '',
      isInteractive: false,
      code: `# Cloud Microservice Health Monitor
import time

nodes = [
    {"region": "Mumbai (ap-south-1)", "latency": 14, "status": "UP"},
    {"region": "Singapore (ap-southeast-1)", "latency": 38, "status": "UP"},
    {"region": "Frankfurt (eu-central-1)", "latency": 112, "status": "UP"},
]

print("=== SmitroniX Cloud Telemetry ===")
total_latency = 0
for node in nodes:
    print(f"• {node['region'].ljust(30)} -> {node['latency']}ms [{node['status']}]")
    total_latency += node['latency']

avg = total_latency / len(nodes)
print(f"\\nAverage Cluster Latency: {avg:.1f}ms | Availability: 99.9%")
`
    }
  ],

  cpp: [
    {
      id: 'cpp-circle-inheritance',
      title: 'Circle & Sphere OOP Class Hierarchy',
      tag: 'Interactive Input',
      description: 'C++ inheritance model calculating Circle Area and Sphere Volume.',
      defaultStdin: '5',
      isInteractive: true,
      code: `#include <iostream>
using namespace std;

class Circle {
public:
    double r;
    void accept() {
        cout << "Enter Radius: ";
        cin >> r;
    }
};

class Area : public Circle {
public:
    double area;
    void calculate() {
        area = 3.14 * r * r;
    }
    void display() {
        cout << "Area of Circle = " << area << endl;
    }
};

class Volume : public Area {
public:
    double volume;
    void calculateVolume() {
        volume = (4.0 / 3.0) * 3.14 * r * r * r;
    }
    void displayAll() {
        display();
        cout << "Volume of Sphere = " << volume << endl;
    }
};

int main() {
    Volume obj;
    obj.accept();
    obj.calculate();
    obj.calculateVolume();
    obj.displayAll();
    return 0;
}
`
    },
    {
      id: 'cpp-vectors-stl',
      title: 'C++ STL Vectors & Lambda Sorting',
      tag: 'Modern C++14',
      description: 'Demonstrates modern STL algorithm transformations.',
      defaultStdin: '',
      isInteractive: false,
      code: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "=== Modern C++14 STL Transformations ===" << endl;
    vector<int> numbers = {64, 34, 25, 12, 22, 11, 90};

    cout << "Original Vector: ";
    for (int n : numbers) cout << n << " ";
    cout << endl;

    sort(numbers.begin(), numbers.end(), [](int a, int b) {
        return a < b;
    });

    cout << "Sorted with Lambda: ";
    for (int n : numbers) cout << n << " ";
    cout << endl;

    return 0;
}
`
    }
  ],

  c: [
    {
      id: 'c-circle-scanf',
      title: 'Circle & Sphere Calculator (scanf input)',
      tag: 'Interactive Input',
      description: 'Standard C implementation accepting radius and computing values.',
      defaultStdin: '5',
      isInteractive: true,
      code: `#include <stdio.h>

int main() {
    double r;
    printf("Enter Radius: ");
    scanf("%lf", &r);

    double area = 3.14 * r * r;
    double volume = (4.0 / 3.0) * 3.14 * r * r * r;

    printf("\\nArea of Circle = %.2lf\\n", area);
    printf("Volume of Sphere = %.2lf\\n", volume);
    return 0;
}
`
    },
    {
      id: 'c-bubble-sort',
      title: 'Bubble Sort with Pointer Swapping',
      tag: 'Algorithms',
      description: 'Classical sorting with explicit memory pointers in C.',
      defaultStdin: '',
      isInteractive: false,
      code: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
            }
        }
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Original array: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");

    bubbleSort(arr, n);

    printf("Sorted array:   ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}
`
    }
  ],

  javascript: [
    {
      id: 'js-geometry-class',
      title: 'ES6 Geometry Classes & Inheritance',
      tag: 'OOP Classes',
      description: 'Class hierarchy in modern JavaScript computing area & volume.',
      defaultStdin: '5',
      isInteractive: true,
      code: `// ES6 Class Inheritance - Geometry Engine
class Circle {
  constructor(r = 5) {
    this.r = r;
  }
}

class Area extends Circle {
  calculateArea() {
    this.area = 3.14 * this.r * this.r;
    return this.area;
  }
}

class Volume extends Area {
  calculateVolume() {
    this.volume = (4.0 / 3.0) * 3.14 * Math.pow(this.r, 3);
    return this.volume;
  }

  display() {
    console.log("Radius = " + this.r);
    console.log("Area of Circle = " + this.calculateArea());
    console.log("Volume of Sphere = " + this.calculateVolume());
  }
}

const obj = new Volume(5);
obj.display();
`
    },
    {
      id: 'js-async-queue',
      title: 'Async Task Queue & Promise Handling',
      tag: 'Async / Node',
      description: 'Simulates high-concurrency event loops and microtasks.',
      defaultStdin: '',
      isInteractive: false,
      code: `// Async Task Dispatcher
console.log("=== Initializing Microtask Pipeline ===");

const tasks = [
  { id: "TASK_01", type: "DB_SYNC", priority: "HIGH" },
  { id: "TASK_02", type: "CACHE_INVALIDATE", priority: "MED" },
  { id: "TASK_03", type: "BROADCAST_WEBSOCKET", priority: "LOW" },
];

tasks.forEach((t, i) => {
  console.log(\`[DISPATCH #\${i + 1}] Processing \${t.id} (\${t.type}) - Priority: \${t.priority}\`);
});

console.log("\\nAll 3 tasks processed with zero rejected promises.");
`
    }
  ],

  typescript: [
    {
      id: 'ts-strict-interfaces',
      title: 'Type-Safe Geometric Model & Interfaces',
      tag: 'TypeScript 5.6',
      description: 'Defines strict contract interfaces and implements OOP geometry.',
      defaultStdin: '5',
      isInteractive: true,
      code: `interface IGeometry {
  radius: number;
  calculateArea(): number;
  calculateVolume(): number;
}

class SphereCalculator implements IGeometry {
  constructor(public radius: number = 5) {}

  calculateArea(): number {
    return 3.14 * this.radius * this.radius;
  }

  calculateVolume(): number {
    return (4.0 / 3.0) * 3.14 * Math.pow(this.radius, 3);
  }

  display(): void {
    console.log("=== TypeScript 5.6 Strict Geometric Model ===");
    console.log(\`Radius: \${this.radius}\`);
    console.log(\`Area:   \${this.calculateArea()}\`);
    console.log(\`Volume: \${this.calculateVolume()}\`);
  }
}

const calc = new SphereCalculator(5);
calc.display();
`
    }
  ],

  rust: [
    {
      id: 'rust-geometry',
      title: 'Rust Structs & Method Implementation',
      tag: 'Memory Safe',
      description: 'Demonstrates memory-safe struct methods in Rust.',
      defaultStdin: '5',
      isInteractive: true,
      code: `struct Circle {
    r: f64,
}

impl Circle {
    fn new(r: f64) -> Self {
        Circle { r }
    }

    fn area(&self) -> f64 {
        3.14 * self.r * self.r
    }

    fn volume(&self) -> f64 {
        (4.0 / 3.0) * 3.14 * self.r.powi(3)
    }
}

fn main() {
    let circle = Circle::new(5.0);
    println!("=== Rust 1.85 Geometry Engine ===");
    println!("Radius = {}", circle.r);
    println!("Area of Circle = {}", circle.area());
    println!("Volume of Sphere = {}", circle.volume());
}
`
    }
  ],

  go: [
    {
      id: 'go-geometry',
      title: 'Go Geometry Structs & Goroutines',
      tag: 'Concurrency',
      description: 'Go struct methods and concurrency channel dispatching.',
      defaultStdin: '5',
      isInteractive: true,
      code: `package main

import (
	"fmt"
	"math"
)

type Circle struct {
	radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.radius * c.radius
}

func (c Circle) Volume() float64 {
	return (4.0 / 3.0) * math.Pi * math.Pow(c.radius, 3)
}

func main() {
	c := Circle{radius: 5.0}
	fmt.Println("=== Go 1.23 Online Engine ===")
	fmt.Printf("Radius = %.1f\\n", c.radius)
	fmt.Printf("Area of Circle = %.4f\\n", c.Area())
	fmt.Printf("Volume of Sphere = %.4f\\n", c.Volume())
}
`
    }
  ],

  bash: [
    {
      id: 'bash-math-telemetry',
      title: 'UNIX Shell Math & Kernel Telemetry',
      tag: 'Shell Script',
      description: 'Shell script demonstrating variables, arithmetic, and system status.',
      defaultStdin: '',
      isInteractive: false,
      code: `#!/usr/bin/env bash
echo "=== UNIX Bash Execution ==="
RADIUS=5
AREA=$(echo "scale=2; 3.14 * $RADIUS * $RADIUS" | bc 2>/dev/null || echo "78.50")
echo "Radius: $RADIUS"
echo "Computed Area: $AREA"
echo "System Host: $(uname -s -m 2>/dev/null || echo 'Linux x86_64')"
echo "Timestamp: $(date -u)"
`
    }
  ]
};
