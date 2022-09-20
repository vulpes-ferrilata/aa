import React, {FormEvent, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {UserCircleIcon, EnvelopeIcon, KeyIcon} from '@heroicons/react/24/outline';

import { useRegisterMutation } from 'features/auth/api';
import { useTranslation } from 'react-i18next';

interface iProps {}

function Register(props: iProps) {
    const {t} = useTranslation("auth");
    const navigate = useNavigate();

    const [register] = useRegisterMutation();

    const [displayName, setDisplayName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await register({
            email: email,
            password: password,
            displayName: displayName,
        }).unwrap()

        navigate("/")
    }

    return (
        <div className="rounded-md shadow-lg m-auto p-8">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleRegister}>
                <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                    <label htmlFor="display-name" className="flex w-10">
                        <UserCircleIcon className="w-6 m-auto"/>
                    </label>
                    
                    <input 
                    type="text" 
                    id="display-name" 
                    className="flex-auto border-0 focus:ring-0" 
                    value={displayName} 
                    placeholder={t("register.display-name")}
                    onChange={(e) => {setDisplayName(e.target.value)}}/>
                </div>

                <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                    <label htmlFor="email" className="flex w-10">
                        <EnvelopeIcon className="w-6 m-auto"/>
                    </label>
                    
                    <input 
                    type="email" 
                    id="email" 
                    className="flex-auto border-0 focus:ring-0" 
                    value={email} 
                    placeholder={t("register.email")}
                    onChange={e => setEmail(e.target.value)}/>
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
                    placeholder={t("register.password")}
                    onChange={e => setPassword(e.target.value)}/>
                </div>

                <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                    <label htmlFor="confirm-password" className="flex w-10">
                        <KeyIcon className="w-6 m-auto"/>
                    </label>
                    
                    <input 
                    type="password" 
                    id="confirm-password" 
                    className="flex-auto border-0 focus:ring-0" 
                    value={confirmPassword} 
                    placeholder={t("register.confirm-password")}
                    onChange={e => setConfirmPassword(e.target.value)}/>
                </div>

                <input type="submit" className="px-2 py-1 rounded-md shadow-lg shadow-green-500/50 bg-green-500 text-white cursor-pointer hover:shadow-md hover:shadow-green-400/50 hover:bg-green-400 active:shadow-lg active:shadow-green-500/50 active:bg-green-500" value={t("register.submit")}/>
            
                <div>
                    <label>{t("register.login-instruction")}</label>

                    <Link to="/login" className="ml-1 text-blue-500 hover:text-blue-400 active:text-blue-500">{t("register.login-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default Register;