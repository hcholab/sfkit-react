import { useAuth } from "../auth";

const useFirestore = () => {
  const { user } = useAuth();
  return {
    userId: user?.uid ?? "",
    isDbInitialized: true,
  };
};

export default useFirestore;
