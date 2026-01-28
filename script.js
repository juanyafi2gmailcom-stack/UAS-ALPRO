/* ===== BST ===== */
class BSTNode {
  constructor(key) {
    this.key = key
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null
  }

  insert(key) {
    this.root = this._insert(this.root, key)
  }

  _insert(node, key) {
    if (!node) return new BSTNode(key)
    if (key < node.key) node.left = this._insert(node.left, key)
    else if (key > node.key) node.right = this._insert(node.right, key)
    return node
  }
  
  search(node, key) {
    if (node === null || node.key === key) return node;
    if (key < node.key) return this.search(node.left, key);
    return this.search(node.right, key);
  }
}


/* ===== GRAPH + DIJKSTRA ===== */
class Graph {
  constructor() {
    this.edges = {}
  }

  addEdge(from, to, weight) {
    if (!this.edges[from]) this.edges[from] = {}
    this.edges[from][to] = weight
  }

  dijkstra(start, end) {
    const dist = {}
    const prev = {}
    const visited = {}

    for (let node in this.edges) dist[node] = Infinity
    dist[start] = 0

    while (true) {
      let minNode = null
      let minDist = Infinity

      for (let node in dist) {
        if (!visited[node] && dist[node] < minDist) {
          minDist = dist[node]
          minNode = node
        }
      }

      if (!minNode || minNode === end) break
      visited[minNode] = true

      for (let n in this.edges[minNode]) {
        const alt = dist[minNode] + this.edges[minNode][n]
        if (alt < dist[n]) {
          dist[n] = alt
          prev[n] = minNode
        }
      }
    }

    const path = []
    let cur = end
    while (cur) {
      path.unshift(cur)
      cur = prev[cur]
    }

    return { path, distance: dist[end] }
  }
}

/* ===== APP ===== */
const graph = new Graph()
const bst = new BinarySearchTree()
const edgeList = []

function addEdge() {
  const from = document.getElementById("from").value.trim()
  const to = document.getElementById("to").value.trim()
  const weight = parseInt(document.getElementById("weight").value)

  if (!from || !to || isNaN(weight)) {
    alert("Lengkapi semua input jalur!")
    return
  }

  graph.addEdge(from, to, weight)
  graph.addEdge(to, from, weight)
  bst.insert(from)
  bst.insert(to)

  edgeList.push(`${from} ↔ ${to} (${weight} km)`)

  document.getElementById("edges").innerHTML =
    edgeList.map(e => `<div class="list-item">📍 ${e}</div>`).join("")
}

function findPath() {
  const start = document.getElementById("start").value.trim()
  const end = document.getElementById("end").value.trim()
  const result = graph.dijkstra(start, end)

  const resultDiv = document.getElementById("result")

  if (!result.path.length || result.distance === Infinity) {
    resultDiv.innerHTML = "<div class='error'>Rute tidak ditemukan</div>"
    return
  }

  resultDiv.innerHTML = `
    <div class="result-box">
      <p><b>Rute Terpendek</b></p>
      <p>${result.path.join(" → ")}</p>
      <p>Total Jarak: ${result.distance} km</p>
    </div>
  `
}
/* ===== FITUR TAMBAHAN: BST TRAVERSAL (TANPA MENGUBAH KODE LAMA) ===== */

function inOrderTraversal(node, result = []) {
  if (node) {
    inOrderTraversal(node.left, result)
    result.push(node.key)
    inOrderTraversal(node.right, result)
  }
  return result
}

function preOrderTraversal(node, result = []) {
  if (node) {
    result.push(node.key)
    preOrderTraversal(node.left, result)
    preOrderTraversal(node.right, result)
  }
  return result
}

function postOrderTraversal(node, result = []) {
  if (node) {
    postOrderTraversal(node.left, result)
    postOrderTraversal(node.right, result)
    result.push(node.key)
  }
  return result
}

function showBSTTraversal() {
  if (!bst.root) {
    document.getElementById("bstTraversal").innerHTML =
      "<p>BST masih kosong</p>"
    return
  }

  const inOrder = inOrderTraversal(bst.root).join(" → ")
  const preOrder = preOrderTraversal(bst.root).join(" → ")
  const postOrder = postOrderTraversal(bst.root).join(" → ")

  document.getElementById("bstTraversal").innerHTML = `
    <p><b>InOrder</b>: ${inOrder}</p>
    <p><b>PreOrder</b>: ${preOrder}</p>
    <p><b>PostOrder</b>: ${postOrder}</p>
  `
}
function searchCampus() {
  const query = document.getElementById("searchNode").value.trim();
  const resultDiv = document.getElementById("searchResult");
  const found = bst.search(bst.root, query); // Menggunakan fungsi search yang baru dibuat

  if (found) {
    resultDiv.innerHTML = `<div class="list-item" style="background: #dcfce7;">✅ Kampus "${query}" ditemukan.</div>`;
  } else {
    resultDiv.innerHTML = `<div class="list-item" style="background: #fee2e2;">❌ Kampus "${query}" tidak ada.</div>`;
  }
}

/* ===== FITUR RIWAYAT PENCARIAN ===== */
const historyList = [];

function updateHistoryUI() {
  const historyDiv = document.getElementById("searchHistory");
  if (historyList.length === 0) {
    historyDiv.innerHTML = '<p style="color: #94a3b8; font-size: 12px;">Belum ada riwayat pencarian.</p>';
    return;
  }

  historyDiv.innerHTML = historyList.map((item, index) => `
    <div class="list-item" style="border-left: 4px solid #6366f1; margin-bottom: 5px;">
      <small>${item.time}</small><br>
      <b>${item.route}</b> — ${item.distance}
    </div>
  `).join("");
}

function clearHistory() {
  historyList.length = 0;
  updateHistoryUI();
}

// Modifikasi fungsi findPath yang sudah ada
const originalFindPath = findPath; 
findPath = function() {
  originalFindPath(); // Jalankan fungsi asli

  const start = document.getElementById("start").value.trim();
  const end = document.getElementById("end").value.trim();
  const result = graph.dijkstra(start, end);

  if (result.path.length > 0 && result.distance !== Infinity) {
    const now = new Date().toLocaleTimeString();
    historyList.unshift({
      time: now,
      route: `${start} → ${end}`,
      distance: `${result.distance} km`
    });
    
    // Riwayat Maks.5
    if (historyList.length > 5) historyList.pop();
    
    updateHistoryUI();
  }
}