const q = document.getElementById('q');
q.addEventListener('input', () => {
  const s = q.value.toLowerCase();
  document.querySelectorAll('li').forEach(li =>
    li.classList.toggle('hidden', !li.textContent.toLowerCase().includes(s)));
  document.querySelectorAll('section').forEach(sec =>
    sec.classList.toggle('hidden', !sec.querySelector('li:not(.hidden)')));
});
