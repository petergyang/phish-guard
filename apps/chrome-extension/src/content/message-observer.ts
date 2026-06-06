export function observeGmailMessages(onChange: () => void, root: ParentNode = document): () => void {
  let timeout: number | undefined;
  const schedule = () => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(onChange, 120);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["email", "name", "data-message-id", "data-legacy-message-id"]
  });

  schedule();

  return () => {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
    observer.disconnect();
  };
}
