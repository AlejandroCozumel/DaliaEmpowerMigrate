"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AccessLevel } from "@/types/auth";
import { useSubscription } from "@/hooks/useSubscription";
import useAuthStore from "@/hooks/useAuthStore";
interface Props {
  accessLevel?: AccessLevel;
  redirectUrl?: string;
}

const ProtectedContent: React.FC<Props> = ({
  accessLevel = "auth",
  redirectUrl = "",
}) => {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  const { subscription } = useSubscription();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push(redirectUrl);
      return;
    }
    if (accessLevel === "subscription" && !subscription) {
      router.push("/subscription");
      return;
    }
    if (accessLevel === "premium" && !subscription?.freeTrial) {
      router.push("/premium");
      return;
    }
  }, [isAuthenticated, token, subscription, accessLevel, redirectUrl]);

  return (
    <section>
      <h1>Protected Content Here</h1>
      {subscription ? (
        <div className="mt-4">
          <h2>Your Active Subscription:</h2>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h2 className="text-yellow-800">No Active Subscription</h2>
          <p className="mt-2">Please subscribe to access premium features.</p>
        </div>
      )}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
          <p>Debug Info:</p>
          <pre>
            {JSON.stringify(
              {
                token: !!token,
                isAuthenticated,
                hasSubscription: !!subscription,
                accessLevel,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </section>
  );
};

export default ProtectedContent;