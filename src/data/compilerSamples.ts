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
      id: 'java-default',
      title: 'Main.java (Default)',
      tag: 'Starter',
      description: 'Standard Programiz starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Java Compiler
// Use this editor to write, compile and run your Java code online

class Main {
    public static void main(String[] args) {
        System.out.println("Start small. Ship something.");
    }
}
`
    },
    {
      id: 'java-palindrome',
      title: 'Palindrome String Checker',
      tag: 'Interactive Input',
      description: 'Checks if a user input string is a palindrome using StringBuffer.',
      defaultStdin: 'madam',
      isInteractive: true,
      code: `import java.util.Scanner;

class Palindrome {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter a String: ");
        String str = sc.nextLine();

        StringBuffer sb = new StringBuffer(str);

        // Reverse the string
        sb.reverse();

        String rev = sb.toString();

        if (str.equalsIgnoreCase(rev)) {
            System.out.println("String is a Palindrome.");
        } else {
            System.out.println("String is not a Palindrome.");
        }

        sc.close();
    }
}
`
    },
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
      description: 'Prompts for N terms via Scanner and prints the Fibonacci series.',
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
      id: 'py-default',
      title: 'main.py (Default)',
      tag: 'Starter',
      description: 'Standard Programiz starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.

print("Start small. Ship something.")
`
    },
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
    }
  ],

  cpp: [
    {
      id: 'cpp-default',
      title: 'main.cpp (Default)',
      tag: 'Starter',
      description: 'Standard Programiz starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online C++ compiler to run C++ program online
#include <iostream>

int main() {
    // Write C++ code here
    std::cout << "Start small. Ship something.\n";

    return 0;
}
`
    },
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
    }
  ],

  c: [
    {
      id: 'c-default',
      title: 'main.c (Default)',
      tag: 'Starter',
      description: 'Standard Programiz starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online C compiler to run C program online
#include <stdio.h>

int main() {
    // Write C code here
    printf("Start small. Ship something.\n");

    return 0;
}
`
    },
    {
      id: 'c-circle-calc',
      title: 'Radius Input & Geometry (scanf)',
      tag: 'Interactive Input',
      description: 'Accepts radius through scanf, calculates circle area and sphere volume.',
      defaultStdin: '5',
      isInteractive: true,
      code: `#include <stdio.h>

int main() {
    double r, area, volume;
    printf("Enter Radius: ");
    if (scanf("%lf", &r) == 1) {
        area = 3.1415926535 * r * r;
        volume = (4.0 / 3.0) * 3.1415926535 * r * r * r;
        printf("\nArea of Circle = %.4f\n", area);
        printf("Volume of Sphere = %.4f\n", volume);
    } else {
        printf("Invalid input.\n");
    }
    return 0;
}
`
    }
  ],

  csharp: [
    {
      id: 'csharp-default',
      title: 'Main.cs (Default)',
      tag: 'Starter',
      description: 'Standard C# starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online C# compiler
using System;

class MainClass {
    public static void Main (string[] args) {
        Console.WriteLine ("Start small. Ship something.");
    }
}
`
    },
    {
      id: 'csharp-circle',
      title: 'Circle & Sphere Calculation',
      tag: 'Interactive Input',
      description: 'Prompts for radius via Console.ReadLine and calculates geometric properties.',
      defaultStdin: '5',
      isInteractive: true,
      code: `using System;

class Circle {
    public double r;
    public void Accept() {
        Console.Write("Enter Radius: ");
        r = double.Parse(Console.ReadLine() ?? "5");
    }
}

class Program : Circle {
    public static void Main() {
        Program p = new Program();
        p.Accept();
        double area = Math.PI * p.r * p.r;
        double volume = (4.0 / 3.0) * Math.PI * Math.Pow(p.r, 3);
        Console.WriteLine($"Area of Circle = {area:F2}");
        Console.WriteLine($"Volume of Sphere = {volume:F2}");
    }
}
`
    }
  ],

  kotlin: [
    {
      id: 'kotlin-default',
      title: 'Main.kt (Default)',
      tag: 'Starter',
      description: 'Standard Kotlin starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Kotlin compiler
fun main() {
    println("Start small. Ship something.")
}
`
    },
    {
      id: 'kotlin-geometry',
      title: 'Interactive Geometry in Kotlin',
      tag: 'Interactive Input',
      description: 'Accepts radius and computes geometry.',
      defaultStdin: '5',
      isInteractive: true,
      code: `import java.util.Scanner

fun main() {
    val sc = Scanner(System.\`in\`)
    print("Enter Radius: ")
    val r = sc.nextDouble()
    val area = 3.14 * r * r
    val volume = (4.0 / 3.0) * 3.14 * r * r * r
    println("Area of Circle = $area")
    println("Volume of Sphere = $volume")
}
`
    }
  ],

  javascript: [
    {
      id: 'js-default',
      title: 'main.js (Default)',
      tag: 'Starter',
      description: 'Standard JavaScript starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Javascript Editor for free
// Write, Edit and Run your Javascript code using JS Online Compiler

console.log("Start small. Ship something.");
`
    },
    {
      id: 'js-geometry',
      title: 'Interactive Circle & Sphere Geometry',
      tag: 'Interactive Input',
      description: 'Calculates Circle Area and Sphere Volume for radius.',
      defaultStdin: '5',
      isInteractive: true,
      code: `// Node.js Geometry Calculation
const radius = 5.0; // Input radius
const area = Math.PI * radius * radius;
const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);

console.log("Enter Radius:", radius);
console.log("Area of Circle =", area.toFixed(2));
console.log("Volume of Sphere =", volume.toFixed(2));
`
    }
  ],

  typescript: [
    {
      id: 'ts-default',
      title: 'main.ts (Default)',
      tag: 'Starter',
      description: 'Standard TypeScript starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online TypeScript compiler
console.log("Start small. Ship something.");
`
    }
  ],

  go: [
    {
      id: 'go-default',
      title: 'main.go (Default)',
      tag: 'Starter',
      description: 'Standard Go starter template: "Start small. Ship something."',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Go compiler to run Go program online
package main
import "fmt"

func main() {
    fmt.Println("Start small. Ship something.")
}
`
    },
    {
      id: 'go-geometry',
      title: 'Interactive Geometry with fmt.Scan',
      tag: 'Interactive Input',
      description: 'Accepts radius via stdin and computes area and volume.',
      defaultStdin: '5',
      isInteractive: true,
      code: `package main
import (
    "fmt"
    "math"
)

func main() {
    var r float64
    fmt.Print("Enter Radius: ")
    fmt.Scan(&r)
    area := math.Pi * r * r
    volume := (4.0 / 3.0) * math.Pi * math.Pow(r, 3)
    fmt.Printf("Area of Circle = %.2f\\n", area)
    fmt.Printf("Volume of Sphere = %.2f\\n", volume)
}
`
    }
  ],

  rust: [
    {
      id: 'rust-default',
      title: 'main.rs (Default)',
      tag: 'Starter',
      description: 'Standard Rust starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Rust compiler
fn main() {
    println!("Start small. Ship something.");
}
`
    },
    {
      id: 'rust-geometry',
      title: 'Geometry & stdin Reader in Rust',
      tag: 'Interactive Input',
      description: 'Reads radius from standard input and computes sphere volume.',
      defaultStdin: '5',
      isInteractive: true,
      code: `use std::io::{self, Write};

fn main() {
    print!("Enter Radius: ");
    io::stdout().flush().unwrap();
    let mut input = String::new();
    io::stdin().read_line(&mut input).expect("Failed to read line");
    let r: f64 = input.trim().parse().unwrap_or(5.0);

    let area = std::f64::consts::PI * r * r;
    let volume = (4.0 / 3.0) * std::f64::consts::PI * r.powi(3);

    println!("Area of Circle = {:.2}", area);
    println!("Volume of Sphere = {:.2}", volume);
}
`
    }
  ],

  php: [
    {
      id: 'php-default',
      title: 'main.php (Default)',
      tag: 'Starter',
      description: 'Standard PHP starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `<?php
// Online PHP compiler
echo "Start small. Ship something.\n";
?>
`
    }
  ],

  swift: [
    {
      id: 'swift-default',
      title: 'main.swift (Default)',
      tag: 'Starter',
      description: 'Standard Swift starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `// Online Swift compiler
print("Start small. Ship something.")
`
    }
  ],

  r: [
    {
      id: 'r-default',
      title: 'main.r (Default)',
      tag: 'Starter',
      description: 'Standard R starter template',
      defaultStdin: '',
      isInteractive: false,
      code: `# Online R compiler
cat("Start small. Ship something.\n")
`
    }
  ],

  sql: [
    {
      id: 'sql-default',
      title: 'main.sql (Default)',
      tag: 'Starter',
      description: 'Standard SQL SQLite template',
      defaultStdin: '',
      isInteractive: false,
      code: `-- Online SQL compiler (SQLite)
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users VALUES (1, 'Start small. Ship something.');
SELECT * FROM users;
`
    }
  ],

  html: [
    {
      id: 'html-default',
      title: 'index.html (Default)',
      tag: 'Web',
      description: 'Standard HTML5 template with live browser preview',
      defaultStdin: '',
      isInteractive: false,
      code: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Start Small</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
    h1 { color: #38bdf8; font-size: 1.8rem; }
    p { color: #94a3b8; font-size: 1.1rem; }
  </style>
</head>
<body>
  <h1>Start small. Ship something.</h1>
  <p>Live Web Preview powered by SmitroniX</p>
</body>
</html>
`
    }
  ]
};
