import { useContext } from "react";
import { AppContext } from "../App";

export const useTerra = () => {
    const { apiBaseUrl } = useContext(AppContext);
    const url = new URL(apiBaseUrl);

    return {
        onTerra: url.hostname.endsWith('.broadinstitute.org'),
        apiBaseUrl: url,
    };
};
