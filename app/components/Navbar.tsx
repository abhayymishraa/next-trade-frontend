"use client";

import { usePathname, useRouter } from "next/navigation";
import { PrimaryButton, SuccessButton } from "./Button";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <>
      <div className="text-white border-b border-slate-800">
        <div className="flex justify-between items-center p-2">
          <div className="flex justify-center items-center">
            <div
              className=" flex pl-4 text-xl cursor-pointer"
              onClick={() => router.push("/")}
            >
              Next-Trade
            </div>
            <div className="flex justify-center items-center">
              <div
                className={`pl-8 text-sm cursor-pointer flex flex-col justify-center ${
                  pathname.startsWith("/market")
                    ? "text-white"
                    : "text-slate-500"
                }`}
                onClick={() => router.push("/markets")}
              >
                Markets
              </div>
              <div
                className={`pl-8 text-sm cursor-pointer ${
                  pathname.startsWith("/trade")
                    ? "text-white"
                    : "text-slate-500"
                } `}
                onClick={() => router.push('/trade/SOL_USDC')}
              >
                Trade
              </div>
            </div>
          </div>
          <div className=" flex mr-2 p-2">
            <SuccessButton>Deposit</SuccessButton>
            <PrimaryButton>Withdraw</PrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
