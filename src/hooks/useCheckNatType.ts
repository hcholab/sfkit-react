import { useCallback, useState } from 'react';

export const useCheckNatType = () => {
  const [isSymmetricNat, setIsSymmetricNat] = useState<boolean | null>(null);
  const [isCheckingNatType, setIsCheckingNatType] = useState<boolean | null>(null);

  const checkNatType = useCallback(async () => {
    setIsCheckingNatType(true);

    const candidates: Record<number, number[]> = {};
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.syncthing.net:3478' },
      ],
    });

    const finalizeNatType = () => {
      if (Object.keys(candidates).length === 1) {
        setIsSymmetricNat(Object.values(candidates)[0].length > 1);
      }
      setIsCheckingNatType(false);
      pc.close();
    }

    pc.onicecandidate = (e) => {
      const c = e.candidate;
      if (c && c.type === 'srflx' && c.relatedPort !== null && c.port !== null) {
        if (!candidates[c.relatedPort]) {
          candidates[c.relatedPort] = [c.port];
        } else {
          candidates[c.relatedPort].push(c.port);
        }
        return;
      } else if (!c) {
        finalizeNatType();
      }
    };

    pc.createDataChannel("stun");
    await pc.setLocalDescription(await pc.createOffer());
    setTimeout(finalizeNatType, 5000);
  }, []);

  return { checkNatType, isSymmetricNat, isCheckingNatType };
};
