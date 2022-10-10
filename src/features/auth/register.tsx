import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { SubmitHandler } from 'react-hook-form/dist/types';
import { ErrorMessage } from '@hookform/error-message';
import { useDispatch } from 'react-redux';

import {UserCircleIcon, EnvelopeIcon, KeyIcon} from '@heroicons/react/24/outline';

import { AppDispatch } from 'app/store';
import { useRegisterMutation } from 'features/auth/api';
import { addNotification, NotificationType } from 'features/notification/slice';
import withMenubar from 'shared/hoc/withMenubar';

interface IProps {};

type Form = {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

function Register(props: IProps) {
    const {t} = useTranslation(["auth", "form", "notification"]);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {register: registerForm, getValues, handleSubmit, formState: {errors}} = useForm<Form>();

    const [register] = useRegisterMutation();

    const onSubmit: SubmitHandler<Form> = async data => {
        await register({
            displayName: data.displayName,
            email: data.email,
            password: data.password,
        }).unwrap();

        dispatch(
            addNotification({
                type: NotificationType.Success,
                detail: t("notification:account-created-successfully")
            })
        );

        navigate("/");
    };

    return (
        <div className="m-auto p-8 rounded-md shadow-lg 
        dark:bg-slate-900 dark:shadow-white/10">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg
                    dark:bg-slate-800 dark:shadow-white/10 dark:focus-within:shadow-white/10">
                        <label htmlFor="display-name" className="w-10 p-2">
                            <UserCircleIcon className="h-full"/>
                        </label>
                        
                        <input
                        id="display-name"
                        type="text" 
                        className="flex-auto border-0 bg-inherit focus:ring-0" 
                        placeholder={t("auth:register.form.display-name")}
                        {...registerForm("displayName", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.display-name")})},
                            minLength: {value: 1, message: t("form:min-length", {field: t("auth:register.form.display-name"), count: 1})},
                            maxLength: {value: 20, message: t("form:max-length", {field: t("auth:register.form.display-name"), count: 20})}
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="displayName"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

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
                        placeholder={t("auth:register.form.email")}
                        {...registerForm("email", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.email")})},
                            pattern: {value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/, message:t("form:email", {field: t("auth:register.form.email")})},
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
                        placeholder={t("auth:register.form.password")}
                        {...registerForm("password", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.password")})},
                            minLength: {value: 8, message: t("form:min-length", {field: t("auth:login.form.password"), count: 8})},
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="password"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <div>
                    <div className="flex flex-row rounded-md shadow-md overflow-hidden focus-within:shadow-lg
                    dark:bg-slate-800 dark:shadow-white/10 dark:focus-within:shadow-white/10">
                        <label htmlFor="confirm-password" className="w-10 p-2">
                            <KeyIcon className="h-full"/>
                        </label>
                        
                        <input
                        id="confirm-password"
                        type="password"
                        className="flex-auto border-0 bg-inherit focus:ring-0" 
                        placeholder={t("auth:register.form.confirm-password")}
                        {...registerForm("confirmPassword", {
                            required: {value: true, message: t("form:required", {field: t("auth:register.form.confirm-password")})},
                            validate: {
                                equalPassword: value => value !== getValues("password")? t("form:equal-field", {field: t("auth:register.form.confirm-password"), otherField: t("auth:register.form.password")}): true,
                            }
                        })}/>
                    </div>

                    <ErrorMessage
                        errors={errors}
                        name="confirmPassword"
                        render={({message}) => <p className="text-red-600">{message}</p>}/>
                </div>

                <input 
                type="submit" 
                className="px-2 py-1 rounded-md shadow-md bg-green-500 text-white cursor-pointer 
                hover:shadow-lg hover:bg-green-400 
                active:shadow-md active:bg-green-500 
                dark:shadow-white/10 dark:bg-green-900 
                dark:hover:shadow-white/10 dark:hover:bg-green-800
                dark:active:shadow-white/10 dark:active:bg-green-900" value={t("auth:register.submit-button")}/>
            
                <div>
                    <label>{t("register.login-instruction")}</label>

                    <Link to="/login" className="ml-1 text-blue-500 hover:text-blue-400 active:text-blue-500">{t("register.login-link")}</Link>
                </div>
            </form>
        </div>
    );
}

export default withMenubar(memo(Register));