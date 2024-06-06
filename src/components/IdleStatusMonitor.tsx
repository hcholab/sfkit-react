import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";
import { useTerra } from "../hooks/useTerra";

const idleTimeoutMins = 0.5; // minutes of inactivity
const idleTimeout = idleTimeoutMins * 60 * 1000;
const idleEvents = ['click', 'keydown'];

export const IdleStatusMonitor = () => {
  const auth = useAuth();
  const headers = useGenerateAuthHeaders();
  const { onTerra, apiBaseUrl } = useTerra();
  const timeoutId = useRef<number>();
  const navigate = useNavigate();

  const signOut = auth.signoutRedirect;

  useEffect(() => {
    (async () => {
      if (!onTerra || !auth.isAuthenticated) return;

      const samHostname = apiBaseUrl.hostname.replace(/^[^.]+/, 'sam');
      const samGroupUrl = `https://${samHostname}/api/groups/v1`;

      const res = await fetch(samGroupUrl, { headers });
      const groups = await res.json() as { groupName: string }[];
      const isTimeoutEnabled = true || groups.some(g => g.groupName === 'session_timeout');
      if (!isTimeoutEnabled) return;

      const logIdle = (msg: string) =>
        console.log(`[${new Date().toLocaleString()}] ${msg}`);

      const resetTimer = () => {
        if (timeoutId.current) {
          logIdle('User activity detected. Resetting idle timeout.');
          clearTimeout(timeoutId.current);
        }
        timeoutId.current = window.setTimeout(async () => {
          logIdle(`User has been idle for ${idleTimeoutMins} minutes. Signing out.`);
          await signOut();
          navigate('/');
        }, idleTimeout);
      };

      resetTimer();
      logIdle('Idle timeout is enabled. ' +
        `User will be signed out after ${idleTimeoutMins} minutes of inactivity.`
      );

      idleEvents.forEach(e =>
        document.addEventListener(e, resetTimer)
      );

      return () => {
        logIdle(`Cleaning up idle timeout.`);
        idleEvents.forEach(e =>
          document.removeEventListener(e, resetTimer)
        );
      };
    })().catch(console.error);
  }, [auth.isAuthenticated, onTerra, apiBaseUrl, headers, signOut]);

  return <div />;
};
