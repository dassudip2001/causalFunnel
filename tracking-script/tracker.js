(function () {
  const API_URL = "http://localhost:5000/api/v1/analytics/event";

  function getSessionId() {
    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("session_id", sessionId);
    }

    return sessionId;
  }

  const sessionId = getSessionId();

  async function sendEvent(eventData) {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error(error);
    }
    console.log(eventData);
  }
  sendEvent({
    sessionId,
    eventType: "page_view",
    pageUrl: window.location.href,
    timestamp: new Date().toISOString(),
  });

  document.addEventListener("click", (e) => {
    sendEvent({
      sessionId,
      eventType: "click",
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      clickX: e.clientX,
      clickY: e.clientY,
    });
  });
})();
