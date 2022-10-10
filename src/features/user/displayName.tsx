import React, { memo } from 'react'
import { useGetUserQuery } from './api'

interface IProps {
    id: string;
}

function DisplayName(props: IProps) {
    const {data: user} = useGetUserQuery(props.id);

    return (
        <span className="w-full truncate">{user? user.displayName: props.id}</span>
    )
}

export default memo(DisplayName);