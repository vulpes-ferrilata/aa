import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ArrowLeftOnRectangleIcon, SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';

import { RootState } from 'app/store';
import { setScheme, ColorScheme } from 'features/colorScheme/slice';
import { useRevokeMutation } from 'features/auth/api';

function withMenubar<T>(WrappedComponent: React.ComponentType<any>) {
    return function(props: T) {
        const dispatch = useDispatch();
        const { t, i18n } = useTranslation("common");
        const navigate = useNavigate();
        const [revoke] = useRevokeMutation();

        const colorScheme = useSelector<RootState, ColorScheme>(state => state.colorScheme);
        const isLoggedIn = useSelector<RootState, boolean>(state => !!state.auth.accessToken);
        const refreshToken = useSelector<RootState, string | null>(state => state.auth.refreshToken);

        const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
        const menuContainerRef = useRef<HTMLUListElement>(null);

        const [isLanguageExpanded, setIsLanguageExpanded] = useState<boolean>(false);
    
        const toggleColorScheme = () => {
            switch (colorScheme) {
                case ColorScheme.Light:
                    dispatch(setScheme(ColorScheme.Dark));
                    break;
                case ColorScheme.Dark:
                    dispatch(setScheme(ColorScheme.Light));
                    break;
            }
        };

        const toggleMenuDescription = (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
            if (event.target === event.currentTarget) {
                setIsMenuExpanded(wasMenuExpanded => !wasMenuExpanded);
            }            
        };

        const toggleLanguageSubmenu = () => {
            setIsLanguageExpanded(wasLanguageExpanded => !wasLanguageExpanded);
        };

        useEffect(() => {
            const hideLanguageSubmenu = (event: MouseEvent) => {
                if (isLanguageExpanded && menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
                    setIsLanguageExpanded(false);
                }
            }

            document.addEventListener("click", hideLanguageSubmenu)
        
            return () => document.removeEventListener("click", hideLanguageSubmenu)
        }, [isLanguageExpanded]);

        useEffect(() => {
            const hideMenuDescription = (event: MouseEvent) => {
                if (isMenuExpanded && menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
                    setIsMenuExpanded(false);
                }
            }

            document.addEventListener("click", hideMenuDescription)
        
            return () => document.removeEventListener("click", hideMenuDescription)
        }, [isMenuExpanded]);

        const changeLanguage = (language: string) => {
            if (!i18n.language.startsWith(language)) {
                i18n.changeLanguage(language);
            }
        };

        const logout = () => {
            revoke(refreshToken || "");

            navigate("/");
        };
    
        const renderColorScheme = useMemo(() => {
            switch (colorScheme) {
                case ColorScheme.Light:
                    return (
                        <>
                            <MoonIcon className="w-6 h-6"/>
                            <div className={classNames("overflow-hidden transition-all landscape:max-w-0", {
                                "landscape:!max-w-full":isMenuExpanded
                            })}>
                                <label className="pl-4 whitespace-nowrap cursor-pointer">Dark Mode</label>
                            </div>
                        </>
                    )
                case ColorScheme.Dark:
                    return (
                        <>
                            <SunIcon className="w-6 h-6"/>
                            <div className={classNames("overflow-hidden transition-all landscape:max-w-0", {
                                "landscape:!max-w-full": isMenuExpanded
                            })}>
                                <label className="pl-4 whitespace-nowrap cursor-pointer">Light Mode</label>
                            </div>
                        </> 
                    )
            }
        }, [colorScheme, isMenuExpanded]);
    
        return (
            <div className="flex flex-col w-full h-full landscape:flex-row">
                <menu className="rounded-b-md bg-blue-600 text-slate-300 landscape:rounded-r-md dark:bg-blue-900">
                    <ul ref={menuContainerRef} className="flex w-full h-full landscape:flex-col" onClick={(event) => toggleMenuDescription(event)}>
                        <li className="flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10" onClick={() => toggleColorScheme()}>
                            {renderColorScheme}                
                        </li>

                        <li className="relative">
                            <div className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                                "text-white": isLanguageExpanded
                            })}
                            onClick={() => toggleLanguageSubmenu()}>
                                <LanguageIcon className="w-6 h-6"/>
                                <div className={classNames("overflow-hidden transition-all landscape:max-w-0", {
                                    "landscape:!max-w-full": isMenuExpanded
                                })}>
                                    <label className="pl-4 whitespace-nowrap cursor-pointer">{t("menu.language")}</label>
                                </div>
                            </div>

                            <ul className={classNames("absolute left-0 top-full max-h-0 min-w-full rounded-b-md bg-blue-600 overflow-hidden z-40 transition-all dark:bg-blue-900 landscape:left-full landscape:top-0 landscape:min-w-0 landscape:max-w-0 landscape:max-h-max landscape:!rounded-r-md landscape:rounded-b-none", {
                                "!max-h-screen landscape:!max-w-screen": isLanguageExpanded
                            })}>
                                <li className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                                    "text-white": i18n.language.startsWith("en")
                                })}
                                onClick={() => changeLanguage("en")}>
                                    <label className="whitespace-nowrap cursor-pointer">English</label>
                                </li>

                                <li className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                                    "text-white": i18n.language.startsWith("vi")
                                })}
                                onClick={() => changeLanguage("vi")}>
                                    <label className="whitespace-nowrap cursor-pointer">Vietnamese</label>
                                </li>
                            </ul>
                        </li>
            
                        {
                            isLoggedIn?
                                <li className="flex ml-auto p-2 cursor-pointer hover:bg-white/25 active:bg-white/10 landscape:ml-0 landscape:mt-auto"
                                onClick={() => logout()}>
                                    <ArrowLeftOnRectangleIcon className="w-6 h-6"/>
                                    <div className={classNames("overflow-hidden transition-all landscape:max-w-0", {
                                        "landscape:!max-w-full": isMenuExpanded
                                    })}>
                                        <label className="pl-4 whitespace-nowrap cursor-pointer">{t("menu.logout")}</label>
                                    </div>                
                                </li>
                            :
                                null
                        }
                        
                    </ul>
                </menu>

                <div className="relative flex-auto w-full h-full">
                    <div className="absolute flex w-full h-full overflow-auto">
                        <WrappedComponent {...props}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withMenubar;