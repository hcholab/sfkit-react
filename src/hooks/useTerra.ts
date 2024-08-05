import { useContext, useMemo } from "react";
import { AppContext } from "../App";

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);

    return useMemo(() => {
        const url = new URL(apiBaseUrl);

        return {
            onTerra: url.hostname.endsWith('.broadinstitute.org'),
            apiBaseUrl: url,
        };
    }, [apiBaseUrl]);
};
