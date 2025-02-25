# Discussion: Efficient Log Retrieval from a Large File

## **Approaches Considered**

### 1. **Single-Threaded Line-by-Line Reading**
- Used `readline` module to process file line-by-line.
-  **Advantage:** Memory efficient.
-  **Disadvantage:** Too slow for 1TB file (takes several hours).

### 2. **Indexing for Faster Lookup**
- Pre-build an index file with byte offsets for each date.
-  **Advantage:** Fast lookup using O(log N) binary search.
-  **Disadvantage:** Requires preprocessing and storage.

### 3. **Parallel Processing (Final Solution)**
- Splits the file into chunks and processes them using worker threads.
-  **Advantage:** Uses multiple CPU cores for fast execution.
-  **Advantage:** No extra indexing needed.
-  **Disadvantage:** Slight overhead due to thread management.

---

## **Final Solution Summary**
The best solution is **Parallel Processing using Worker Threads**:
- Splits the **1TB file** into **N chunks** (where N = CPU cores).
- **Each worker reads & filters its assigned chunk** independently.
- Results are combined and **written to a single output file**.

---

## **Steps to Run**
1️⃣ **Install Node.js** (if not installed):  
   - [Download Node.js](https://nodejs.org/)  
   
2️⃣ **Run the script**:  
   ```sh
   node src/extract_logs.js 2024-12-01
