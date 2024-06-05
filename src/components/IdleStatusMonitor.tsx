import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";
import { useTerra } from "../hooks/useTerra";

const idleTimeout = 15 * 60 * 1000; // 15 minutes of inactivity
const idleEvents = ['click', 'keydown'];

export const IdleStatusMonitor = () => {
  const auth = useAuth();
  const headers = useGenerateAuthHeaders();
  const { onTerra, apiBaseUrl } = useTerra();
  const timeoutId = useRef<number>();

  const signOut = auth.signoutRedirect;

  useEffect(() => {
    (async () => {
      if (!onTerra || !auth.isAuthenticated) return;

      const samHostname = apiBaseUrl.hostname.replace(/^[^.]+/, 'sam');
      const samGroupUrl = `https://${samHostname}/api/groups/v1`;

      const res = await fetch(samGroupUrl, { headers });
      const groups = await res.json() as { groupName: string }[];
      const isTimeoutEnabled = groups.some(g => g.groupName === 'session_timeout');
      if (!isTimeoutEnabled) return;

      const resetTimer = () => {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = window.setTimeout(() => {
          signOut({ post_logout_redirect_uri: location.origin })
        }, idleTimeout);
      };

      resetTimer();

      idleEvents.forEach(e =>
        document.addEventListener(e, resetTimer)
      );

      return () => {
        idleEvents.forEach(e =>
          document.removeEventListener(e, resetTimer)
        );
      };
    })().catch(console.error);
  }, [auth.isAuthenticated, onTerra, apiBaseUrl, headers, signOut]);

  return <div/>;
};
