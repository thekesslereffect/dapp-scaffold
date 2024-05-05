import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useLanguage } from "../contexts/LanguageContextProvider";
import { useRouter } from 'next/router';  // Import useRouter

export const AppBar: React.FC = () => {
  const { setLanguage, language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();  // Use the useRouter hook
  // Check if current page is 'flappyPoot'
  const isFlappyPootPage = router.pathname === "/flappyPoot";

  return (
    <nav className={`fixed top-0 left-0 w-full z-10 flex items-center justify-between flex-wrap p-6 ${isFlappyPootPage && !isMobileMenuOpen ? "bg-transparent" : "bg-transparent backdrop-blur-md"}`}>

      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/" passHref onClick={() => setIsMobileMenuOpen(false)}>
          <div className="flex items-center gap-2" >
            <Image src="/assets/img/home-poot.png" height={70} width={70} alt="image" />
            <span className="font-bold text-3xl logo-font">POOT</span>
          </div>
        </Link>
      </div>
      <div className="block lg:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex items-center px-3 py-2 border rounded  hover:border-white">
          <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
      </div>
      <div className={`w-full block  float-right gap-10 lg:flex lg:items-center lg:w-auto ${isMobileMenuOpen ? "flex flex-col items-center " : "hidden"}`}>
 
          {/* <Link href="/" passHref onClick={() => setIsMobileMenuOpen(false)}>
            <div  className="block mt-4 lg:inline-block lg:mt-0 mr-4">
              Home
            </div>
          </Link>
          <Link href="/flappyPoot" passHref onClick={() => setIsMobileMenuOpen(false)} >
            <div className="block mt-4 lg:inline-block lg:mt-0">
              FlappyPoot
            </div>
          </Link> */}
        
        <div>
          <select onChange={(e) => setLanguage(e.target.value)} className="block lg:inline-block lg:mt-0 ">
            <option value="en">🇬🇧 English</option>
            <option value="zh-tw">🇹🇼 繁體中文</option>
            <option value="zh">🇨🇳 简体中文</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="id">🇮🇩 Indonesian</option>
            <option value="ro">🇷🇴 Română</option>
            <option value="vn">🇻🇳 Tiếng Việt</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>
        </div>
        <div>
          <WalletMultiButton className="button-connect"/>
        </div>
      </div>
    </nav>
  );
};
