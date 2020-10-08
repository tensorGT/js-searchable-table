var STORAGE_KEY = "table_filter_state_v1";

var transactions = [
  { id: 1, date: "2020-09-02", merchant: "DigitalOcean Droplet", category: "Hosting", amount: 12.00, status: "Paid" },
  { id: 2, date: "2020-09-05", merchant: "Frontend Masters", category: "Learning", amount: 39.00, status: "Paid" },
  { id: 3, date: "2020-09-09", merchant: "Namecheap Domain", category: "Hosting", amount: 10.98, status: "Paid" },
  { id: 4, date: "2020-09-14", merchant: "Figma Pro", category: "Software", amount: 15.00, status: "Paid" },
  { id: 5, date: "2020-09-19", merchant: "Logitech Mouse", category: "Hardware", amount: 49.99, status: "Paid" },
  { id: 6, date: "2020-09-25", merchant: "Netlify Bandwidth", category: "Hosting", amount: 19.00, status: "Pending" },
  { id: 7, date: "2020-10-01", merchant: "Notion Personal", category: "Software", amount: 4.00, status: "Paid" },
  { id: 8, date: "2020-10-04", merchant: "CSS-Tricks Almanac Book", category: "Learning", amount: 24.50, status: "Paid" },
  { id: 9, date: "2020-10-11", merchant: "Mechanical Keycaps", category: "Hardware", amount: 32.00, status: "Pending" },
  { id: 10, date: "2020-10-16", merchant: "Cloudflare Registrar", category: "Hosting", amount: 8.50, status: "Paid" }
];

var state = loadInitialState();

var searchBox = document.getElementById("search-box");
var categorySelect = document.getElementById("category-select");
var statusSelect = document.getElementById("status-select");
var resetBtn = document.getElementById("reset-btn");
var emptyResetBtn = document.getElementById("empty-reset-btn");
var tableBody = document.getElementById("table-body");
var emptyState = document.getElementById("empty-state");
var summaryEl = document.getElementById("result-summary");
var sortButtons = document.querySelectorAll(".sort-btn");

function loadInitialState() {
  var defaults = { q: "", category: "all", status: "all", sortCol: "date", sortDir: "desc" };

  // check URL query params first, then localStorage
  var params = new URLSearchParams(window.location.search);
  if (params.toString()) {
    return {
      q: params.get("q") || "",
      category: params.get("category") || "all",
      status: params.get("status") || "all",
      sortCol: params.get("sort") || "date",
      sortDir: params.get("dir") || "desc"
    };
  }

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return Object.assign({}, defaults, JSON.parse(saved));
    }
  } catch (err) {
    console.log("storage error", err);
  }
  return defaults;
}

function syncState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  var params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.category !== "all") params.set("category", state.category);
  if (state.status !== "all") params.set("status", state.status);
  params.set("sort", state.sortCol);
  params.set("dir", state.sortDir);

  var newUrl = window.location.pathname + "?" + params.toString();
  window.history.replaceState(null, "", newUrl);
}

function applyInputsFromState() {
  searchBox.value = state.q;
  categorySelect.value = state.category;
  statusSelect.value = state.status;
}

function renderTable() {
  var query = state.q.trim().toLowerCase();

  var filtered = transactions.filter(function (row) {
    if (state.category !== "all" && row.category !== state.category) return false;
    if (state.status !== "all" && row.status !== state.status) return false;
    if (query) {
      var matchMerchant = row.merchant.toLowerCase().indexOf(query) !== -1;
      var matchCategory = row.category.toLowerCase().indexOf(query) !== -1;
      if (!matchMerchant && !matchCategory) return false;
    }
    return true;
  });

  filtered.sort(function (a, b) {
    var valA = a[state.sortCol];
    var valB = b[state.sortCol];
    var cmp = 0;

    if (typeof valA === "number" && typeof valB === "number") {
      cmp = valA - valB;
    } else {
      cmp = String(valA).localeCompare(String(valB));
    }

    return state.sortDir === "asc" ? cmp : -cmp;
  });

  // update sort header arrows
  sortButtons.forEach(function (btn) {
    var col = btn.dataset.col;
    var arrow = btn.querySelector(".arrow");
    if (col === state.sortCol) {
      btn.classList.add("active");
      arrow.textContent = state.sortDir === "asc" ? "▲" : "▼";
