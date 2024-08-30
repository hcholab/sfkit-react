import { useContext, useMemo } from "react";
import { AppContext } from "../App";

const terraRe = /^(sfkit\.dsde-(dev|staging|prod)\.broadinstitute\.org)$/;

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);

    return useMemo(() => {
        const url = new URL(apiBaseUrl);
        const dev = process.env.NODE_ENV === "development";
        const hostname = dev ? "sfkit.dsde-dev.broadinstitute.org" : url.hostname;

        return {
            onTerra: dev || terraRe.test(url.hostname),
            apiBaseUrl: url,
            rawlsApiUrl: `https://${hostname.replace(/^sfkit\./, "rawls.")}/api`,
            samApiUrl: `https://${hostname.replace(/^sfkit\./, "sam.")}/api`,
            dev,
        };
    }, [apiBaseUrl]);
};
