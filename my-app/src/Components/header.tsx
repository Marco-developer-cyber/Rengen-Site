import React, { useState, useEffect } from "react";
import "./Styles/header.css";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Проверяем предпочтения пользователя или сохраненную тему
    return localStorage.getItem('theme') === 'dark' || 
           (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const location = useLocation();

  // Применяем тему при изменении состояния
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Закрываем меню при изменении маршрута
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header className="bg-[#1A0033] text-white shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-[#00C2D1]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Логотип Рентген-анализ"
            className="h-10 w-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTUtMTAtNXptMCAxNEwyIDEzbDEwIDUgMTAtNS0xMC01eiIvPjwvc3ZnPg==";
            }}
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] bg-clip-text text-transparent transition-opacity hover:opacity-80">
            Рентген-анализ
          </h1>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className={`${location.pathname === '/' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} hover:text-[#CE67D3] transition duration-300 font-medium`}
          >
            Главная
          </Link>
          <Link
            to="/about"
            className={`${location.pathname === '/about' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} hover:text-[#CE67D3] transition duration-300 font-medium`}
          >
            О нас
          </Link>
          <Link
            to="/contact"
            className={`${location.pathname === '/contact' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} hover:text-[#CE67D3] transition duration-300 font-medium`}
          >
            Контакты
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-[#0C0F3A] hover:bg-[#00C2D1] transition duration-300 group"
            aria-label={isDarkMode ? "Переключить на светлую тему" : "Переключить на темную тему"}
          >
            {isDarkMode ? (
              <span className="block group-hover:scale-110">☀️</span>
            ) : (
              <span className="block group-hover:scale-110">🌙</span>
            )}
          </button>

          <Link 
            to="/uploadImages"
            className="hidden md:block bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] text-white px-5 py-2 rounded-full hover:from-[#00FFF7] hover:to-[#CE67D3] transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(0,194,209,0.5)] active:scale-95"
          >
            Начать анализ
          </Link>

          <button
            className="md:hidden p-2 rounded-lg bg-[#0C0F3A] hover:bg-[#00C2D3] transition duration-300"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A0033] border-t border-[#00C2D1]/20 animate-fadeIn">
          <nav className="flex flex-col px-4 py-3 space-y-3">
            <Link
              to="/"
              className={`${location.pathname === '/' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} py-2 px-3 rounded-lg hover:bg-[#0C0F3A] transition duration-300`}
              onClick={toggleMenu}
            >
              Главная
            </Link>
            <Link
              to="/about"
              className={`${location.pathname === '/about' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} py-2 px-3 rounded-lg hover:bg-[#0C0F3A] transition duration-300`}
              onClick={toggleMenu}
            >
              О нас
            </Link>
            <Link
              to="/contact"
              className={`${location.pathname === '/contact' ? 'text-[#CE67D3]' : 'text-[#00FFF7]'} py-2 px-3 rounded-lg hover:bg-[#0C0F3A] transition duration-300`}
              onClick={toggleMenu}
            >
              Контакты
            </Link>
            <Link 
              to="/uploadImages"
              className="bg-gradient-to-r from-[#00C2D1] to-[#CE67D3] text-white px-5 py-2 rounded-full mt-2 text-center hover:from-[#00FFF7] hover:to-[#CE67D3] transition-all duration-300 active:scale-95"
              onClick={toggleMenu}
            >
              Начать анализ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;