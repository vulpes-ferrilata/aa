import React, { useEffect, useMemo, useState } from 'react';
import { ResourceCardType } from 'features/catan/api';

interface IProps {
    type: ResourceCardType;
};

function ResourceCard(props: IProps) {
    const [src, setSrc] = useState<string>();
    
    useEffect(() => {
        switch (props.type) {
            case "LUMBER":
                import('assets/images/resource-lumber.png').then(image => setSrc(image.default));
                break;
            case "BRICK":
                import('assets/images/resource-brick.png').then(image => setSrc(image.default));
                break;
            case "WOOL":
                import('assets/images/resource-wool.png').then(image => setSrc(image.default));
                break;
            case "GRAIN":
                import('assets/images/resource-grain.png').then(image => setSrc(image.default));
                break;
            case "ORE":
                import('assets/images/resource-ore.png').then(image => setSrc(image.default));
                break;
            case "HIDDEN":
                import('assets/images/resource-hidden.png').then(image => setSrc(image.default));
                break;
        }
    }, [props.type]);

    const alt = useMemo(() => {
        switch (props.type) {
            case "LUMBER":
                return "lumber resource card";
            case "BRICK":
                return "brick resource card";
            case "WOOL":
                return "wool resource card";
            case "GRAIN":
                return "grain resource card";
            case "ORE":
                return "ore resource card";
            case "HIDDEN":
                return "hidden resource card";
        }
    }, [props.type]);

    return (
        <div className="h-full aspect-2/3">
            {
                src?
                    <img src={src} alt={alt} className="max-h-full"/>
                :
                    <div className="w-full h-full bg-slate-100 animate-pulse"/>
            }     
        </div>   
    );
}

export default ResourceCard;