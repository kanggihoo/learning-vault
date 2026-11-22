for (const quiz of document.querySelectorAll('.quiz')) {
  const choices = [...quiz.querySelectorAll('button[data-answer]')];
  const correct = choices.find((button) => button.dataset.answer === 'correct');
  const result = quiz.querySelector('.answer');

  for (const choice of choices) {
    choice.addEventListener('click', () => {
      for (const button of choices) {
        button.setAttribute('aria-pressed', String(button === choice));
      }

      if (choice === correct) {
        result.className = 'answer ok';
        result.textContent = `${quiz.dataset.correct} ${choice.dataset.feedback}`;
      } else {
        result.className = 'answer no';
        const feedback = [
          `${quiz.dataset.wrong} ${choice.dataset.feedback}`,
          `${quiz.dataset.answerLabel}: ${correct.textContent.trim()}`,
        ];
        if (choice.dataset.feedback !== correct.dataset.feedback) feedback.push(correct.dataset.feedback);
        result.textContent = feedback.join('\n');
      }
    });
  }
}
