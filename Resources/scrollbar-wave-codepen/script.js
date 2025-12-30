// Arrow mode switching
function setArrowMode(mode) {
  var container = document.getElementById('scrollbar-wave-demo');
  if (container) {
    if (mode === 'split') {
      container.classList.add('arrows-split');
    } else {
      container.classList.remove('arrows-split');
    }
  }
}

// Wave Scrollbar setup
(function() {
  var scrollContent = document.getElementById('scrollbar-wave-content');
  var scrollbarTrack = document.getElementById('scrollbar-wave-track');
  var scrollbarThumb = document.getElementById('scrollbar-wave-thumb');
  var thumbShimmer = document.getElementById('scrollbar-wave-shimmer');

  if (!scrollContent || !scrollbarTrack || !scrollbarThumb || !thumbShimmer) return;

  var isDragging = false;
  var startY = 0;
  var startScrollTop = 0;

  function updateScrollbar() {
    var contentHeight = scrollContent.scrollHeight;
    var visibleHeight = scrollContent.clientHeight;
    var scrollTop = scrollContent.scrollTop;
    var trackHeight = scrollbarTrack.clientHeight;

    var thumbHeight = Math.max(40, (visibleHeight / contentHeight) * trackHeight);
    scrollbarThumb.style.height = thumbHeight + 'px';

    var maxScroll = contentHeight - visibleHeight;
    var maxThumbTop = trackHeight - thumbHeight;
    var thumbTop = maxScroll > 0 ? (scrollTop / maxScroll) * maxThumbTop : 0;
    scrollbarThumb.style.top = thumbTop + 'px';

    thumbShimmer.style.height = trackHeight + 'px';
    thumbShimmer.style.top = -thumbTop + 'px';
  }

  scrollContent.addEventListener('scroll', updateScrollbar);
  window.addEventListener('resize', updateScrollbar);
  updateScrollbar();

  // Drag functionality
  scrollbarThumb.addEventListener('mousedown', function(e) {
    isDragging = true;
    startY = e.clientY;
    startScrollTop = scrollContent.scrollTop;
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    var trackHeight = scrollbarTrack.clientHeight;
    var thumbHeight = scrollbarThumb.clientHeight;
    var contentHeight = scrollContent.scrollHeight;
    var visibleHeight = scrollContent.clientHeight;

    var deltaY = e.clientY - startY;
    var maxThumbTop = trackHeight - thumbHeight;
    var maxScroll = contentHeight - visibleHeight;

    var scrollDelta = (deltaY / maxThumbTop) * maxScroll;
    scrollContent.scrollTop = startScrollTop + scrollDelta;
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    document.body.style.userSelect = '';
  });

  // Click on track to jump
  scrollbarTrack.addEventListener('click', function(e) {
    if (e.target === scrollbarThumb || scrollbarThumb.contains(e.target)) return;

    var trackRect = scrollbarTrack.getBoundingClientRect();
    var clickY = e.clientY - trackRect.top;
    var trackHeight = scrollbarTrack.clientHeight;
    var thumbHeight = scrollbarThumb.clientHeight;
    var contentHeight = scrollContent.scrollHeight;
    var visibleHeight = scrollContent.clientHeight;

    var targetThumbTop = clickY - thumbHeight / 2;
    var maxThumbTop = trackHeight - thumbHeight;
    var maxScroll = contentHeight - visibleHeight;

    var newScrollTop = (targetThumbTop / maxThumbTop) * maxScroll;
    scrollContent.scrollTop = Math.max(0, Math.min(maxScroll, newScrollTop));
  });

  // Arrow buttons
  var btnUp = document.getElementById('scrollbar-btn-up');
  var btnDown = document.getElementById('scrollbar-btn-down');
  var btnTop = document.getElementById('scrollbar-btn-top');
  var btnBottom = document.getElementById('scrollbar-btn-bottom');
  var scrollStep = 20;
  var scrollInterval = null;

  function startScrolling(direction) {
    scrollContent.scrollTop += direction * scrollStep;
    scrollInterval = setInterval(function() {
      scrollContent.scrollTop += direction * scrollStep;
    }, 50);
  }

  function stopScrolling() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  // Up buttons
  [btnUp, btnTop].forEach(function(btn) {
    if (btn) {
      btn.addEventListener('mousedown', function() { startScrolling(-1); });
      btn.addEventListener('mouseup', stopScrolling);
      btn.addEventListener('mouseleave', stopScrolling);
    }
  });

  // Down buttons
  [btnDown, btnBottom].forEach(function(btn) {
    if (btn) {
      btn.addEventListener('mousedown', function() { startScrolling(1); });
      btn.addEventListener('mouseup', stopScrolling);
      btn.addEventListener('mouseleave', stopScrolling);
    }
  });
})();
