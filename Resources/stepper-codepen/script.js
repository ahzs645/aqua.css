// Stepper / Spinner functionality
(function() {
  document.querySelectorAll('.aqua-spinner').forEach(function(spinner) {
    var input = spinner.querySelector('input');
    var buttons = spinner.querySelectorAll('.aqua-spinner-buttons button');

    if (!input || buttons.length < 2) return;

    var min = parseFloat(input.min) || -Infinity;
    var max = parseFloat(input.max) || Infinity;
    var step = parseFloat(input.step) || 1;

    // Up button (first)
    buttons[0].addEventListener('click', function() {
      var current = parseFloat(input.value) || 0;
      input.value = Math.min(max, current + step);
      input.dispatchEvent(new Event('change'));
    });

    // Down button (second)
    buttons[1].addEventListener('click', function() {
      var current = parseFloat(input.value) || 0;
      input.value = Math.max(min, current - step);
      input.dispatchEvent(new Event('change'));
    });
  });
})();
