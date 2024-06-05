import { useContext, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { AppContext } from "../App";
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";

const idleTimeout = 15 * 60 * 1000; // 15 minutes of inactivity
const idleEvents = ['click', 'keydown'];

export const IdleStatusMonitor = () => {
  const auth = useAuth();
  const headers = useGenerateAuthHeaders();
  const { apiBaseUrl } = useContext(AppContext);
  const timeoutId = useRef<number>();

  const signOut = auth.signoutRedirect;

  useEffect(() => {
    (async () => {
      if (!auth.isAuthenticated) return;

      const url = new URL(apiBaseUrl);
      const onTerra = url.hostname.endsWith('.broadinstitute.org');
      if (!onTerra) return;

      const samHostname = url.hostname.replace(/^[^.]+/, 'sam');
      const samGroupUrl = `https://${samHostname}/api/groups/v1`;

      const res = await fetch(samGroupUrl, { headers });
      const groups = await res.json() as { groupName: string }[];
      console.log('groups', groups);
      const isTimeoutEnabled = true; //groups.some(g => g.groupName === 'session_timeout');
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
  }, [auth.isAuthenticated, apiBaseUrl, headers, signOut]);

  return <div/>;
};
