import { useContext, useMemo } from "react";
import { AppContext } from "../App";

const terraRe = /^(sfkit\.dsde-(dev|staging|prod)\.broadinstitute\.org)$/;

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);

    return useMemo(() => {
        const url = new URL(apiBaseUrl);
        const dev = process.env.NODE_ENV === "development";

        return {
            onTerra: dev || terraRe.test(url.hostname),
            apiBaseUrl: url,
            dev,
        };
    }, [apiBaseUrl]);
};
