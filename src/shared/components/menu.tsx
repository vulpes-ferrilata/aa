import React, { FunctionComponent, memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ArrowLeftOnRectangleIcon, SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';
import { ReactComponent as TumbleweedIcon } from 'assets/svg/tumbleweed.svg';

import { RootState } from 'app/store';
import { setScheme } from 'features/colorScheme/slice';
import { ColorScheme } from 'features/colorScheme/types';
import { useRevokeMutation } from 'features/auth/api';

interface IProps {
    children?: ReactNode;
}

const Menu: FunctionComponent<IProps> = (props: IProps) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation("common");
    const navigate = useNavigate();
    const [revoke] = useRevokeMutation();

    const colorScheme = useSelector<RootState, ColorScheme>(state => state.colorScheme);
    const isLoggedIn = useSelector<RootState, boolean>(state => !!state.auth.accessToken);
    const refreshToken = useSelector<RootState, string | undefined>(state => state.auth.refreshToken);

    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false);
    const menuContainerRef = useRef<HTMLUListElement>(null);

    const [isLanguageExpanded, setIsLanguageExpanded] = useState<boolean>(false);

    const toggleColorScheme = useCallback(() => {
        switch (colorScheme) {
            case ColorScheme.Light:
                dispatch(setScheme(ColorScheme.Dark));
                break;
            case ColorScheme.Dark:
                dispatch(setScheme(ColorScheme.Light));
                break;
        }
    }, [dispatch, colorScheme]);

    const toggleMenuDescription = useCallback((event: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            setIsMenuExpanded(wasMenuExpanded => !wasMenuExpanded);
        }            
    }, []);

    const toggleLanguageSubmenu = useCallback(() => {
        setIsLanguageExpanded(wasLanguageExpanded => !wasLanguageExpanded);
    }, []);

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

    const logout = useCallback(() => {
        refreshToken && revoke(refreshToken);

        navigate("/");
    }, [revoke, navigate, refreshToken]);

    const renderColorScheme = useMemo(() => {
        switch (colorScheme) {
            case ColorScheme.Light:
                return (
                    <>
                        <MoonIcon className="w-6 h-6"/>
                        <div className={classNames("max-w-0 overflow-hidden transition-all", {
                            "landscape:!max-w-full":isMenuExpanded
                        })}>
                            <span className="pl-2 whitespace-nowrap cursor-pointer">Dark Mode</span>
                        </div>
                    </>
                )
            case ColorScheme.Dark:
                return (
                    <>
                        <SunIcon className="w-6 h-6"/>
                        <div className={classNames("max-w-0 overflow-hidden transition-all", {
                            "landscape:!max-w-full": isMenuExpanded
                        })}>
                            <span className="pl-2 whitespace-nowrap cursor-pointer">Light Mode</span>
                        </div>
                    </> 
                )
        }
    }, [colorScheme, isMenuExpanded]);

    return (
        <div className="flex flex-col w-full h-full landscape:flex-row">
            <menu className="rounded-b-md bg-blue-600 text-slate-300 landscape:rounded-b-none landscape:!rounded-r-md dark:bg-blue-900">
                <ul ref={menuContainerRef} className="flex w-full h-full landscape:flex-col" onClick={(event) => toggleMenuDescription(event)}>
                    <li className="p-2 cursor-pointer">
                        <NavLink to="/" className="flex">
                            <TumbleweedIcon className="w-6 h-6"/>

                            <div className={classNames("overflow-hidden transition-all landscape:max-w-0", {
                                "landscape:!max-w-full": isMenuExpanded
                            })}>
                                <span className="pl-2 whitespace-nowrap cursor-pointer">Tumbleweeds</span>
                            </div>
                        </NavLink>
                    </li>
                    
                    <li className="flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10" onClick={() => toggleColorScheme()}>
                        {renderColorScheme}                
                    </li>

                    <li className="relative">
                        <div className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                            "text-white": isLanguageExpanded
                        })}
                        onClick={() => toggleLanguageSubmenu()}>
                            <LanguageIcon className="w-6 h-6"/>
                            <div className={classNames("max-w-0 overflow-hidden transition-all", {
                                "landscape:!max-w-full": isMenuExpanded
                            })}>
                                <span className="pl-2 whitespace-nowrap cursor-pointer">{t("menu.language")}</span>
                            </div>
                        </div>

                        <ul className={classNames("absolute left-0 top-full max-h-0 min-w-full rounded-b-md bg-blue-600 overflow-hidden z-40 transition-all dark:bg-blue-900 landscape:left-full landscape:top-0 landscape:min-w-0 landscape:max-w-0 landscape:max-h-screen landscape:rounded-b-none landscape:!rounded-r-md", {
                            "!max-h-screen landscape:!max-w-screen": isLanguageExpanded
                        })}>
                            <li className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                                "text-white": i18n.language.startsWith("en")
                            })}
                            onClick={() => changeLanguage("en")}>
                                <span className="whitespace-nowrap cursor-pointer">English</span>
                            </li>

                            <li className={classNames("flex p-2 cursor-pointer hover:bg-white/25 active:bg-white/10", {
                                "text-white": i18n.language.startsWith("vi")
                            })}
                            onClick={() => changeLanguage("vi")}>
                                <span className="whitespace-nowrap cursor-pointer">Vietnamese</span>
                            </li>
                        </ul>
                    </li>
        
                    {
                        isLoggedIn?
                            <li className="flex ml-auto p-2 cursor-pointer hover:bg-white/25 active:bg-white/10 landscape:ml-0 landscape:mt-auto"
                            onClick={() => logout()}>
                                <ArrowLeftOnRectangleIcon className="w-6 h-6"/>
                                <div className={classNames("max-w-0 overflow-hidden transition-all", {
                                    "landscape:!max-w-full": isMenuExpanded
                                })}>
                                    <span className="pl-2 whitespace-nowrap cursor-pointer">{t("menu.logout")}</span>
                                </div>                
                            </li>
                        :
                            null
                    }
                    
                </ul>
            </menu>

            <div className="relative flex-auto w-full h-full">
                <div className="absolute flex w-full h-full overflow-auto">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default memo(Menu);