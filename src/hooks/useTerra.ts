import { useContext, useMemo } from "react";
import { AppContext } from "../appContext";

const terraRe = /^(sfkit\.dsde-(dev|staging|prod)\.broadinstitute\.org)$/;

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);

    return useMemo(() => {
        const url = new URL(apiBaseUrl);
        const localDev = process.env.NODE_ENV === "development";
        const hostname = localDev ? "dev.sfkit.org" : url.hostname;
        const dev = hostname.includes("dev");
        console.log("dev", dev);

        return {
            onTerra: terraRe.test(url.hostname),
            apiBaseUrl,
            rawlsApiUrl: `https://${hostname.replace(/^sfkit\./, "rawls.")}/api`,
            samApiUrl: `https://${hostname.replace(/^sfkit\./, "sam.")}/api`,
            localDev,
            dev,
        };
    }, [apiBaseUrl]);
};
