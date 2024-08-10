//data-testid="comment-base-item-10002"
//data-testid="render-reactions"
//aria-label=":thumbsup:"

chrome.runtime.onInstalled.addListener(() => {
  let parsed = null;
  chrome.storage.sync.get(["config"]).then((result) => {
    if (result.config) {
      parsed = JSON.parse(result.config);
    }
  });
  const findCommentsWithReaction = async () => {
    let [tab] = await chrome.tabs.query({
      active: true,
      url: "https://*.atlassian.net/jira/*",
    });
    if (tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [parsed, tab],
        func: (parsed, tab) => {
          console.log(parsed);
          if (tab.url.includes("selectedIssue")) {
            for (let i = 0; i < parsed.length; i++) {
              if (
                parsed[i].name.length > 0 &&
                tab.url.includes("projects/" + parsed[i].name + "/")
              ) {
                let comments = document.querySelectorAll(
                  `[data-testid*="comment-base-item"]`
                );
                comments.forEach((comment) => {
                  for (let j = 0; j < parsed[i].rules.length; j++) {
                    let reactions = comment.querySelectorAll(
                      `[aria-label=":${parsed[i].rules[j].emoji}:"]`
                    );
                    if (reactions.length > 0) {
                      comment.style.filter = "opacity(0.5)";
                    } else {
                      comment.style.filter = "none";
                    }
                  }
                });
              }
            }
          }
        },
      });
    }
  };
  setInterval(() => {
    findCommentsWithReaction();
  }, 2500);
});
