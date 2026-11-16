// B-tree page-walk visualizer and depth calculator for Learning Vault lessons.
// Pair with assets/diagram.css (uses .d-box*, .d-line*, .d-label*, .bt-*).
//
// 1) Page walk
//   <div class="btree-viz" data-key="4200" data-tree='TREE_JSON'></div>
//   TREE_JSON: internal page {"keys":[3000,6000],"children":[...]}
//              leaf page     {"leaf":[3000,3999]}   (key range held by the leaf)
//   Renders the tree as pages, then steps a lookup root → leaf, one page read per click.
//
// 2) Depth calculator
//   <div class="depth-calc"></div>
//   Shows how many page reads (tree depth) n keys need for a given branching factor,
//   next to a binary tree (branching factor 2).

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const el = (name, attrs, text) => {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    return n;
  };
  const html = (tag, attrs, text) => {
    const n = document.createElement(tag);
    Object.assign(n, attrs || {});
    if (text !== undefined) n.textContent = text;
    return n;
  };

  function mountWalk(root) {
    const tree = JSON.parse(root.dataset.tree);
    const levels = [];
    let pageNo = 1;
    (function walk(node, depth) {
      (levels[depth] = levels[depth] || []).push(node);
      node.page = pageNo++;
      node.depth = depth;
      (node.children || []).forEach((c) => walk(c, depth + 1));
    })(tree, 0);
    // BFS page numbers read more naturally (root = #1, then level by level).
    pageNo = 1;
    levels.forEach((lv) => lv.forEach((n) => (n.page = pageNo++)));

    const leaves = levels[levels.length - 1];
    const LW = 86, GAP = 8, LH = 46, VG = 70, PAD = 10;
    const W = leaves.length * (LW + GAP) - GAP + PAD * 2;
    const H = levels.length * (LH + VG) - VG + PAD * 2 + 16;
    leaves.forEach((n, i) => (n.cx = PAD + i * (LW + GAP) + LW / 2));
    for (let d = levels.length - 2; d >= 0; d--)
      levels[d].forEach((n) => {
        const cs = n.children;
        n.cx = (cs[0].cx + cs[cs.length - 1].cx) / 2;
      });

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": "B-tree page 구조" });
    const lineLayer = el("g", {});
    const boxLayer = el("g", {});
    svg.append(lineLayer, boxLayer);

    levels.forEach((lv) =>
      lv.forEach((n) => {
        const isLeaf = !!n.leaf;
        const w = isLeaf ? LW : Math.max(130, 46 * (n.keys.length * 2 + 1) / 2);
        const x = n.cx - w / 2;
        const y = PAD + 16 + n.depth * (LH + VG);
        n.box = { x, y, w };
        const g = el("g", {});
        n.rect = el("rect", { class: "d-box", x, y, width: w, height: LH });
        g.append(n.rect);
        g.append(el("text", { class: "d-label-sm", x: x + 4, y: y - 4 }, `page #${n.page}`));
        if (isLeaf) {
          g.append(el("text", { class: "d-label-mono", x: n.cx, y: y + 20, "text-anchor": "middle" }, `${n.leaf[0]}~${n.leaf[1]}`));
          g.append(el("text", { class: "d-label-sm", x: n.cx, y: y + 36, "text-anchor": "middle" }, "key + 값"));
        } else {
          // Slots: ptr | key | ptr | key | ptr ...
          const slots = n.keys.length * 2 + 1;
          const sw = w / slots;
          n.ptrX = [];
          for (let s = 0; s < slots; s++) {
            const sx = x + s * sw + sw / 2;
            if (s % 2 === 0) {
              n.ptrX.push(sx);
              g.append(el("circle", { cx: sx, cy: y + LH / 2, r: 4, fill: "#52606d" }));
            } else {
              g.append(el("text", { class: "d-label-mono", x: sx, y: y + LH / 2 + 4, "text-anchor": "middle" }, String(n.keys[(s - 1) / 2])));
            }
            if (s > 0) g.append(el("line", { class: "d-line-d", x1: x + s * sw, y1: y + 6, x2: x + s * sw, y2: y + LH - 6 }));
          }
        }
        boxLayer.append(g);
        (n.children || []).forEach((c, i) => {
          c.edge = el("line", {
            class: "d-line", x1: n.ptrX[i], y1: y + LH / 2 + 4,
            x2: c.cx, y2: PAD + 16 + c.depth * (LH + VG),
          });
          lineLayer.append(c.edge);
        });
      })
    );

    const fig = html("figure", { className: "diagram" });
    fig.append(svg);
    const controls = html("div", { className: "bt-controls" });
    const input = html("input", { type: "number", value: root.dataset.key || "4200" });
    const startBtn = html("button", { type: "button" }, "찾기 시작");
    const nextBtn = html("button", { type: "button" }, "다음 page 읽기 ▶");
    const counter = html("span", { className: "bt-counter" }, "읽은 page: 0");
    controls.append(html("label", {}, "찾을 key "), input, startBtn, nextBtn, counter);
    const log = html("ol", { className: "bt-log" });
    root.append(fig, controls, log);

    let path = [], step = 0;
    const reset = () => {
      levels.flat().forEach((n) => {
        n.rect.setAttribute("class", "d-box");
        if (n.edge) n.edge.setAttribute("class", "d-line");
      });
      log.innerHTML = "";
      step = 0;
      counter.textContent = "읽은 page: 0";
      nextBtn.disabled = true;
    };
    const plan = (key) => {
      const out = [];
      let n = tree;
      while (true) {
        if (n.leaf) {
          const hit = key >= n.leaf[0] && key <= n.leaf[1];
          out.push({ n, msg: hit
            ? `page #${n.page}(leaf) 읽음. 이 page 안에서 ${key}를 찾아 값(또는 값의 위치)을 얻는다. 끝.`
            : `page #${n.page}(leaf) 읽음. ${key}가 이 page에 없다. 다른 page에도 있을 수 없으니 결과 없음.` });
          return out;
        }
        let i = 0;
        while (i < n.keys.length && key >= n.keys[i]) i++;
        const lo = i === 0 ? "−∞" : n.keys[i - 1];
        const hi = i === n.keys.length ? "+∞" : n.keys[i];
        out.push({ n, msg: `page #${n.page} 읽음. 경계를 보면 ${lo} ≤ ${key} < ${hi} → ${i + 1}번째 참조를 따라 page #${n.children[i].page}로.` });
        n = n.children[i];
      }
    };
    const advance = () => {
      if (step >= path.length) return;
      const { n, msg } = path[step];
      if (step > 0) path[step - 1].n.rect.setAttribute("class", "d-box-a");
      n.rect.setAttribute("class", "d-box-b");
      if (n.edge) n.edge.setAttribute("class", "d-line-a");
      log.append(html("li", {}, msg));
      step++;
      counter.textContent = `읽은 page: ${step}`;
      if (step >= path.length) {
        nextBtn.disabled = true;
        const total = levels.flat().length;
        log.append(html("li", { className: "bt-done" }, `총 ${step}번 읽음. 전체 page ${total}개 중 나머지 ${total - step}개는 열어 보지도 않았다.`));
      }
    };
    startBtn.addEventListener("click", () => {
      reset();
      path = plan(Number(input.value));
      nextBtn.disabled = false;
      advance();
    });
    nextBtn.addEventListener("click", advance);
    reset();
  }

  function mountDepth(root) {
    const ns = [[1e4, "1만"], [1e6, "100만"], [1e8, "1억"], [1e10, "100억"]];
    const bs = [2, 10, 100, 500];
    const depth = (n, b) => Math.ceil(Math.log(n) / Math.log(b) - 1e-9);
    const rowSel = html("select");
    ns.forEach(([v, t], i) => rowSel.append(html("option", { value: v, selected: i === 2 }, t + " 개")));
    const bSel = html("select");
    bs.forEach((b) => bSel.append(html("option", { value: b, selected: b === 500 }, `branching factor ${b}`)));
    const out = html("div", { className: "bt-bars" });
    const controls = html("div", { className: "bt-controls" });
    controls.append(html("label", {}, "key 개수 "), rowSel, html("label", {}, " page 하나가 가리키는 child 수 "), bSel);
    root.append(controls, out);
    const draw = () => {
      const n = Number(rowSel.value), b = Number(bSel.value);
      const rows = [[`이진 트리 (b=2)`, depth(n, 2)], [`B-tree (b=${b})`, depth(n, b)]];
      const max = depth(n, 2);
      out.innerHTML = "";
      rows.forEach(([label, d]) => {
        const row = html("div", { className: "bt-bar-row" });
        const bar = html("div", { className: "bt-bar" });
        bar.style.width = `${(d / max) * 100}%`;
        row.append(html("span", { className: "bt-bar-label" }, label), bar, html("span", { className: "bt-bar-val" }, `${d}번 읽기`));
        out.append(row);
      });
    };
    rowSel.addEventListener("change", draw);
    bSel.addEventListener("change", draw);
    draw();
  }

  document.querySelectorAll(".btree-viz").forEach(mountWalk);
  document.querySelectorAll(".depth-calc").forEach(mountDepth);
})();
