import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {KeyIcon, EnvelopeIcon} from '@heroicons/react/24/outline';

import { useLoginMutation } from 'features/auth/api';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { ErrorMessage } from '@hookform/error-message';

interface IProps {}

type Form = {
    email: string;
    password: string;
}

function Login(props: IProps) {
    const {t} = useTranslation(["auth", "form"]);
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<Form>();
    const [login] = useLoginMutation();

    const onSubmit: SubmitHandler<Form> = async data => {
        await login({
            email: data.email,
            password: data.password,
        }).unwrap();

        navigate("/");
    }

    return (
        <div className="m-auto p-8 rounded-md shadow-lg bg-white">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="email" className="flex w-10">
                            <EnvelopeIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="email"
                        type="email" 
                        className="flex-auto border-0 focus:ring-0" 
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
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg">
                        <label htmlFor="password" className="flex w-10">
                            <KeyIcon className="w-6 m-auto"/>
                        </label>
                        
                        <input
                        id="password"
                        type="password" 
                        className="flex-auto border-0 focus:ring-0"
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

                <input type="submit" className="px-2 py-1 rounded-md shadow-lg shadow-blue-500/50 bg-blue-500 text-white cursor-pointer hover:shadow-md hover:shadow-blue-400/50 hover:bg-blue-400 active:shadow-lg active:shadow-blue-500/50 active:bg-blue-500" value={t("auth:login.submit-button")}/>

                <div>
                    <label>{t("auth:login.register-instruction")}</label>

                    <Link to="/register" className="ml-1 text-green-500 hover:text-green-400 active:text-green-500">{t("auth:login.register-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default Login;