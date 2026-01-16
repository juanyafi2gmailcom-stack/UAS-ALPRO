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
