import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from 'react-router-dom';
import useGenerateAuthHeaders from "../hooks/useGenerateAuthHeaders";
import { useTerra } from "../hooks/useTerra";

const idleTimeoutMins = 15; // minutes of inactivity
const idleTimeout = idleTimeoutMins * 60 * 1000;
const idleEvents = ['click', 'keydown'];

export const IdleStatusMonitor = () => {
  const auth = useAuth();
  const headers = useGenerateAuthHeaders();
  const { onTerra, samApiUrl } = useTerra();
  const timeoutId = useRef<number>();
  const navigate = useNavigate();

  const signOut = auth.signoutRedirect;

  useEffect(() => {
    (async () => {
      if (!onTerra || !auth.isAuthenticated || timeoutId.current) return;

      const res = await fetch(`${samApiUrl}/groups/v1`, { headers });
      const groups = await res.json() as { groupName: string }[];
      const isTimeoutEnabled = groups.some(g => g.groupName === 'session_timeout');
      if (!isTimeoutEnabled) return;

      const logIdle = (msg: string) =>
        console.log(`[${new Date().toLocaleString()}] ${msg}`);

      const resetTimer = () => {
        if (timeoutId.current) {
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
        idleEvents.forEach(e =>
          document.removeEventListener(e, resetTimer)
        );
        timeoutId.current = undefined;
      };
    })().catch(console.error);
  }, [auth.isAuthenticated, onTerra, samApiUrl, headers, navigate, signOut]);

  return <div />;
};
