import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { StorageService } from "../../services/storage";

export const TestSessionGuard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const session = StorageService.getSession();
        if (!session) return;

        const targetPath = `/tests/${session.testId}`;
        if (location.pathname.startsWith(targetPath)) return;

        navigate(targetPath, { replace: true });
    }, [location.pathname, navigate]);

    return null;
};
