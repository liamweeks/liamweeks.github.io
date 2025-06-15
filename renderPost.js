function getPostSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("post");
}

function renderPost(slug) {
  if (!slug) return;

  fetch(`posts/${slug}.md`)
    .then((res) => {
      if (!res.ok) throw new Error("Post not found.");
      return res.text();
    })
    .then((markdown) => {
      const html = marked.parse(markdown);
      const container = document.getElementById("post-container");
      container.innerHTML = html;
      hljs.highlightAll(); // syntax highlighting
      MathJax.typesetPromise(); // render LaTeX
    })
    .catch((err) => {
      document.getElementById("post-container").innerHTML =
        `<p style="color:red;">Error loading post: ${err.message}</p>`;
    });
}

async function loadPost(filename) {
    const response = await fetch(`posts/${filename}`);
    const text = await response.text();
    const html = marked.parse(text);

    const panel = document.getElementById("project-panel");
    panel.querySelector("#panel-title").textContent = filename.replace(".md", "");
    panel.querySelector("#panel-description").innerHTML = html;
    panel.classList.remove("hidden");
    setTimeout(() => panel.classList.add("active"), 10);
}


// On page load
document.addEventListener("DOMContentLoaded", () => {
  const slug = getPostSlug();
  renderPost(slug);
});
