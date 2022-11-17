import { RootState } from 'app/store';
import classNames from 'classnames';
import { ColorScheme } from 'features/colorScheme/types';
import React, { FunctionComponent, memo, ReactNode } from 'react';
import { useSelector } from 'react-redux';

interface IProps {
    children?: ReactNode;
};

const Layout: FunctionComponent<IProps> = (props: IProps) => {
    const colorScheme = useSelector<RootState, ColorScheme>(state => state.colorScheme);

    return (
        <div className={classNames("w-full h-full", {
        "dark": colorScheme === ColorScheme.Dark
        })}>
            <div className="flex w-full h-full dark:bg-black dark:text-white dark:shadow-white/10">
                {props.children}
            </div>
        </div>
    );
}

export default memo(Layout);