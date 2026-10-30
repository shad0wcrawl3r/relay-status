"use strict";

const LABELS = { success: ["ok", "Passing"], failure: ["bad", "Failing"], cancelled: ["warn", "Cancelled"] };

function ago(iso) {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} min ago`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h ago`;
  return `${Math.round(seconds / 86400)} d ago`;
}

function setBanner(state, headline, subline) {
  document.getElementById("banner").dataset.state = state;
  document.getElementById("headline").textContent = headline;
  document.getElementById("subline").textContent = subline;
}

function pill(element, [state, label]) {
  element.dataset.state = state;
  element.textContent = label;
}

function render(status) {
  const list = document.getElementById("platforms");
  list.replaceChildren(...status.platforms.map((platform) => {
    const row = document.createElement("li");
    const name = document.createElement("span");
    const result = document.createElement("span");
    name.textContent = platform.name;
    result.className = "pill";
    pill(result, LABELS[platform.conclusion] ?? ["unknown", "Unknown"]);
    row.append(name, result);
    return row;
  }));

  const failing = status.platforms.filter((platform) => platform.conclusion !== "success");
  if (status.platforms.length === 0) setBanner("unknown", "No build data yet", "Waiting for the first build.");
  else if (failing.length === 0) setBanner("ok", "All builds passing", `Last build ${ago(status.updated_at)}.`);
  else setBanner("bad", "Build problem", `${failing.map((platform) => platform.name).join(", ")} did not pass.`);

  document.getElementById("version").textContent = status.version ?? "Not released yet";
  document.getElementById("updated").textContent = ago(status.updated_at);
  document.getElementById("commit").textContent = status.commit;
}

fetch("/status.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error(String(response.status));
    return response.json();
  })
  .then(render)
  .catch(() => setBanner("warn", "Status unavailable", "Build data couldn't be loaded."));

fetch("/oauth/callback", { method: "HEAD", cache: "no-store" })
  .then((response) => pill(document.getElementById("callback"), response.ok ? ["ok", "Online"] : ["bad", "Offline"]))
  .catch(() => pill(document.getElementById("callback"), ["bad", "Offline"]));
