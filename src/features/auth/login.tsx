import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {KeyIcon, EnvelopeIcon} from '@heroicons/react/24/outline';

import { useLoginMutation } from 'features/auth/api';
import { useTranslation } from 'react-i18next';

interface iProps {}

function Login(props: iProps) {
    const {t} = useTranslation("auth");
    const navigate = useNavigate();
    const [login] = useLoginMutation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await login({
            email: email,
            password: password,
        }).unwrap();

        navigate("/");
    }

    return (
        <div className="m-auto p-8 rounded-md shadow-lg bg-white">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleLogin}>
                <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                    <label htmlFor="email" className="flex w-10">
                        <EnvelopeIcon className="w-6 m-auto"/>
                    </label>
                    
                    <input 
                    type="text" 
                    id="email" 
                    className="flex-auto border-0 focus:ring-0" 
                    value={email} 
                    placeholder={t("login.email")}
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                    <label htmlFor="password" className="flex w-10">
                        <KeyIcon className="w-6 m-auto"/>
                    </label>
                    
                    <input 
                    type="password" 
                    id="password" 
                    className="flex-auto border-0 focus:ring-0" 
                    value={password} 
                    placeholder={t("login.password")}
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <input type="submit" className="px-2 py-1 rounded-md shadow-lg shadow-blue-500/50 bg-blue-500 text-white cursor-pointer hover:shadow-md hover:shadow-blue-400/50 hover:bg-blue-400 active:shadow-lg active:shadow-blue-500/50 active:bg-blue-500" value={t("login.submit")}/>

                <div>
                    <label>{t("login.register-instruction")}</label>

                    <Link to="/register" className="ml-1 text-green-500 hover:text-green-400 active:text-green-500">{t("login.register-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;