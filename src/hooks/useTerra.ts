import { useContext, useMemo } from "react";
import { AppContext } from "../App";

const terraRe = /^(sfkitui\.dsde-(dev|staging|prod)\.broadinstitute\.org|sfkit\.terra\.bio)$/;

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);

    return useMemo(() => {
        const url = new URL(apiBaseUrl);

        return {
            onTerra: terraRe.test(url.hostname),
            apiBaseUrl: url,
        };
    }, [apiBaseUrl]);
};
