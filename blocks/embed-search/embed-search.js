export default function decorate(block) {
  const a = block.querySelector('a');
  if (a) {
    const url = new URL(a.href);
    const iframe = document.createElement('iframe');
    iframe.src = url.href;
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.classList.add('embed-search-iframe');
    a.parentElement.replaceWith(iframe);
  }
}
