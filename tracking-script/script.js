(function (window) {
  const Tracker = {
    init(config) {
      this.apiUrl = config.apiUrl;
      this.sessionId = this.getSessionId();

      this.trackPageView();
      this.trackClicks();
    },

    getSessionId() {
      let sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);
      }

      return sessionId;
    },

    async sendEvent(eventData) {
      try {
        await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      } catch (error) {
        console.error("Tracking Error:", error);
      }
    },

    trackPageView() {
      this.sendEvent({
        sessionId: this.sessionId,
        eventType: "page_view",
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
      });
    },

    trackClicks() {
      document.addEventListener("click", (e) => {
        this.sendEvent({
          sessionId: this.sessionId,
          eventType: "click",
          pageUrl: window.location.href,
          timestamp: new Date().toISOString(),
          clickX: e.clientX,
          clickY: e.clientY,
        });
      });
    },
  };

  window.AnalyticsTracker = Tracker;
})(window);
