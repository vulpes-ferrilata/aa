import React, { FunctionComponent, memo, useCallback } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { ErrorMessage } from '@hookform/error-message';

import {KeyIcon, EnvelopeIcon} from '@heroicons/react/24/outline';

import { useLoginMutation } from 'features/auth/api';

interface IProps {};

type Form = {
    email: string;
    password: string;
};

const Login: FunctionComponent<IProps> = (props: IProps) => {
    const {t} = useTranslation(["auth", "form"]);
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<Form>();
    const [login] = useLoginMutation();

    const onSubmit: SubmitHandler<Form> = useCallback(async data => {
        await login({
            email: data.email,
            password: data.password,
        }).unwrap();

        navigate("/");
    }, [login, navigate]);

    return (
        <div className="m-auto p-8 rounded-md shadow-lg
        dark:bg-slate-900 dark:shadow-white/10">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg
                    dark:bg-slate-800 dark:shadow-white/10 dark:focus-within:shadow-white/10">
                        <label htmlFor="email" className="w-10 p-2">
                            <EnvelopeIcon className="h-full"/>
                        </label>
                        
                        <input
                        id="email"
                        type="email" 
                        className="flex-auto border-0 bg-inherit focus:ring-0" 
                        placeholder={t("auth:login.form.email")}
                        {...register("email", {
                            required: {value: true, message: t("form:required", {field: t("auth:login.form.email")})},
                            pattern: {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, message:t("form:email", {field: t("auth:login.form.email")})},
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="email"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg
                    dark:bg-slate-800 dark:shadow-white/10 dark:focus-within:shadow-white/10">
                        <label htmlFor="password" className="w-10 p-2">
                            <KeyIcon className="h-full"/>
                        </label>
                        
                        <input
                        id="password"
                        type="password" 
                        className="flex-auto border-0 bg-inherit focus:ring-0"
                        placeholder={t("auth:login.form.password")}
                        {...register("password", {
                            required: {value: true, message: t("form:required", {field: t("auth:login.form.password")})},
                            minLength: {value: 8, message: t("form:min-length", {field: t("auth:login.form.password"), count: 8})},
                        })}/>
                    </div>

                    <ErrorMessage
                    errors={errors}
                    name="password"
                    render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <input 
                type="submit" 
                className="px-2 py-1 rounded-md shadow-md bg-blue-500 text-white cursor-pointer 
                hover:shadow-lg hover:bg-blue-400 
                active:shadow-md active:bg-blue-500 
                dark:shadow-white/10 dark:bg-blue-900 
                dark:hover:shadow-white/10 dark:hover:bg-blue-800
                dark:active:shadow-white/10 dark:active:bg-blue-900" value={t("auth:login.submit-button")}/>

                <div>
                    <label>{t("auth:login.register-instruction")}</label>

                    <Link to="/register" className="ml-1 text-green-500 hover:text-green-400 active:text-green-500">{t("auth:login.register-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default memo(Login);