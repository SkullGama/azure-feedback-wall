const visitCountEl = document.getElementById("visitCount");
const feedEl = document.getElementById("feed");
const form = document.getElementById("feedbackForm");
const statusEl = document.getElementById("status");

function li(text) {
  const el = document.createElement("li");
  el.textContent = text; // textContent avoids HTML injection
  return el;
}

async function refreshFeed() {
  const res = await fetch("/api/feedback", { method: "GET" });
  const data = await res.json();

  feedEl.innerHTML = "";
  (data.items || []).forEach((x) => {
    feedEl.appendChild(li(`${x.name}: ${x.message}`));
  });
}

async function bumpVisits() {
  const res = await fetch("/api/visits", { method: "POST" });
  const data = await res.json();
  visitCountEl.textContent = data.count ?? "0";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending...";

  const name = document.getElementById("name").value.trim() || "Anonymous";
  const message = document.getElementById("message").value.trim();

  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    document.getElementById("message").value = "";
    statusEl.textContent = "Thanks. Added!";
    await refreshFeed();
  } catch (err) {
    statusEl.textContent = "Something failed. Try again.";
  }
});

(async () => {
  await bumpVisits();
  await refreshFeed();
})();