import React from 'react';

import { useGetUserQuery } from 'features/user/api';

interface iProps {
    id: string;
}

function DisplayName(props: iProps) {
    const {data} = useGetUserQuery(props.id);

    return (
        <label className="w-full overflow-hidden text-ellipsis">{data?.displayName || props.id}</label>
    )
}

export default DisplayName;