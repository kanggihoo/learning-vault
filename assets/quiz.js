// Shared quiz component for Learning Vault lessons.
//
// Markup contract:
//   <section class="quiz">
//     <p><strong>Q1.</strong> ...</p>
//     <button type="button" data-target="answer-1" data-answer="correct">...</button>
//     <button type="button" data-target="answer-1" data-answer="wrong">...</button>
//     <p class="answer" id="answer-1"></p>
//   </section>
//
// Optional: put a per-question hint in data-hint on the wrong buttons.
document.querySelectorAll(".quiz button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.target);
    if (!target) return;
    const isCorrect = button.dataset.answer === "correct";
    target.textContent = isCorrect
      ? "정답."
      : button.dataset.hint ||
        "오답. 이 section의 핵심 문장을 다시 떠올려보자 — 위로 스크롤해서 다시 읽어도 좋다.";
    target.className = isCorrect ? "answer ok" : "answer no";
  });
});
