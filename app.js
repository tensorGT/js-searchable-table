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

