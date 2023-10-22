import Link from "next/link";
import { getCheckoutUrl } from "~/stripe/stripePayment";
import { initFirebase } from "../firebase";
import { useRouter } from "next/navigation";

interface TopBarProps {
  isUserLoggedIn: boolean;
  isPremiumUser: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ isUserLoggedIn, isPremiumUser }) => {
  const app = initFirebase();
  const router = useRouter();
  const upgradeToPremium = async () => {
    const myPriceId = "price_1O3KUlHIBlFqgcGsEJHDPxj6";
    const checkoutUrl = await getCheckoutUrl(app, myPriceId);
    router.push(checkoutUrl);
    console.log("upgrade to premium");
  };
  return (
    <header className="sticky left-64 bg-blue-500 p-4">
      <div className="flex items-center justify-between">
        <div>
          {isUserLoggedIn ? (
            isPremiumUser ? (
              <button className="text-white">Account</button>
            ) : (
              <button className="rounded-full bg-yellow-500 px-3 py-1 text-white">
                Become Premium
              </button>
            )
          ) : (
            <Link href="/signin">
              <p className="text-white">Sign In</p>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
